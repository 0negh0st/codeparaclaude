-- ============================================================================
-- COMPREHENSIVE SESSION TRACKING FIX (CORRECTED)
-- Date: 2024-10-16 04:44:00
-- Purpose: Fix admin dashboard session counting and cleanup issues
-- ============================================================================

BEGIN;

-- First, add the missing active_sessions column to training_statistics table
ALTER TABLE public.training_statistics 
ADD COLUMN IF NOT EXISTS active_sessions integer DEFAULT 0;

-- Create unique constraint on date column to enable ON CONFLICT
CREATE UNIQUE INDEX IF NOT EXISTS idx_training_statistics_date_unique 
ON public.training_statistics (date);

-- Clean up old test data and fix inconsistencies
DELETE FROM public.captured_data 
WHERE session_id IN (
  SELECT id FROM public.training_sessions 
  WHERE status IN ('abandoned', 'timeout')
  OR last_activity < CURRENT_TIMESTAMP - INTERVAL '1 day'
);

DELETE FROM public.training_sessions 
WHERE status IN ('abandoned', 'timeout')
OR last_activity < CURRENT_TIMESTAMP - INTERVAL '1 day';

-- Update existing active sessions to have proper last_activity
UPDATE public.training_sessions 
SET last_activity = CURRENT_TIMESTAMP - INTERVAL '30 minutes'
WHERE status = 'active' 
AND last_activity < CURRENT_TIMESTAMP - INTERVAL '10 minutes';

-- Create or replace the enhanced session cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_old_training_sessions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    cleanup_count INTEGER;
    error_context TEXT;
BEGIN
    -- First mark inactive sessions (more aggressive)
    UPDATE public.training_sessions 
    SET 
        status = 'abandoned'::public.session_status,
        last_activity = CURRENT_TIMESTAMP
    WHERE status = 'active'::public.session_status 
    AND last_activity < CURRENT_TIMESTAMP - INTERVAL '3 minutes';
    
    -- Delete captured data for old sessions first (foreign key dependency)
    DELETE FROM public.captured_data 
    WHERE session_id IN (
        SELECT ts.id FROM public.training_sessions ts
        WHERE ts.status IN ('abandoned'::public.session_status, 'timeout'::public.session_status)
        AND ts.last_activity < CURRENT_TIMESTAMP - INTERVAL '30 minutes'
    );

    -- Delete old abandoned/timeout sessions  
    DELETE FROM public.training_sessions 
    WHERE status IN ('abandoned'::public.session_status, 'timeout'::public.session_status)
    AND last_activity < CURRENT_TIMESTAMP - INTERVAL '30 minutes';

    GET DIAGNOSTICS cleanup_count = ROW_COUNT;
    
    RAISE NOTICE 'Cleaned up % old training sessions', cleanup_count;
    RETURN cleanup_count;
EXCEPTION
    WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS error_context = PG_EXCEPTION_CONTEXT;
        RAISE NOTICE 'Error during session cleanup: % Context: %', SQLERRM, error_context;
        RETURN 0;
END;
$$;

-- Create or replace the enhanced active client session count function
CREATE OR REPLACE FUNCTION public.get_active_client_session_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    active_count INTEGER;
BEGIN
    -- First clean up inactive sessions (aggressive cleanup)
    UPDATE public.training_sessions 
    SET 
        status = 'abandoned'::public.session_status,
        last_activity = CURRENT_TIMESTAMP
    WHERE status = 'active'::public.session_status 
    AND last_activity < CURRENT_TIMESTAMP - INTERVAL '2 minutes';
    
    -- Count only NON-ADMIN active sessions that have very recent activity
    SELECT COUNT(*) INTO active_count
    FROM public.training_sessions ts
    LEFT JOIN public.user_profiles up ON ts.participant_id = up.id
    WHERE ts.status = 'active'::public.session_status
    AND ts.last_activity > CURRENT_TIMESTAMP - INTERVAL '3 minutes'
    AND (
        -- Anonymous sessions (no participant_id)
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
$$;

-- Create function to force cleanup all sessions (for admin use)
CREATE OR REPLACE FUNCTION public.force_cleanup_all_sessions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    cleanup_count INTEGER;
BEGIN
    -- Mark ALL current active sessions as abandoned
    UPDATE public.training_sessions 
    SET 
        status = 'abandoned'::public.session_status,
        last_activity = CURRENT_TIMESTAMP
    WHERE status = 'active'::public.session_status;
    
    GET DIAGNOSTICS cleanup_count = ROW_COUNT;
    
    -- Clean up old data
    PERFORM public.cleanup_old_training_sessions();
    
    RAISE NOTICE 'Force marked % sessions as abandoned', cleanup_count;
    RETURN cleanup_count;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error during force cleanup: %', SQLERRM;
        RETURN 0;
END;
$$;

-- Update the mark_inactive_sessions function to be more aggressive
CREATE OR REPLACE FUNCTION public.mark_inactive_sessions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    timeout_count INTEGER;
BEGIN
    -- Mark sessions as abandoned if no activity for more than 2 minutes (more aggressive)
    UPDATE public.training_sessions 
    SET 
        status = 'abandoned'::public.session_status,
        last_activity = CURRENT_TIMESTAMP
    WHERE status = 'active'::public.session_status 
    AND last_activity < CURRENT_TIMESTAMP - INTERVAL '2 minutes';
    
    GET DIAGNOSTICS timeout_count = ROW_COUNT;
    
    RAISE NOTICE 'Marked % sessions as abandoned', timeout_count;
    RETURN timeout_count;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error marking inactive sessions: %', SQLERRM;
        RETURN 0;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.cleanup_old_training_sessions() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_active_client_session_count() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.force_cleanup_all_sessions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_inactive_sessions() TO authenticated, anon;

-- Now we can safely insert with the active_sessions column and date constraint
INSERT INTO public.training_statistics (date, total_sessions, completed_sessions, abandoned_sessions, active_sessions, data_points_captured, high_risk_participants)
VALUES (
    CURRENT_DATE,
    0, -- Will be calculated dynamically
    0, -- Will be calculated dynamically  
    0, -- Will be calculated dynamically
    0, -- Will be calculated dynamically
    0, -- Will be calculated dynamically
    0  -- Will be calculated dynamically
) ON CONFLICT (date) DO UPDATE SET
    total_sessions = 0,
    completed_sessions = 0,
    abandoned_sessions = 0,
    active_sessions = 0,
    data_points_captured = 0,
    high_risk_participants = 0;

COMMIT;

-- Notification
DO $$
BEGIN
    RAISE NOTICE 'Comprehensive session tracking fix applied successfully!';
    RAISE NOTICE 'Added missing active_sessions column to training_statistics table';
    RAISE NOTICE 'Created unique constraint on date column for proper UPSERT operations';
    RAISE NOTICE 'Enhanced functions: cleanup_old_training_sessions, get_active_client_session_count, force_cleanup_all_sessions';
    RAISE NOTICE 'Admin dashboard should now show accurate session counts.';
END $$;