
import { createClient } from '@supabase/supabase-js';

// Default fallback values (for development - these won't work in production)
const DEFAULT_SUPABASE_URL = 'https://your-project-id.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'your-anon-key';

// Get environment variables or use fallback for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are not set
const isMockClient = supabaseUrl === DEFAULT_SUPABASE_URL || supabaseAnonKey === DEFAULT_SUPABASE_ANON_KEY;

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type for the quiz submissions
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

// Function to submit quiz data to Supabase
export const submitQuizData = async (data: QuizSubmission): Promise<{ error: any | null, success: boolean }> => {
  try {
    // If we're using mock client, just log the data and simulate success
    if (isMockClient) {
      console.log('MOCK: Quiz data would be submitted to Supabase:', data);
      console.warn('Supabase environment variables not configured. Using mock client.');
      return { error: null, success: true };
    }
    
    // Real submission to Supabase
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
