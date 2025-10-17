-- Location: supabase/migrations/20251016053736_intelligent_session_management_enhancement.sql
-- Schema Analysis: Existing CyberSafety training schema with sessions, admin activities, and data capture
-- Integration Type: ENHANCEMENT - Adding intelligent session management features
-- Dependencies: training_sessions, admin_activities, user_profiles, captured_data

-- ===============================================
-- INTELLIGENT SESSION MANAGEMENT ENHANCEMENT
-- ===============================================

-- 1. Add intelligent session analysis columns
ALTER TABLE public.training_sessions 
ADD COLUMN IF NOT EXISTS session_quality_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS behavioral_flags JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS completion_prediction DECIMAL(3,2) DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS session_priority TEXT DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS is_guided BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS guidance_history JSONB DEFAULT '[]';

-- 2. Create session interventions tracking table
CREATE TABLE IF NOT EXISTS public.session_interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    intervention_type TEXT NOT NULL,
    intervention_data JSONB DEFAULT '{}',
    triggered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    result TEXT DEFAULT 'pending',
    notes TEXT
);

-- 3. Create real-time session alerts table
CREATE TABLE IF NOT EXISTS public.session_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL,
    severity TEXT DEFAULT 'low',
    message TEXT NOT NULL,
    alert_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL
);

-- 4. Create session guidance templates table
CREATE TABLE IF NOT EXISTS public.guidance_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name TEXT NOT NULL UNIQUE,
    template_type TEXT NOT NULL,
    trigger_conditions JSONB DEFAULT '{}',
    guidance_content JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_session_interventions_session_id ON public.session_interventions(session_id);
CREATE INDEX IF NOT EXISTS idx_session_interventions_admin_id ON public.session_interventions(admin_id);
CREATE INDEX IF NOT EXISTS idx_session_interventions_type ON public.session_interventions(intervention_type);
CREATE INDEX IF NOT EXISTS idx_session_alerts_session_id ON public.session_alerts(session_id);
CREATE INDEX IF NOT EXISTS idx_session_alerts_severity ON public.session_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_session_alerts_resolved ON public.session_alerts(resolved_at);
CREATE INDEX IF NOT EXISTS idx_guidance_templates_type ON public.guidance_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_training_sessions_priority ON public.training_sessions(session_priority);
CREATE INDEX IF NOT EXISTS idx_training_sessions_quality ON public.training_sessions(session_quality_score);

-- 6. Enhanced session analysis function
CREATE OR REPLACE FUNCTION public.analyze_session_intelligence(p_session_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    session_data RECORD;
    captured_count INTEGER;
    time_on_step INTERVAL;
    quality_score INTEGER;
    prediction_score DECIMAL(3,2);
    behavioral_flags JSONB;
BEGIN
    -- Get session data
    SELECT * INTO session_data 
    FROM public.training_sessions 
    WHERE id = p_session_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'Session not found');
    END IF;
    
    -- Count captured data points
    SELECT COUNT(*) INTO captured_count 
    FROM public.captured_data 
    WHERE session_id = p_session_id;
    
    -- Calculate time on current step
    time_on_step := CURRENT_TIMESTAMP - session_data.last_activity;
    
    -- Calculate quality score (0-100)
    quality_score := LEAST(100, GREATEST(0, 
        (captured_count * 10) + 
        (EXTRACT(EPOCH FROM session_data.last_activity - session_data.started_at) / 60)::INTEGER +
        (session_data.current_step * 15)
    ));
    
    -- Calculate completion prediction (0.0-1.0)
    prediction_score := LEAST(1.0, GREATEST(0.0,
        (session_data.current_step::DECIMAL / COALESCE(session_data.total_steps, 6)) * 0.7 +
        (quality_score / 100.0) * 0.3
    ));
    
    -- Analyze behavioral flags
    behavioral_flags := jsonb_build_object(
        'stuck_on_step', EXTRACT(EPOCH FROM time_on_step) > 300,
        'fast_progression', captured_count > session_data.current_step * 3,
        'data_rich', captured_count > 10,
        'recently_active', EXTRACT(EPOCH FROM time_on_step) < 60,
        'high_engagement', quality_score > 70
    );
    
    -- Update session with analysis
    UPDATE public.training_sessions 
    SET 
        session_quality_score = quality_score,
        behavioral_flags = behavioral_flags,
        completion_prediction = prediction_score,
        last_activity = CURRENT_TIMESTAMP
    WHERE id = p_session_id;
    
    RETURN jsonb_build_object(
        'session_id', p_session_id,
        'quality_score', quality_score,
        'completion_prediction', prediction_score,
        'behavioral_flags', behavioral_flags,
        'captured_data_count', captured_count,
        'time_on_current_step', EXTRACT(EPOCH FROM time_on_step),
        'analysis_timestamp', CURRENT_TIMESTAMP
    );
END;
$$;

-- 7. Intelligent session guidance function
CREATE OR REPLACE FUNCTION public.trigger_intelligent_guidance(p_session_id UUID, p_guidance_type TEXT DEFAULT 'auto')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    session_record RECORD;
    guidance_template RECORD;
    analysis_result JSONB;
    guidance_response JSONB;
BEGIN
    -- Get session analysis
    analysis_result := public.analyze_session_intelligence(p_session_id);
    
    -- Get session data
    SELECT * INTO session_record 
    FROM public.training_sessions 
    WHERE id = p_session_id;
    
    -- Determine appropriate guidance template
    SELECT * INTO guidance_template 
    FROM public.guidance_templates 
    WHERE template_type = CASE 
        WHEN (analysis_result->>'behavioral_flags')::jsonb->>'stuck_on_step' = 'true' THEN 'stuck_help'
        WHEN (analysis_result->>'completion_prediction')::decimal < 0.3 THEN 'encouragement'
        WHEN (analysis_result->>'quality_score')::integer > 80 THEN 'advanced_tips'
        ELSE 'general_guidance'
    END
    AND is_active = true
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Build guidance response
    guidance_response := jsonb_build_object(
        'session_id', p_session_id,
        'guidance_type', COALESCE(guidance_template.template_type, 'general'),
        'message', COALESCE(guidance_template.guidance_content->>'message', 'Continúa con el entrenamiento'),
        'priority', CASE 
            WHEN (analysis_result->>'behavioral_flags')::jsonb->>'stuck_on_step' = 'true' THEN 'high'
            WHEN (analysis_result->>'completion_prediction')::decimal < 0.5 THEN 'medium'
            ELSE 'low'
        END,
        'suggested_action', COALESCE(guidance_template.guidance_content->>'action', 'continue'),
        'analysis', analysis_result
    );
    
    -- Update session with guidance flag
    UPDATE public.training_sessions 
    SET 
        is_guided = true,
        guidance_history = COALESCE(guidance_history, '[]'::jsonb) || jsonb_build_array(guidance_response),
        session_priority = (guidance_response->>'priority')::text
    WHERE id = p_session_id;
    
    RETURN guidance_response;
END;
$$;

-- 8. Real-time alert trigger function
CREATE OR REPLACE FUNCTION public.check_session_alerts(p_session_id UUID)
RETURNS TABLE(alert_id UUID, alert_type TEXT, severity TEXT, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    session_analysis JSONB;
    alert_record RECORD;
BEGIN
    -- Get session analysis
    session_analysis := public.analyze_session_intelligence(p_session_id);
    
    -- Check for stuck session alert
    IF (session_analysis->'behavioral_flags'->>'stuck_on_step')::boolean = true THEN
        INSERT INTO public.session_alerts (session_id, alert_type, severity, message, alert_data)
        VALUES (
            p_session_id,
            'session_stuck',
            'high',
            'Usuario lleva más de 5 minutos en el mismo paso',
            jsonb_build_object('time_on_step', session_analysis->>'time_on_current_step')
        )
        ON CONFLICT DO NOTHING
        RETURNING id, alert_type, severity, message INTO alert_record;
        
        IF FOUND THEN
            RETURN QUERY SELECT alert_record.id, alert_record.alert_type, alert_record.severity, alert_record.message;
        END IF;
    END IF;
    
    -- Check for low completion prediction
    IF (session_analysis->>'completion_prediction')::decimal < 0.3 THEN
        INSERT INTO public.session_alerts (session_id, alert_type, severity, message, alert_data)
        VALUES (
            p_session_id,
            'low_completion_risk',
            'medium',
            'Sesión con alta probabilidad de abandono',
            jsonb_build_object('prediction_score', session_analysis->>'completion_prediction')
        )
        ON CONFLICT DO NOTHING
        RETURNING id, alert_type, severity, message INTO alert_record;
        
        IF FOUND THEN
            RETURN QUERY SELECT alert_record.id, alert_record.alert_type, alert_record.severity, alert_record.message;
        END IF;
    END IF;
    
    -- Check for high engagement opportunity
    IF (session_analysis->>'quality_score')::integer > 80 THEN
        INSERT INTO public.session_alerts (session_id, alert_type, severity, message, alert_data)
        VALUES (
            p_session_id,
            'high_engagement',
            'low',
            'Usuario muy comprometido - oportunidad para contenido avanzado',
            jsonb_build_object('quality_score', session_analysis->>'quality_score')
        )
        ON CONFLICT DO NOTHING
        RETURNING id, alert_type, severity, message INTO alert_record;
        
        IF FOUND THEN
            RETURN QUERY SELECT alert_record.id, alert_record.alert_type, alert_record.severity, alert_record.message;
        END IF;
    END IF;
END;
$$;

-- 9. Admin intervention logging function
CREATE OR REPLACE FUNCTION public.log_admin_intervention(
    p_session_id UUID,
    p_admin_id UUID,
    p_intervention_type TEXT,
    p_intervention_data JSONB DEFAULT '{}',
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    intervention_id UUID;
BEGIN
    INSERT INTO public.session_interventions (
        session_id,
        admin_id,
        intervention_type,
        intervention_data,
        notes
    ) VALUES (
        p_session_id,
        p_admin_id,
        p_intervention_type,
        p_intervention_data,
        p_notes
    )
    RETURNING id INTO intervention_id;
    
    -- Log to admin activities as well
    INSERT INTO public.admin_activities (
        admin_id,
        activity_type,
        description,
        metadata
    ) VALUES (
        p_admin_id,
        p_intervention_type,
        format('Intervención en sesión: %s', p_intervention_type),
        jsonb_build_object(
            'session_id', p_session_id,
            'intervention_id', intervention_id,
            'intervention_data', p_intervention_data
        )
    );
    
    RETURN intervention_id;
END;
$$;

-- 10. Enable RLS on new tables
ALTER TABLE public.session_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guidance_templates ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies using Pattern 6 (Role-Based Access)
CREATE POLICY "admins_manage_session_interventions"
ON public.session_interventions
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
);

CREATE POLICY "admins_manage_session_alerts"
ON public.session_alerts
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
);

CREATE POLICY "admins_manage_guidance_templates"
ON public.guidance_templates
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
);

-- 12. Insert default guidance templates
INSERT INTO public.guidance_templates (template_name, template_type, guidance_content, created_by)
SELECT 
    'Ayuda para usuarios atascados',
    'stuck_help',
    jsonb_build_object(
        'message', '¡No te preocupes! Es normal tomarse tiempo en este paso. ¿Necesitas ayuda?',
        'action', 'show_hint',
        'hint', 'Revisa la información cuidadosamente y tómate tu tiempo'
    ),
    up.id
FROM public.user_profiles up 
WHERE up.role = 'admin' 
LIMIT 1
ON CONFLICT (template_name) DO NOTHING;

INSERT INTO public.guidance_templates (template_name, template_type, guidance_content, created_by)
SELECT 
    'Ánimo para continuar',
    'encouragement',
    jsonb_build_object(
        'message', '¡Vas muy bien! Continúa con el siguiente paso.',
        'action', 'encourage',
        'hint', 'Cada paso te acerca más a completar el entrenamiento'
    ),
    up.id
FROM public.user_profiles up 
WHERE up.role = 'admin' 
LIMIT 1
ON CONFLICT (template_name) DO NOTHING;

INSERT INTO public.guidance_templates (template_name, template_type, guidance_content, created_by)
SELECT 
    'Tips avanzados',
    'advanced_tips',
    jsonb_build_object(
        'message', '¡Excelente progreso! Aquí tienes algunos consejos adicionales.',
        'action', 'show_advanced_tips',
        'hint', 'Tu nivel de compromiso es excelente. Considera explorar recursos adicionales.'
    ),
    up.id
FROM public.user_profiles up 
WHERE up.role = 'admin' 
LIMIT 1
ON CONFLICT (template_name) DO NOTHING;

-- 13. Create cleanup function for old alerts and interventions
CREATE OR REPLACE FUNCTION public.cleanup_old_session_data()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    cleanup_count INTEGER;
BEGIN
    -- Clean up old resolved alerts (older than 7 days)
    DELETE FROM public.session_alerts 
    WHERE resolved_at IS NOT NULL 
    AND resolved_at < CURRENT_TIMESTAMP - INTERVAL '7 days';
    
    GET DIAGNOSTICS cleanup_count = ROW_COUNT;
    
    -- Clean up old interventions for abandoned sessions
    DELETE FROM public.session_interventions si
    WHERE EXISTS (
        SELECT 1 FROM public.training_sessions ts
        WHERE ts.id = si.session_id 
        AND ts.status IN ('abandoned', 'timeout')
        AND ts.last_activity < CURRENT_TIMESTAMP - INTERVAL '24 hours'
    );
    
    RETURN cleanup_count;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup error: %', SQLERRM;
        RETURN 0;
END;
$$;

-- 14. Create comprehensive database reset function (for clean start)
CREATE OR REPLACE FUNCTION public.reset_cybersafety_database()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_user_ids UUID[];
    cleanup_summary TEXT;
BEGIN
    -- Get admin user IDs to preserve them
    SELECT ARRAY_AGG(id) INTO admin_user_ids
    FROM public.user_profiles
    WHERE role = 'admin';
    
    -- Delete all session-related data in correct order
    DELETE FROM public.session_interventions;
    DELETE FROM public.session_alerts;
    DELETE FROM public.captured_data;
    DELETE FROM public.training_sessions;
    DELETE FROM public.training_statistics;
    
    -- Delete non-admin activities only
    DELETE FROM public.admin_activities 
    WHERE admin_id IS NULL OR admin_id != ALL(admin_user_ids);
    
    -- Reset training statistics
    INSERT INTO public.training_statistics (
        date, 
        total_sessions, 
        active_sessions, 
        completed_sessions, 
        abandoned_sessions,
        data_points_captured,
        high_risk_participants
    ) VALUES (
        CURRENT_DATE, 
        0, 0, 0, 0, 0, 0
    ) ON CONFLICT (date) DO UPDATE SET
        total_sessions = 0,
        active_sessions = 0,
        completed_sessions = 0,
        abandoned_sessions = 0,
        data_points_captured = 0,
        high_risk_participants = 0;
    
    cleanup_summary := format(
        'Database reset completed at %s. Preserved %s admin users. Ready for fresh testing.',
        CURRENT_TIMESTAMP,
        COALESCE(array_length(admin_user_ids, 1), 0)
    );
    
    RETURN cleanup_summary;
END;
$$;

-- 15. Create session monitoring dashboard view
CREATE OR REPLACE VIEW public.session_intelligence_dashboard AS
SELECT 
    ts.id as session_id,
    ts.session_token,
    ts.started_at,
    ts.last_activity,
    ts.current_step,
    ts.total_steps,
    ts.status,
    ts.session_quality_score,
    ts.completion_prediction,
    ts.behavioral_flags,
    ts.session_priority,
    ts.is_guided,
    up.full_name as participant_name,
    up.email as participant_email,
    COUNT(cd.id) as data_points_captured,
    COUNT(si.id) as admin_interventions,
    COUNT(CASE WHEN sa.resolved_at IS NULL THEN 1 END) as active_alerts,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - ts.last_activity)) as seconds_inactive,
    ROUND(
        (ts.current_step::DECIMAL / COALESCE(ts.total_steps, 6)) * 100, 2
    ) as progress_percentage
FROM public.training_sessions ts
LEFT JOIN public.user_profiles up ON ts.participant_id = up.id
LEFT JOIN public.captured_data cd ON ts.id = cd.session_id
LEFT JOIN public.session_interventions si ON ts.id = si.session_id
LEFT JOIN public.session_alerts sa ON ts.id = sa.session_id
WHERE ts.status = 'active'
GROUP BY ts.id, ts.session_token, ts.started_at, ts.last_activity, 
         ts.current_step, ts.total_steps, ts.status, ts.session_quality_score,
         ts.completion_prediction, ts.behavioral_flags, ts.session_priority,
         ts.is_guided, up.full_name, up.email
ORDER BY ts.session_priority DESC, ts.last_activity DESC;

COMMENT ON VIEW public.session_intelligence_dashboard IS 'Comprehensive real-time view of session intelligence data for admin dashboard monitoring';