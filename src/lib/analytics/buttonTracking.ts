
import { supabase } from '@/integrations/supabase/client';

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
