-- Fix mobile session tracking by adjusting timeout values for realistic mobile usage
-- Created: 2024-10-16 22:50:21

-- Update the session cleanup function to be less aggressive for mobile users
CREATE OR REPLACE FUNCTION public.mark_inactive_sessions()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    timeout_count INTEGER;
BEGIN
    -- Mark sessions as abandoned if no activity for more than 10 minutes (mobile-friendly)
    -- This gives users time for phone calls, app switching, slow connections, etc.
    UPDATE public.training_sessions 
    SET 
        status = 'abandoned'::public.session_status,
        last_activity = CURRENT_TIMESTAMP
    WHERE status = 'active'::public.session_status 
    AND last_activity < CURRENT_TIMESTAMP - INTERVAL '10 minutes';
    
    GET DIAGNOSTICS timeout_count = ROW_COUNT;
    
    RAISE NOTICE 'Marked % sessions as abandoned after 10 minutes', timeout_count;
    RETURN timeout_count;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error marking inactive sessions: %', SQLERRM;
        RETURN 0;
END;
$function$;

-- Update the active session count function to include sessions with longer inactivity periods
CREATE OR REPLACE FUNCTION public.get_active_client_session_count()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    active_count INTEGER;
BEGIN
    -- First clean up truly inactive sessions (10 minute timeout)
    UPDATE public.training_sessions 
    SET 
        status = 'abandoned'::public.session_status,
        last_activity = CURRENT_TIMESTAMP
    WHERE status = 'active'::public.session_status 
    AND last_activity < CURRENT_TIMESTAMP - INTERVAL '10 minutes';
    
    -- Count NON-ADMIN active sessions with mobile-friendly activity window
    SELECT COUNT(*) INTO active_count
    FROM public.training_sessions ts
    LEFT JOIN public.user_profiles up ON ts.participant_id = up.id
    WHERE ts.status = 'active'::public.session_status
    AND ts.last_activity > CURRENT_TIMESTAMP - INTERVAL '12 minutes' -- Slightly longer than cleanup
    AND (
        -- Anonymous sessions (no participant_id) - MOBILE USERS
        ts.participant_id IS NULL
        OR (
            -- Authenticated sessions that are NOT admin
            up.role IS NULL 
            OR up.role != 'admin'::public.user_role
        )
    )
    AND (
        -- Exclude known admin emails
        up.email IS NULL 
        OR (
            up.email NOT LIKE '%admin%' 
            AND up.email != 'bendeck112@gmail.com'
            AND up.email != 'rappiesunamierdota@gmail.com'
        )
    );
    
    RETURN COALESCE(active_count, 0);
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error counting active sessions: %', SQLERRM;
        RETURN 0;
END;
$function$;

-- Also update the admin service function used in the React app
CREATE OR REPLACE FUNCTION public.get_active_sessions_with_activity(limit_count integer DEFAULT 50)
 RETURNS TABLE(
    id uuid,
    session_token text,
    participant_id uuid,
    entry_point text,
    ip_address inet,
    user_agent text,
    current_step integer,
    status session_status,
    started_at timestamptz,
    last_activity timestamptz,
    participant_name text,
    participant_email text,
    participant_role user_role,
    is_recently_active boolean,
    captured_data_count bigint
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Clean up old sessions first (10 minute timeout)
    UPDATE public.training_sessions 
    SET status = 'abandoned'::public.session_status
    WHERE status = 'active'::public.session_status 
    AND last_activity < CURRENT_TIMESTAMP - INTERVAL '10 minutes';
    
    -- Return active sessions with mobile-friendly activity tracking
    RETURN QUERY
    SELECT 
        ts.id,
        ts.session_token,
        ts.participant_id,
        ts.entry_point,
        ts.ip_address,
        ts.user_agent,
        ts.current_step,
        ts.status,
        ts.started_at,
        ts.last_activity,
        up.full_name as participant_name,
        up.email as participant_email,
        up.role as participant_role,
        -- Consider "recently active" as within 5 minutes (mobile-friendly)
        (ts.last_activity > CURRENT_TIMESTAMP - INTERVAL '5 minutes') as is_recently_active,
        COALESCE(cd.captured_count, 0) as captured_data_count
    FROM public.training_sessions ts
    LEFT JOIN public.user_profiles up ON ts.participant_id = up.id
    LEFT JOIN (
        SELECT session_id, COUNT(*) as captured_count
        FROM public.captured_data
        GROUP BY session_id
    ) cd ON ts.id = cd.session_id
    WHERE ts.status = 'active'::public.session_status
    AND ts.last_activity > CURRENT_TIMESTAMP - INTERVAL '12 minutes'
    ORDER BY ts.last_activity DESC
    LIMIT limit_count;
END;
$function$;

-- Add a comment explaining the mobile-friendly changes
COMMENT ON FUNCTION public.mark_inactive_sessions() IS 'Mobile-friendly session cleanup: 10 minute timeout allows for phone calls, app switching, and slower mobile connections';
COMMENT ON FUNCTION public.get_active_client_session_count() IS 'Mobile-friendly session counting: 12 minute activity window captures mobile users with intermittent connectivity';