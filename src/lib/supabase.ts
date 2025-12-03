import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TrackingCode {
  id: string;
  code: string;
  account?: string;
  real_tracking_code?: string;
  status: string;
  created_at: string;
  updated_at: string;
}
