// Shared image helper for Floral Scentora
export const FALLBACK_PERFUME_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" fill="none">
  <defs>
    <linearGradient id="cardBg" x1="0" y1="0" x2="300" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FAF7F2"/>
      <stop offset="100%" stop-color="#F2EBE1"/>
    </linearGradient>
    <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F4E3B2"/>
      <stop offset="50%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#AA820A"/>
    </linearGradient>
    <linearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.92)"/>
      <stop offset="30%" stop-color="rgba(250,245,238,0.75)"/>
      <stop offset="100%" stop-color="rgba(240,225,210,0.55)"/>
    </linearGradient>
    <filter id="bottleShadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#8C7355" flood-opacity="0.14"/>
    </filter>
  </defs>
  
  <!-- Subtle Background Canvas -->
  <rect width="300" height="400" fill="url(#cardBg)"/>
  
  <!-- Bottle Group with Glow/Shadow -->
  <g filter="url(#bottleShadow)">
    <!-- Sprayer Nozzle -->
    <rect x="142" y="70" width="16" height="18" rx="2" fill="url(#goldGradient)"/>
    <rect x="135" y="88" width="30" height="16" rx="3" fill="url(#goldGradient)"/>
    
    <!-- Bottle Cap -->
    <rect x="122" y="104" width="56" height="34" rx="6" fill="url(#goldGradient)"/>
    <rect x="126" y="108" width="48" height="2" fill="#FFF" opacity="0.4"/>
    
    <!-- Bottle Neck Collar -->
    <rect x="132" y="138" width="36" height="12" rx="2" fill="url(#goldGradient)"/>
    
    <!-- Main Bottle Body -->
    <rect x="85" y="150" width="130" height="175" rx="16" fill="url(#glassGradient)" stroke="#E8DFD3" stroke-width="2"/>
    <rect x="91" y="156" width="118" height="163" rx="12" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
    
    <!-- Inner Perfume Fluid Level -->
    <rect x="96" y="195" width="108" height="118" rx="8" fill="url(#goldGradient)" opacity="0.2"/>
    
    <!-- Label Shield -->
    <rect x="108" y="190" width="84" height="90" rx="4" fill="#FFFFFF" stroke="url(#goldGradient)" stroke-width="1.2"/>
    
    <!-- Botanical Motif inside label -->
    <path d="M150 208 C144 216 142 222 150 228 C158 222 156 216 150 208 Z" fill="url(#goldGradient)"/>
    <circle cx="150" cy="229" r="1.5" fill="#AA820A"/>
    
    <!-- Minimalist Typography lines on label -->
    <rect x="120" y="238" width="60" height="2" rx="1" fill="#2C2C2C" opacity="0.8"/>
    <rect x="130" y="244" width="40" height="1.5" rx="0.75" fill="#AA820A" opacity="0.9"/>
    <rect x="125" y="254" width="50" height="1.2" rx="0.6" fill="#888888" opacity="0.6"/>
    <rect x="138" y="262" width="24" height="1" rx="0.5" fill="#888888" opacity="0.5"/>
    
    <!-- Base Highlight -->
    <line x1="100" y1="315" x2="200" y2="315" stroke="rgba(255,255,255,0.8)" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>
`)}`;

export const getImageUrl = (image) => {
  if (!image || typeof image !== 'string' || !image.trim()) {
    return FALLBACK_PERFUME_SVG;
  }
  const clean = image.trim();
  if (clean.startsWith('data:') || clean.startsWith('blob:')) {
    return clean;
  }
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  if (clean.startsWith('/')) {
    return clean;
  }
  return `/${clean}`;
};

export const handleImageError = (e) => {
  if (e.target.src !== FALLBACK_PERFUME_SVG) {
    e.target.onerror = null;
    e.target.src = FALLBACK_PERFUME_SVG;
  }
};
