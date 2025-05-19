
import { supabase } from '@/integrations/supabase/client';

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
