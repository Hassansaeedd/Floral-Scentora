// GET /api/image-proxy?url=https://alqadsiya.com/...
// Proxies images from alqadsiya.com to bypass hotlink protection.
// Only allows alqadsiya.com images for security.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url query parameter' });

  // Security: only proxy images from the allowed domain
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const allowedDomains = ['alqadsiya.com', 'www.alqadsiya.com'];
  if (!allowedDomains.some(d => parsedUrl.hostname === d || parsedUrl.hostname.endsWith('.' + d))) {
    return res.status(403).json({ error: 'Forbidden: domain not allowed' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Referer':         'https://alqadsiya.com/',
        'Accept':          'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Source returned ${response.status}` });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=604800, s-maxage=604800'); // 7-day cache
    res.setHeader('X-Content-Type-Options', 'nosniff');

    return res.status(200).send(buffer);
  } catch (err) {
    console.error('image-proxy error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch image' });
  }
}
