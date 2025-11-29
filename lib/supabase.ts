
import { createClient } from '@supabase/supabase-js';

// Access environment variables
const getEnvVar = (key: string) => {
  try {
    return (import.meta as any).env?.[key];
  } catch (e) {
    return undefined;
  }
};

// We use the keys provided, with a fallback to the environment variables
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 'https://mkjzmnawediyllobolhj.supabase.co';
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ranptbmF3ZWRpeWxsb2JvbGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTE1MjksImV4cCI6MjA3OTk2NzUyOX0.WPv5ehovp5KJjwTX4B1mmYruC9uLasALvwaCI9EjSTw';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase configuration.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Ensure session is saved in localStorage
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
