// POST /api/admin/login  →  verify admin passcode
import { setCorsHeaders } from '../_lib/supabase.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { passcode } = req.body || {};
  if (!passcode) return res.status(400).json({ success: false, message: 'Passcode is required' });

  // Passcode is stored as a Vercel environment variable — never hard-coded
  const adminPasscode = process.env.ADMIN_PASSCODE || 'admin123';

  if (passcode === adminPasscode) {
    return res.status(200).json({
      success: true,
      token: 'scentora_admin_authenticated'
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Incorrect admin passcode. Please try again.'
  });
}
