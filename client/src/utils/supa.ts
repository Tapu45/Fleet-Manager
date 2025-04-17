// filepath: c:\Users\ramit\OneDrive\Desktop\fleet-manager\fleet-manager\client\src\utils\supa.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''; // Use Vite's environment variables if using Vite
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Supabase URL or Key is missing in environment variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);