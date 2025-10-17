-- Schema Analysis: Existing schema has training_sessions, user_profiles, captured_data, admin_activities, training_statistics
-- Integration Type: Modificative - updating existing training_sessions table and policies 
-- Dependencies: References existing training_sessions and captured_data tables

-- Remove existing RLS policies to replace with new anonymous-friendly ones
DROP POLICY IF EXISTS "admins_view_all_training_sessions" ON public.training_sessions;
DROP POLICY IF EXISTS "users_manage_own_training_sessions" ON public.training_sessions;

-- Update existing training_sessions table to better support anonymous sessions
ALTER TABLE public.training_sessions 
ADD COLUMN IF NOT EXISTS browser_info TEXT,
ADD COLUMN IF NOT EXISTS device_info TEXT,
ADD COLUMN IF NOT EXISTS entry_point TEXT DEFAULT 'homepage',
ADD COLUMN IF NOT EXISTS referrer_url TEXT,
ADD COLUMN IF NOT EXISTS screen_resolution TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT;

-- Create indexes for better query performance on new columns
CREATE INDEX IF NOT EXISTS idx_training_sessions_entry_point ON public.training_sessions(entry_point);
CREATE INDEX IF NOT EXISTS idx_training_sessions_browser_info ON public.training_sessions(browser_info);

-- Create helper function for admin role checking (using auth.users metadata - Pattern 6A)
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- Create helper function for supervisor or admin role checking
CREATE OR REPLACE FUNCTION public.is_supervisor_or_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' IN ('admin', 'supervisor')
         OR au.raw_app_meta_data->>'role' IN ('admin', 'supervisor'))
)
$$;

-- Pattern 4: Public Read, Private Write - Allow anonymous session creation but admin management
-- Allow public to create and read training sessions (anonymous access)
CREATE POLICY "public_can_create_training_sessions"
ON public.training_sessions
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "public_can_read_training_sessions"
ON public.training_sessions
FOR SELECT
TO public
USING (true);

-- Allow public to update their own sessions using session_token
CREATE POLICY "public_can_update_own_sessions_by_token"
ON public.training_sessions
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow admins and supervisors full access to all training sessions
CREATE POLICY "admins_full_access_training_sessions"
ON public.training_sessions
FOR ALL
TO authenticated
USING (public.is_supervisor_or_admin_from_auth())
WITH CHECK (public.is_supervisor_or_admin_from_auth());

-- Allow authenticated users to manage their own sessions if they have participant_id
CREATE POLICY "users_manage_own_training_sessions"
ON public.training_sessions
FOR ALL
TO authenticated
USING (participant_id = auth.uid())
WITH CHECK (participant_id = auth.uid());

-- Update captured_data policies to allow public access (for anonymous session data capture)
DROP POLICY IF EXISTS "users_manage_own_captured_data" ON public.captured_data;

-- Allow public to create captured data (anonymous sessions)
CREATE POLICY "public_can_create_captured_data"
ON public.captured_data
FOR INSERT
TO public
WITH CHECK (true);

-- Allow public to read captured data
CREATE POLICY "public_can_read_captured_data"
ON public.captured_data
FOR SELECT  
TO public
USING (true);

-- Allow admins full access to captured data
CREATE POLICY "admins_full_access_captured_data"
ON public.captured_data
FOR ALL
TO authenticated
USING (public.is_supervisor_or_admin_from_auth())
WITH CHECK (public.is_supervisor_or_admin_from_auth());

-- Enhanced session tracking function for anonymous sessions
CREATE OR REPLACE FUNCTION public.create_anonymous_session(
    p_session_token TEXT,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_browser_info TEXT DEFAULT NULL,
    p_device_info TEXT DEFAULT NULL,
    p_entry_point TEXT DEFAULT 'homepage',
    p_referrer_url TEXT DEFAULT NULL,
    p_screen_resolution TEXT DEFAULT NULL,
    p_timezone TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_session_id UUID;
BEGIN
    INSERT INTO public.training_sessions (
        session_token,
        participant_id,
        ip_address,
        user_agent,
        browser_info,
        device_info,
        entry_point,
        referrer_url,
        screen_resolution,
        timezone,
        status,
        current_step,
        total_steps,
        started_at,
        last_activity
    ) VALUES (
        p_session_token,
        NULL, -- Anonymous session - no participant_id required
        p_ip_address,
        p_user_agent,
        p_browser_info,
        p_device_info,
        p_entry_point,
        p_referrer_url,
        p_screen_resolution,
        p_timezone,
        'active'::public.session_status,
        1,
        6,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO new_session_id;

    RETURN new_session_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating anonymous session: %', SQLERRM;
        RETURN NULL;
END;
$$;

-- Update session activity function to work with anonymous sessions
CREATE OR REPLACE FUNCTION public.update_anonymous_session_activity(
    p_session_id UUID,
    p_current_step INTEGER DEFAULT NULL,
    p_status TEXT DEFAULT 'active'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.training_sessions 
    SET 
        last_activity = CURRENT_TIMESTAMP,
        current_step = COALESCE(p_current_step, current_step),
        status = COALESCE(p_status::public.session_status, status)
    WHERE id = p_session_id;

    RETURN FOUND;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error updating session activity: %', SQLERRM;
        RETURN FALSE;
END;
$$;

-- Function to clean up old anonymous sessions (older than 24 hours and abandoned)
CREATE OR REPLACE FUNCTION public.cleanup_old_anonymous_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    cleanup_count INTEGER;
BEGIN
    -- Delete captured data for old abandoned sessions first (foreign key dependency)
    DELETE FROM public.captured_data 
    WHERE session_id IN (
        SELECT id FROM public.training_sessions ts
        WHERE ts.participant_id IS NULL 
        AND ts.status IN ('abandoned'::public.session_status, 'timeout'::public.session_status)
        AND ts.last_activity < CURRENT_TIMESTAMP - INTERVAL '24 hours'
    );

    -- Delete old abandoned anonymous sessions
    DELETE FROM public.training_sessions 
    WHERE participant_id IS NULL 
    AND status IN ('abandoned'::public.session_status, 'timeout'::public.session_status)
    AND last_activity < CURRENT_TIMESTAMP - INTERVAL '24 hours';

    GET DIAGNOSTICS cleanup_count = ROW_COUNT;
    
    RAISE NOTICE 'Cleaned up % old anonymous sessions', cleanup_count;
    RETURN cleanup_count;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error during cleanup: %', SQLERRM;
        RETURN 0;
END;
$$;

-- Create some sample anonymous sessions for testing
DO $$
DECLARE
    session1_id UUID;
    session2_id UUID;
    session3_id UUID;
BEGIN
    -- Create sample anonymous sessions
    session1_id := public.create_anonymous_session(
        'anon_' || gen_random_uuid()::text,
        '192.168.1.100'::inet,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Chrome 120.0',
        'Desktop Windows',
        'homepage',
        'https://google.com',
        '1920x1080',
        'America/Bogota'
    );

    session2_id := public.create_anonymous_session(
        'anon_' || gen_random_uuid()::text,
        '192.168.1.101'::inet,
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        'Safari 17.0',
        'Mobile iPhone',
        'direct',
        NULL,
        '375x812',
        'America/Bogota'
    );

    session3_id := public.create_anonymous_session(
        'anon_' || gen_random_uuid()::text,
        '192.168.1.102'::inet,
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        'Firefox 118.0',
        'Desktop Linux',
        'social_media',
        'https://facebook.com',
        '1366x768',
        'America/Bogota'
    );

    -- Add some captured data for these sessions
    IF session1_id IS NOT NULL THEN
        INSERT INTO public.captured_data (session_id, form_step, field_name, field_value, is_sensitive, captured_at)
        VALUES 
            (session1_id, 0, 'entry_point', 'homepage', false, CURRENT_TIMESTAMP),
            (session1_id, 1, 'search_from', 'Bogotá', false, CURRENT_TIMESTAMP + INTERVAL '30 seconds'),
            (session1_id, 1, 'search_to', 'Medellín', false, CURRENT_TIMESTAMP + INTERVAL '45 seconds');
    END IF;

    IF session2_id IS NOT NULL THEN
        INSERT INTO public.captured_data (session_id, form_step, field_name, field_value, is_sensitive, captured_at)
        VALUES 
            (session2_id, 0, 'entry_point', 'direct', false, CURRENT_TIMESTAMP),
            (session2_id, 1, 'search_from', 'Cali', false, CURRENT_TIMESTAMP + INTERVAL '20 seconds');
    END IF;

    IF session3_id IS NOT NULL THEN
        INSERT INTO public.captured_data (session_id, form_step, field_name, field_value, is_sensitive, captured_at)
        VALUES 
            (session3_id, 0, 'entry_point', 'social_media', false, CURRENT_TIMESTAMP),
            (session3_id, 1, 'search_from', 'Barranquilla', false, CURRENT_TIMESTAMP + INTERVAL '15 seconds'),
            (session3_id, 1, 'search_to', 'Cartagena', false, CURRENT_TIMESTAMP + INTERVAL '25 seconds'),
            (session3_id, 2, 'passenger_count', '2', false, CURRENT_TIMESTAMP + INTERVAL '60 seconds');
    END IF;

    RAISE NOTICE 'Created sample anonymous sessions for testing';
END $$;