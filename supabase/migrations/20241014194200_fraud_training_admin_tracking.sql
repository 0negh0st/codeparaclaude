-- Location: supabase/migrations/20241014194200_fraud_training_admin_tracking.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete new schema for fraud training admin tracking
-- Dependencies: None - fresh project

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'participant', 'supervisor');
CREATE TYPE public.session_status AS ENUM ('active', 'completed', 'abandoned', 'timeout');
CREATE TYPE public.vulnerability_level AS ENUM ('low', 'medium', 'high', 'critical');

-- 2. User Profiles (Critical intermediary table)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'participant'::public.user_role,
    department TEXT,
    company TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Training Sessions Tracking
CREATE TABLE public.training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    status public.session_status DEFAULT 'active'::public.session_status,
    ip_address INET,
    user_agent TEXT,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER DEFAULT 6,
    vulnerability_score INTEGER DEFAULT 0,
    risk_level public.vulnerability_level DEFAULT 'low'::public.vulnerability_level
);

-- 4. Form Data Capture
CREATE TABLE public.captured_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
    form_step INTEGER NOT NULL,
    field_name TEXT NOT NULL,
    field_value TEXT,
    is_sensitive BOOLEAN DEFAULT false,
    captured_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Admin Activity Logs
CREATE TABLE public.admin_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Training Statistics
CREATE TABLE public.training_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_sessions INTEGER DEFAULT 0,
    completed_sessions INTEGER DEFAULT 0,
    abandoned_sessions INTEGER DEFAULT 0,
    average_completion_time INTERVAL,
    high_risk_participants INTEGER DEFAULT 0,
    data_points_captured INTEGER DEFAULT 0
);

-- 7. Essential Indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_training_sessions_participant_id ON public.training_sessions(participant_id);
CREATE INDEX idx_training_sessions_status ON public.training_sessions(status);
CREATE INDEX idx_training_sessions_started_at ON public.training_sessions(started_at);
CREATE INDEX idx_captured_data_session_id ON public.captured_data(session_id);
CREATE INDEX idx_captured_data_form_step ON public.captured_data(form_step);
CREATE INDEX idx_admin_activities_admin_id ON public.admin_activities(admin_id);
CREATE INDEX idx_admin_activities_created_at ON public.admin_activities(created_at);
CREATE INDEX idx_training_statistics_date ON public.training_statistics(date);

-- 8. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captured_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_statistics ENABLE ROW LEVEL SECURITY;

-- 9. Helper Functions (BEFORE RLS policies)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
)
$$;

CREATE OR REPLACE FUNCTION public.is_supervisor_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('admin', 'supervisor')
)
$$;

-- 10. RLS Policies

-- Pattern 1: Core user table - simple direct comparison
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for training sessions
CREATE POLICY "users_manage_own_training_sessions"
ON public.training_sessions
FOR ALL
TO authenticated
USING (participant_id = auth.uid())
WITH CHECK (participant_id = auth.uid());

-- Admin can view all sessions
CREATE POLICY "admins_view_all_training_sessions"
ON public.training_sessions
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Pattern 2: Captured data belongs to session participant
CREATE POLICY "users_view_own_captured_data"
ON public.captured_data
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.training_sessions ts
        WHERE ts.id = session_id AND ts.participant_id = auth.uid()
    )
);

-- Admin can view all captured data
CREATE POLICY "admins_view_all_captured_data"
ON public.captured_data
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Pattern 2: Admin activities - simple ownership
CREATE POLICY "admins_manage_own_activities"
ON public.admin_activities
FOR ALL
TO authenticated
USING (admin_id = auth.uid())
WITH CHECK (admin_id = auth.uid());

-- Admin and supervisors can view all activities
CREATE POLICY "supervisors_view_admin_activities"
ON public.admin_activities
FOR SELECT
TO authenticated
USING (public.is_supervisor_or_admin());

-- Training statistics - admin only access
CREATE POLICY "admins_manage_training_statistics"
ON public.training_statistics
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 11. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'participant')::public.user_role
  );  
  RETURN NEW;
END;
$$;

-- 12. Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. Complete Mock Data with Authentication
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    participant1_uuid UUID := gen_random_uuid();
    participant2_uuid UUID := gen_random_uuid();
    session1_id UUID := gen_random_uuid();
    session2_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@cybersafety.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (participant1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'participant1@company.com', crypt('demo123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Maria Gonzalez", "role": "participant"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (participant2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'participant2@company.com', crypt('demo123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Carlos Rodriguez", "role": "participant"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create training sessions
    INSERT INTO public.training_sessions (id, participant_id, session_token, status, ip_address, user_agent, current_step, vulnerability_score, risk_level) VALUES
        (session1_id, participant1_uuid, 'sess_' || encode(gen_random_bytes(16), 'hex'), 'completed'::public.session_status, '192.168.1.100', 'Mozilla/5.0 Chrome/91.0', 6, 85, 'high'::public.vulnerability_level),
        (session2_id, participant2_uuid, 'sess_' || encode(gen_random_bytes(16), 'hex'), 'active'::public.session_status, '192.168.1.101', 'Mozilla/5.0 Firefox/89.0', 3, 45, 'medium'::public.vulnerability_level);

    -- Create captured data samples
    INSERT INTO public.captured_data (session_id, form_step, field_name, field_value, is_sensitive) VALUES
        (session1_id, 2, 'fullName', 'Maria Gonzalez', false),
        (session1_id, 2, 'email', 'maria.gonzalez@email.com', true),
        (session1_id, 2, 'phone', '+57-123-456-7890', true),
        (session1_id, 4, 'cardNumber', '4532-****-****-1234', true),
        (session1_id, 4, 'expiryDate', '12/25', true),
        (session2_id, 2, 'fullName', 'Carlos Rodriguez', false),
        (session2_id, 2, 'email', 'carlos.rodriguez@email.com', true);

    -- Create admin activities
    INSERT INTO public.admin_activities (admin_id, activity_type, description, metadata) VALUES
        (admin_uuid, 'session_monitoring', 'Reviewed high-risk participant session', '{"session_id": "' || session1_id || '", "risk_level": "high"}'::jsonb),
        (admin_uuid, 'data_export', 'Exported training statistics report', '{"date_range": "2024-10-01 to 2024-10-14", "total_sessions": 156}'::jsonb);

    -- Create training statistics
    INSERT INTO public.training_statistics (date, total_sessions, completed_sessions, abandoned_sessions, average_completion_time, high_risk_participants, data_points_captured) VALUES
        (CURRENT_DATE - INTERVAL '1 day', 45, 38, 7, INTERVAL '18 minutes', 12, 234),
        (CURRENT_DATE, 32, 28, 4, INTERVAL '16 minutes', 8, 189);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 14. Cleanup function for testing
CREATE OR REPLACE FUNCTION public.cleanup_fraud_training_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@cybersafety.com' OR email LIKE '%@company.com';

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.captured_data WHERE session_id IN (
        SELECT id FROM public.training_sessions WHERE participant_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.admin_activities WHERE admin_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.training_sessions WHERE participant_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.training_statistics WHERE date >= CURRENT_DATE - INTERVAL '7 days';
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);

    RAISE NOTICE 'Fraud training data cleanup completed successfully';
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END $$;