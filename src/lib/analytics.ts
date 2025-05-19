
import { supabase } from '@/integrations/supabase/client';

/**
 * Detect device type based on user agent
 */
const detectDeviceType = (userAgent: string): string => {
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet';
  }
  if (/mobile|android|iphone|ipod|phone/i.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
};

/**
 * Detect browser based on user agent
 */
const detectBrowser = (userAgent: string): string => {
  if (/edge/i.test(userAgent)) return 'Edge';
  if (/chrome/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent)) return 'Safari';
  if (/msie|trident/i.test(userAgent)) return 'Internet Explorer';
  return 'Unknown';
};

/**
 * Detect operating system based on user agent
 */
const detectOS = (userAgent: string): string => {
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/mac/i.test(userAgent)) return 'MacOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  if (/android/i.test(userAgent)) return 'Android';
  if (/ios|iphone|ipad/i.test(userAgent)) return 'iOS';
  return 'Unknown';
};

/**
 * Get screen size
 */
const getScreenSize = (): string => {
  return `${window.screen.width}x${window.screen.height}`;
};

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
    const userAgent = navigator.userAgent;
    const deviceType = detectDeviceType(userAgent);
    const browser = detectBrowser(userAgent);
    const operatingSystem = detectOS(userAgent);
    const screenSize = getScreenSize();
    
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

/**
 * Update quiz progress in session
 */
export const updateQuizProgress = async (sessionId: string, questionNumber: number, quizData: any) => {
  try {
    // Store last seen question
    const { error } = await supabase
      .from('user_sessions')
      .update({ 
        last_question_viewed: questionNumber,
        quiz_progress: quizData
      })
      .eq('session_id', sessionId);
    
    if (error) {
      console.error('Error updating quiz progress:', error);
    }
  } catch (err) {
    console.error('Error in updateQuizProgress:', err);
  }
};

/**
 * Mark quiz as completed
 */
export const markQuizCompleted = async (sessionId: string) => {
  try {
    const { error } = await supabase
      .from('user_sessions')
      .update({ completed_quiz: true })
      .eq('session_id', sessionId);
    
    if (error) {
      console.error('Error marking quiz as completed:', error);
    }
  } catch (err) {
    console.error('Error in markQuizCompleted:', err);
  }
};

/**
 * Track VSL button click
 */
export const trackVSLButtonClick = async (sessionId: string) => {
  try {
    const { error } = await supabase
      .from('user_sessions')
      .update({ clicked_vsl_button: true })
      .eq('session_id', sessionId);
    
    if (error) {
      console.error('Error tracking VSL button click:', error);
    }
  } catch (err) {
    console.error('Error in trackVSLButtonClick:', err);
  }
};

/**
 * Get user session ID by session ID
 */
export const getUserSessionIdBySessionId = async (sessionId: string): Promise<string | null> => {
  try {
    // First check if session exists
    const { data, error } = await supabase
      .from('user_sessions')
      .select('id')
      .eq('session_id', sessionId);
    
    if (error) {
      console.error('Error getting user session ID:', error);
      return null;
    }
    
    // If no session found, create one and return its ID
    if (!data || data.length === 0) {
      await trackSession(); // This will create a session
      
      // Try to get the ID again
      const { data: newData, error: newError } = await supabase
        .from('user_sessions')
        .select('id')
        .eq('session_id', sessionId);
        
      if (newError || !newData || newData.length === 0) {
        console.error('Error getting new user session ID:', newError || 'No data');
        return null;
      }
      
      return newData[0]?.id || null;
    }
    
    return data[0]?.id || null;
  } catch (err) {
    console.error('Error in getUserSessionIdBySessionId:', err);
    return null;
  }
};
