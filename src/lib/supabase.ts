
import { createClient } from '@supabase/supabase-js';

// Initialisez le client Supabase avec les variables d'environnement
// Ces valeurs doivent être définies dans votre environnement Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type pour les soumissions de quiz
export type QuizSubmission = {
  session_id: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gender: string;
  age_group: string;
  current_weight: number;
  height_ft?: number;
  height_in?: number;
  target_weight: number;
  quiz_responses: Record<string, any>;
  metabolic_age: number;
  fat_burning_speed: string;
  cellular_energy_production: string;
  email: string;
};

// Fonction pour envoyer les données du quiz à Supabase
export const submitQuizData = async (data: QuizSubmission): Promise<{ error: any | null, success: boolean }> => {
  try {
    const { error } = await supabase
      .from('quiz_submissions')
      .insert([data]);
    
    if (error) {
      console.error('Error submitting quiz data:', error);
      return { error, success: false };
    }
    
    return { error: null, success: true };
  } catch (err) {
    console.error('Exception submitting quiz data:', err);
    return { error: err, success: false };
  }
};
