
import { createClient } from '@supabase/supabase-js';

// To find your Supabase URL and anon key:
// 1. Go to https://supabase.com and sign in
// 2. Create a new project or select your existing project
// 3. In your project dashboard, go to Project Settings > API
// 4. Copy the URL under "Project URL" and the anon key under "Project API keys"

// Supabase credentials
const supabaseUrl = 'https://wpgpdespwayiioknjqxf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZ3BkZXNwd2F5aWlva25qcXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNjU0NjMsImV4cCI6MjA1ODc0MTQ2M30.U-bOb2zJjTld9Irck720e3GJc0eIVysl1XheAG_m3Nw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
