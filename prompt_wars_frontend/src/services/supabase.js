import { createClient } from '@supabase/supabase-js';

// Public Supabase Project for Equipo Authentication
const SUPABASE_URL = "https://xuxgswsfgpvxegbvvycu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1eGdzd3NmZ3B2eGVnYnZ2eWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MTc2MDAsImV4cCI6MjAyNTM5MzYwMH0.1234567890abcdef";

// Configurable client with graceful fallback
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});