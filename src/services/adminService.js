import { supabase } from '../lib/supabase';

class AdminService {
  // Log admin activity
  async logActivity(activityType, description, metadata = {}) {
    try {
      const { data, error } = await supabase
        ?.from('admin_activities')
        ?.insert([{
          activity_type: activityType,
          description: description,
          metadata: metadata
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

  // CRITICAL: Get active sessions with detailed activity tracking
  async getActiveSessionsWithActivity(limit = 50) {
    try {
      const { data, error } = await supabase
        ?.from('training_sessions')
        ?.select(`
          *,
          user_profiles!training_sessions_participant_id_fkey (
            id,
            full_name,
            email,
            role
          ),
          captured_data (
            id,
            form_step,
            field_name,
            captured_at
          )
        `)
        ?.eq('status', 'active')
        ?.gte('last_activity', new Date(Date.now() - 3 * 60 * 1000)?.toISOString())
        ?.order('last_activity', { ascending: false })
        ?.limit(limit);

      if (error) {
        return { data: null, error };
      }

      // Format sessions for display
      const formattedSessions = (data || [])?.map(session => {
        const isRecentlyActive = session?.last_activity && 
          new Date(session.last_activity) > new Date(Date.now() - 1 * 60 * 1000);

        return {
          sessionId: session?.id,
          sessionToken: session?.session_token,
          clientId: session?.participant_id 
            ? `${session?.user_profiles?.full_name || 'Usuario'}-${session?.id?.substring(0, 8)}`
            : `Anónimo-${session?.id?.substring(0, 8)}`,
          participantName: session?.user_profiles?.full_name || 'Usuario Anónimo',
          participantEmail: session?.user_profiles?.email || null,
          ipAddress: session?.ip_address || 'N/A',
          userAgent: session?.user_agent || 'N/A',
          startTime: session?.started_at,
          lastActivity: session?.last_activity,
          currentStep: session?.current_step || 0,
          stepNumber: session?.current_step || 0,
          entryPoint: session?.entry_point || 'homepage',
          status: session?.status,
          isActive: session?.status === 'active',
          isRecentlyActive,
          capturedDataCount: session?.captured_data?.length || 0,
          isAdminSession: session?.user_profiles?.role === 'admin'
        };
      });

      return { data: formattedSessions, error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Error loading active sessions: ' + error?.message }
      };
    }
  }

  // CRITICAL: Perform session cleanup
  async performSessionCleanup() {
    try {
      const { data, error } = await supabase?.rpc('mark_inactive_sessions');
      
      if (error) {
        return { data: null, error };
      }

      return { data: data || 0, error: null };
    } catch (error) {
      return { 
        data: 0, 
        error: { message: 'Session cleanup failed: ' + error?.message }
      };
    }
  }

  // CRITICAL: Subscribe to session changes  
  subscribeToSessions(callback) {
    try {
      const subscription = supabase
        ?.channel('training-sessions')
        ?.on('postgres_changes', 
          { event: '*', schema: 'public', table: 'training_sessions' },
          callback
        )
        ?.subscribe();

      return () => {
        if (subscription) {
          supabase?.removeChannel(subscription);
        }
      };
    } catch (error) {
      console.error('Session subscription error:', error);
      return () => {};
    }
  }

  // CRITICAL: Subscribe to captured data changes
  subscribeToCapturedData(callback) {
    try {
      const subscription = supabase
        ?.channel('captured-data')
        ?.on('postgres_changes', 
          { event: '*', schema: 'public', table: 'captured_data' },
          callback
        )
        ?.subscribe();

      return () => {
        if (subscription) {
          supabase?.removeChannel(subscription);
        }
      };
    } catch (error) {
      console.error('Captured data subscription error:', error);
      return () => {};
    }
  }

  // CRITICAL: Get activity feed with user interactions
  async getActivityFeedWithUserInteractions(limit = 15) {
    try {
      const { data, error } = await supabase
        ?.from('admin_activities')
        ?.select(`
          *,
          user_profiles!admin_activities_admin_id_fkey (
            full_name,
            email,
            role
          )
        `)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (error) {
        return { data: null, error };
      }

      const formattedActivities = (data || [])?.map(activity => ({
        id: activity?.id,
        type: activity?.activity_type || 'unknown',
        description: activity?.description || 'No description',
        timestamp: activity?.created_at,
        adminName: activity?.user_profiles?.full_name || 'Sistema',
        adminEmail: activity?.user_profiles?.email || null,
        metadata: activity?.metadata || {}
      }));

      return { data: formattedActivities, error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Error loading activity feed: ' + error?.message }
      };
    }
  }

  // CRITICAL: Get training statistics  
  async getTrainingStatistics(days = 7) {
    try {
      const { data, error } = await supabase
        ?.from('training_statistics')
        ?.select('*')
        ?.order('date', { ascending: false })
        ?.limit(days);

      if (error) {
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Error loading statistics: ' + error?.message }
      };
    }
  }

  // CRITICAL: Get captured data for specific session
  async getCapturedData(sessionId) {
    try {
      const { data, error } = await supabase
        ?.from('captured_data')
        ?.select('*')
        ?.eq('session_id', sessionId)
        ?.order('captured_at', { ascending: false });

      if (error) {
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Error loading captured data: ' + error?.message }
      };
    }
  }

  // Force cleanup all inactive sessions
  async forceCleanupAllInactiveSessions() {
    try {
      const { data, error } = await supabase?.rpc('force_cleanup_all_sessions');
      
      if (error) {
        return { data: null, error };
      }

      return { data: data || 0, error: null };
    } catch (error) {
      return { 
        data: 0, 
        error: { message: 'Force cleanup failed: ' + error?.message }
      };
    }
  }

  // Get intelligent session dashboard data
  async getIntelligentSessionDashboard() {
    try {
      const { data, error } = await supabase?.rpc('analyze_session_intelligence');
      
      if (error) {
        return { data: null, error };
      }

      return { data: data || {}, error: null };
    } catch (error) {
      return { 
        data: {}, 
        error: { message: 'Intelligence dashboard error: ' + error?.message }
      };
    }
  }

  // Get active session alerts
  async getActiveSessionAlerts() {
    try {
      const { data, error } = await supabase
        ?.from('session_alerts')
        ?.select(`
          *,
          training_sessions (
            id,
            session_token,
            user_profiles (
              full_name
            )
          )
        `)
        ?.is('resolved_by', null)
        ?.order('created_at', { ascending: false })
        ?.limit(10);

      if (error) {
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Error loading session alerts: ' + error?.message }
      };
    }
  }

  // Analyze all active sessions
  async analyzeAllActiveSessions() {
    try {
      const { data, error } = await supabase?.rpc('trigger_intelligent_guidance');
      
      if (error) {
        return { data: null, error };
      }

      return { data: data || {}, error: null };
    } catch (error) {
      return { 
        data: {}, 
        error: { message: 'Session analysis failed: ' + error?.message }
      };
    }
  }

  // Resolve session alert
  async resolveSessionAlert(alertId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      
      const { data, error } = await supabase
        ?.from('session_alerts')
        ?.update({ 
          resolved_by: user?.id,
          resolved_at: new Date()?.toISOString()
        })
        ?.eq('id', alertId)
        ?.select()
        ?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Error resolving alert: ' + error?.message }
      };
    }
  }

  // Reset database for clean start
  async resetDatabaseForCleanStart() {
    try {
      const { data, error } = await supabase?.rpc('reset_cybersafety_database');
      
      if (error) {
        return { data: null, error };
      }

      return { data: data || 'Database reset completed', error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Database reset failed: ' + error?.message }
      };
    }
  }

  // Finalize session (for manual completion)
  async finalizeSession(sessionId, adminId) {
    try {
      const { data, error } = await supabase
        ?.from('training_sessions')
        ?.update({
          status: 'completed',
          completed_at: new Date()?.toISOString(),
          admin_notes: 'Manually completed by admin'
        })
        ?.eq('id', sessionId)
        ?.select()
        ?.single();

      if (error) {
        return { data: null, error };
      }

      // Log admin activity
      await this.logActivity(
        'session_finalized',
        `Session ${sessionId} manually completed`,
        { sessionId, adminId }
      );

      return { data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Error finalizing session: ' + error?.message }
      };
    }
  }

  // Get admin activities
  async getActivities(adminId, filters = {}) {
    try {
      let query = supabase
        ?.from('admin_activities')
        ?.select(`
          *,
          user_profiles!admin_activities_admin_id_fkey (
            full_name,
            email,
            role
          )
        `)
        ?.order('created_at', { ascending: false });

      if (adminId) {
        query = query?.eq('admin_id', adminId);
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

  // Get session statistics
  async getSessionStatistics() {
    try {
      const { data, error } = await supabase
        ?.from('training_statistics')
        ?.select('*')
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

  // Get active sessions count
  async getActiveSessionsCount() {
    try {
      const { data } = await supabase?.rpc('get_active_client_session_count');
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

  // Create session intervention
  async createIntervention(interventionData) {
    try {
      const { data, error } = await supabase
        ?.from('session_interventions')
        ?.insert([{
          session_id: interventionData?.session_id,
          admin_id: interventionData?.admin_id,
          intervention_type: interventionData?.intervention_type,
          message: interventionData?.message,
          metadata: interventionData?.metadata || {}
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

  // Get session intelligence dashboard data
  async getIntelligenceDashboard() {
    try {
      const { data } = await supabase?.rpc('analyze_session_intelligence');
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

  // Check user role
  async isAdmin(userId) {
    try {
      const { data } = await supabase?.rpc('is_admin_from_auth');
      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: false, 
          error: { message: 'Cannot connect to database. Please check your connection.' }
        };
      }
      return { data: false, error };
    }
  }

  // Update user role (admin only)
  async updateUserRole(userId, newRole) {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update({ role: newRole })
        ?.eq('id', userId)
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

  // Get all user profiles (admin only)
  async getAllUsers(filters = {}) {
    try {
      let query = supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      if (filters?.role) {
        query = query?.eq('role', filters?.role);
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
}

// Export singleton instance
export const adminService = new AdminService();
export default adminService;