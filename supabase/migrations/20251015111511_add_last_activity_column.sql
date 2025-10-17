-- Location: supabase/migrations/20251015111511_add_last_activity_column.sql
-- Schema Analysis: Existing training_sessions table with columns: id, participant_id, session_token, started_at, completed_at, current_step, total_steps, status, risk_level, vulnerability_score, ip_address, user_agent
-- Integration Type: MODIFICATIVE - Adding missing column to existing table
-- Dependencies: training_sessions table (existing)

-- Add last_activity column to track real-time user interactions
ALTER TABLE public.training_sessions
ADD COLUMN last_activity TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- Add index for efficient ordering by last_activity
CREATE INDEX idx_training_sessions_last_activity ON public.training_sessions(last_activity);

-- Update existing sessions to have last_activity set to started_at
UPDATE public.training_sessions
SET last_activity = started_at
WHERE last_activity IS NULL;

-- Create function to automatically update last_activity when session is modified
CREATE OR REPLACE FUNCTION public.update_session_last_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only update last_activity if it's not being explicitly set
    IF TG_OP = 'UPDATE' AND OLD.last_activity = NEW.last_activity THEN
        NEW.last_activity = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger to automatically update last_activity on any training_sessions update
CREATE TRIGGER trigger_update_session_last_activity
    BEFORE UPDATE ON public.training_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_session_last_activity();

-- Add function to manually update session activity (for API calls)
CREATE OR REPLACE FUNCTION public.update_session_activity(session_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.training_sessions
    SET last_activity = CURRENT_TIMESTAMP
    WHERE id = session_uuid;
END;
$$;