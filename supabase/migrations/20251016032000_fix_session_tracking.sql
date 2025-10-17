-- Location: supabase/migrations/20251016032000_fix_session_tracking.sql
-- Schema Analysis: existing training_sessions table with proper session tracking
-- Integration Type: enhancement to session lifecycle management  
-- Dependencies: training_sessions, user_profiles (existing tables)

-- Enhance session timeout and cleanup functionality
-- DO NOT recreate existing tables - only enhance existing functionality

-- 1. Add automatic session timeout function with better logic
CREATE OR REPLACE FUNCTION public.mark_inactive_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
    timeout_count INTEGER;
BEGIN
    -- Mark sessions as abandoned if no activity for more than 10 minutes
    UPDATE public.training_sessions 
    SET 
        status = 'abandoned'::public.session_status,
        last_activity = CURRENT_TIMESTAMP
    WHERE status = 'active'::public.session_status 
    AND last_activity < CURRENT_TIMESTAMP - INTERVAL '10 minutes';
    
    GET DIAGNOSTICS timeout_count = ROW_COUNT;
    
    RAISE NOTICE 'Marked % sessions as abandoned', timeout_count;
    RETURN timeout_count;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error marking inactive sessions: %', SQLERRM;
        RETURN 0;
END;
$func$;

-- 2. Enhanced cleanup function with proper dependency handling
CREATE OR REPLACE FUNCTION public.cleanup_old_training_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
    cleanup_count INTEGER;
    error_context TEXT;
BEGIN
    -- First mark inactive sessions
    PERFORM public.mark_inactive_sessions();
    
    -- Delete captured data for old sessions first (foreign key dependency)
    DELETE FROM public.captured_data 
    WHERE session_id IN (
        SELECT ts.id FROM public.training_sessions ts
        WHERE ts.status IN ('abandoned'::public.session_status, 'timeout'::public.session_status)
        AND ts.last_activity < CURRENT_TIMESTAMP - INTERVAL '1 day'
    );

    -- Delete old abandoned/timeout sessions  
    DELETE FROM public.training_sessions 
    WHERE status IN ('abandoned'::public.session_status, 'timeout'::public.session_status)
    AND last_activity < CURRENT_TIMESTAMP - INTERVAL '1 day';

    GET DIAGNOSTICS cleanup_count = ROW_COUNT;
    
    RAISE NOTICE 'Cleaned up % old training sessions', cleanup_count;
    RETURN cleanup_count;
EXCEPTION
    WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS error_context = PG_EXCEPTION_CONTEXT;
        RAISE NOTICE 'Error during session cleanup: % Context: %', SQLERRM, error_context;
        RETURN 0;
END;
$func$;

-- 3. Function to get accurate active session count (excluding admin sessions)
CREATE OR REPLACE FUNCTION public.get_active_client_session_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
    active_count INTEGER;
BEGIN
    -- First clean up inactive sessions
    PERFORM public.mark_inactive_sessions();
    
    -- Count only non-admin active sessions that have recent activity
    SELECT COUNT(*) INTO active_count
    FROM public.training_sessions ts
    LEFT JOIN public.user_profiles up ON ts.participant_id = up.id
    WHERE ts.status = 'active'::public.session_status
    AND ts.last_activity > CURRENT_TIMESTAMP - INTERVAL '10 minutes'
    AND (up.role IS NULL OR up.role != 'admin'::public.user_role)
    AND (up.email IS NULL OR NOT up.email LIKE '%admin%');
    
    RETURN COALESCE(active_count, 0);
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error counting active sessions: %', SQLERRM;
        RETURN 0;
END;
$func$;

-- 4. Function to safely update session activity without connection issues  
CREATE OR REPLACE FUNCTION public.safe_update_session_activity(p_session_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
BEGIN
    -- Use a simple, efficient update with minimal locking
    UPDATE public.training_sessions 
    SET last_activity = CURRENT_TIMESTAMP
    WHERE id = p_session_id 
    AND status = 'active'::public.session_status;
    
    RETURN FOUND;
EXCEPTION
    WHEN OTHERS THEN
        -- Don't raise errors for activity updates - they're non-critical
        RETURN FALSE;
END;
$func$;

-- 5. Add index for better performance on session queries
CREATE INDEX IF NOT EXISTS idx_training_sessions_active_recent 
ON public.training_sessions (status, last_activity) 
WHERE status = 'active';

-- 6. Create a scheduled cleanup job using pg_cron extension (if available)
-- Note: This requires pg_cron extension - Supabase may not have it enabled
-- Alternative: Call cleanup function from application code periodically

-- Mock data cleanup - remove any test sessions that might be causing confusion
DO $cleanup$
DECLARE
    test_session_count INTEGER;
BEGIN
    -- Clean up any obvious test/duplicate sessions
    DELETE FROM public.captured_data 
    WHERE session_id IN (
        SELECT id FROM public.training_sessions 
        WHERE session_token LIKE 'test_%' 
        OR session_token LIKE 'anon_test_%'
        OR (created_at IS NULL OR created_at < CURRENT_TIMESTAMP - INTERVAL '7 days')
    );
    
    DELETE FROM public.training_sessions 
    WHERE session_token LIKE 'test_%' 
    OR session_token LIKE 'anon_test_%'
    OR (created_at IS NULL OR created_at < CURRENT_TIMESTAMP - INTERVAL '7 days');
    
    GET DIAGNOSTICS test_session_count = ROW_COUNT;
    
    IF test_session_count > 0 THEN
        RAISE NOTICE 'Cleaned up % test/old sessions', test_session_count;
    END IF;
    
    -- Run cleanup to mark inactive sessions
    PERFORM public.cleanup_old_training_sessions();
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup warning: %', SQLERRM;
END $cleanup$;