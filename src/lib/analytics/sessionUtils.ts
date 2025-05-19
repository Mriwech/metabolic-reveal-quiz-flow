
import { supabase } from '@/integrations/supabase/client';
import { trackSession } from './sessionTracking';

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
