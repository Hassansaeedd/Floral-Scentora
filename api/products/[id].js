// GET    /api/products/:id  → fetch single product
// PUT    /api/products/:id  → update product
// DELETE /api/products/:id  → delete product
import { supabase, calcStockStatus, setCorsHeaders } from '../_lib/supabase.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing product id' });

  // ── GET single product ──────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json(data);
  }

  // ── PUT update product ──────────────────────────────────────────────────────
  if (req.method === 'PUT') {
    const body = req.body || {};
    const updates = {};

    // Only include fields that were actually sent
    const allowed = [
      'name', 'brand', 'category', 'price', 'quantity',
      'notes_top', 'notes_middle', 'notes_base',
      'description', 'image', 'longevity', 'sillage'
    ];

    for (const field of allowed) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (updates.quantity !== undefined) {
      updates.quantity    = parseInt(updates.quantity) || 0;
      updates.stock_status = calcStockStatus(updates.quantity);
    }

    if (updates.price !== undefined) {
      updates.price = parseFloat(updates.price) || 0;
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`PUT /api/products/${id} error:`, error);
      return res.status(422).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  // ── DELETE product ──────────────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`DELETE /api/products/${id} error:`, error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ message: 'Product deleted successfully' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
