
import { supabase } from '@/integrations/supabase/client';
import { detectDeviceInfo } from './deviceDetection';

/**
 * Track a new user session when they start using the app
 */
export const trackSession = async () => {
  try {
    // Generate a unique session ID if it doesn't exist yet
    let sessionId = localStorage.getItem('quiz_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('quiz_session_id', sessionId);
      // Store session start time for duration calculation
      localStorage.setItem('session_start_time', new Date().toISOString());
    }
    
    // Get device information
    const { deviceType, browser, operatingSystem, screenSize, userAgent } = detectDeviceInfo();
    
    // First check if session already exists
    const { data: existingSession } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();
      
    // If session doesn't exist, create it
    if (!existingSession) {
      // Insert session data into Supabase
      const { error } = await supabase
        .from('user_sessions')
        .insert([{
          session_id: sessionId,
          start_time: new Date().toISOString(),
          ip_address: 'client-side', // Real IP will be captured server-side
          user_agent: userAgent,
          referrer: document.referrer,
          device_type: deviceType,
          browser: browser,
          operating_system: operatingSystem,
          screen_size: screenSize
        }]);
      
      if (error) {
        console.error('Error tracking session:', error);
      } else {
        console.log('Session tracked successfully');
      }
    }
    
    // Set up a listener for when the user leaves the page
    window.addEventListener('beforeunload', () => {
      updateSessionEndTime(sessionId as string);
    });
    
    return sessionId;
  } catch (err) {
    console.error('Error in trackSession:', err);
    return null;
  }
};

/**
 * Update the session end time when a user leaves the page
 */
export const updateSessionEndTime = async (sessionId: string) => {
  try {
    // Calculate session duration
    const sessionStartStr = localStorage.getItem('session_start_time');
    let sessionDuration = null;
    
    if (sessionStartStr) {
      const sessionStart = new Date(sessionStartStr).getTime();
      const sessionEnd = new Date().getTime();
      sessionDuration = Math.floor((sessionEnd - sessionStart) / 1000); // Duration in seconds
    }
    
    const { error } = await supabase
      .from('user_sessions')
      .update({ 
        end_time: new Date().toISOString(),
        session_duration: sessionDuration
      })
      .eq('session_id', sessionId);
    
    if (error) {
      console.error('Error updating session end time:', error);
    }
  } catch (err) {
    console.error('Error in updateSessionEndTime:', err);
  }
};

/**
 * Update the session when a user submits their email
 */
export const updateSessionSubmission = async (sessionId: string) => {
  try {
    const { error } = await supabase
      .from('user_sessions')
      .update({ submitted_email: true })
      .eq('session_id', sessionId);
    
    if (error) {
      console.error('Error updating session submission:', error);
    } else {
      console.log('Session email submission marked successfully');
    }
  } catch (err) {
    console.error('Error in updateSessionSubmission:', err);
  }
};
