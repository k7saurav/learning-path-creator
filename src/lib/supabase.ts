
import { createClient } from '@supabase/supabase-js';

// To find your Supabase URL and anon key:
// 1. Go to https://supabase.com and sign in
// 2. Create a new project or select your existing project
// 3. In your project dashboard, go to Project Settings > API
// 4. Copy the URL under "Project URL" and the anon key under "Project API keys"

// Replace these with your actual Supabase credentials
const supabaseUrl = 'YOUR_ACTUAL_SUPABASE_URL'; // Replace with your URL
const supabaseAnonKey = 'YOUR_ACTUAL_ANON_KEY'; // Replace with your key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
