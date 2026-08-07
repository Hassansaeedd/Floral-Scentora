// Shared Supabase client for Vercel API functions
// Uses the service role key so all CRUD operations bypass RLS
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export function calcStockStatus(qty) {
  const q = parseInt(qty) || 0;
  if (q <= 0) return 'Out of Stock';
  if (q <= 5) return 'Low Stock';
  return 'In Stock';
}

export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
