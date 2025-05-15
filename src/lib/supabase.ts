
import { createClient } from '@supabase/supabase-js';

// Supabase project configuration
const SUPABASE_URL = 'https://dzbjugabndesaikxgtpi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6Ymp1Z2FibmRlc2Fpa3hndHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNTU4ODgsImV4cCI6MjA2MjgzMTg4OH0.l4MQSMXnweC1I5dw5KjcgGXqZxyOxyLMVXQe24lQGkc';

// Create the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    console.log('Submitting quiz data to Supabase:', data);
    console.log('Using URL:', SUPABASE_URL);
    console.log('Headers included:', !!SUPABASE_ANON_KEY);
    
    // Test the connection to Supabase with a simple query first
    const { data: testData, error: testError } = await supabase.from('quiz_submissions').select('count(*)', { count: 'exact', head: true });
    
    if (testError) {
      console.error('Test connection failed:', testError);
      return { error: testError, success: false };
    } else {
      console.log('Test connection successful:', testData);
    }
    
    // Real submission to Supabase
    const { data: insertedData, error } = await supabase
      .from('quiz_submissions')
      .insert([data])
      .select();
    
    if (error) {
      console.error('Error submitting quiz data:', error);
      
      // More verbose error logging to diagnose RLS issues
      if (error.code === '42501') {
        console.error('Row-level security policy error. Make sure:');
        console.error('1. RLS is enabled for the table');
        console.error('2. There is a policy allowing anonymous inserts');
        console.error('3. All required fields are provided');
      }
      
      return { error, success: false };
    }
    
    console.log('Quiz data submitted successfully!', insertedData);
    return { error: null, success: true };
  } catch (err) {
    console.error('Exception submitting quiz data:', err);
    return { error: err, success: false };
  }
};
