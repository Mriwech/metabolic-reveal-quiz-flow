
import { supabase } from '@/integrations/supabase/client';

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
    }
    
    // Get UTM parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmContent = urlParams.get('utm_content');
    
    // Insert session data into Supabase
    const { error } = await supabase
      .from('user_sessions')
      .insert([{
        session_id: sessionId,
        start_time: new Date().toISOString(),
        ip_address: '', // We can't reliably get this from the client side
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        utm_source: utmSource || null,
        utm_campaign: utmCampaign || null,
        utm_content: utmContent || null
      }]);
    
    if (error) {
      console.error('Error tracking session:', error);
    } else {
      console.log('Session tracked successfully');
      
      // Set up a listener for when the user leaves the page
      window.addEventListener('beforeunload', () => {
        updateSessionEndTime(sessionId as string);
      });
    }
    
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
    const { error } = await supabase
      .from('user_sessions')
      .update({ end_time: new Date().toISOString() })
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
