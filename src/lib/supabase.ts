
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and anon key
// You can find these in your Supabase dashboard: Settings > API
const supabaseUrl = 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
