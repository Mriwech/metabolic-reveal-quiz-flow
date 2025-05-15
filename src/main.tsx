
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check for Supabase environment variables and warn if they're missing
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase environment variables not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.\n' +
    'The app will run in mock mode without actually submitting data to Supabase.'
  );
}

createRoot(document.getElementById("root")!).render(<App />);
