// GET  /api/products       → list all products
// POST /api/products       → create a new product
import { supabase, calcStockStatus, setCorsHeaders } from './_lib/supabase.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET all products ────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('GET /api/products error:', error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  // ── POST create product ─────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const body = req.body || {};

    if (!body.name || !body.category) {
      return res.status(422).json({ error: 'name and category are required' });
    }

    const qty = parseInt(body.quantity) || 0;

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name:         String(body.name).trim(),
        brand:        String(body.brand || 'Floral Scentora').trim(),
        category:     String(body.category).trim(),
        price:        parseFloat(body.price) || 0,
        quantity:     qty,
        stock_status: calcStockStatus(qty),
        notes_top:    body.notes_top    || '',
        notes_middle: body.notes_middle || '',
        notes_base:   body.notes_base   || '',
        description:  body.description  || '',
        image:        body.image        || '',
        longevity:    body.longevity    || '',
        sillage:      body.sillage      || '',
      }])
      .select()
      .single();

    if (error) {
      console.error('POST /api/products error:', error);
      return res.status(422).json({ error: error.message });
    }
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
