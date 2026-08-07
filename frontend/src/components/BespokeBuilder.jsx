import React, { useState } from 'react';

const BespokeBuilder = () => {
  const WHATSAPP_PHONE = '923154327855';

  // Builder configuration options
  const shapes = [
    { id: 'flask', label: 'Classic Flask', path: 'M 100 80 L 100 110 L 70 110 L 70 250 A 30 30 0 0 0 130 280 L 170 280 A 30 30 0 0 0 230 250 L 230 110 L 200 110 L 200 80 Z' },
    { id: 'cube', label: 'Modern Cube', path: 'M 110 80 L 110 110 L 60 110 L 60 270 L 240 270 L 240 110 L 190 110 L 190 80 Z' },
    { id: 'cylinder', label: 'Sleek Cylinder', path: 'M 115 80 L 115 110 A 65 25 0 0 0 65 130 L 65 250 A 65 25 0 0 0 235 250 L 235 130 A 65 25 0 0 0 185 110 L 185 80 Z' }
  ];

  const colors = [
    { id: 'pink', label: 'Rose Blush', hex: '#FCE1E4', fill: 'rgba(252, 225, 228, 0.75)' },
    { id: 'peach', label: 'Peach Nectar', hex: '#FCF6BD', fill: 'rgba(252, 246, 189, 0.75)' },
    { id: 'lavender', label: 'Lavender Mist', hex: '#E8E8FF', fill: 'rgba(232, 232, 255, 0.75)' },
    { id: 'mint', label: 'Sage Mint', hex: '#D8F3DC', fill: 'rgba(216, 243, 220, 0.75)' }
  ];

  // Olfactory notes database
  const topNotes = ['French Lavender', 'Bergamot', 'Sweet Orange', 'White Peach', 'Peppermint'];
  const heartNotes = ['Bulgarian Rose', 'Jasmine Sambac', 'Red Peony', 'Wild Orchid', 'Cardamom'];
  const baseNotes = ['White Musk', 'Warm Oud', 'Sandalwood', 'Vanilla Extract', 'Cedarwood'];

  // Scent builder states
  const [selectedShape, setSelectedShape] = useState('flask');
  const [selectedColor, setSelectedColor] = useState('pink');
  const [customLabel, setCustomLabel] = useState('My Essence');
  const [selectedTop, setSelectedTop] = useState([]);
  const [selectedHeart, setSelectedHeart] = useState([]);
  const [selectedBase, setSelectedBase] = useState([]);

  // Checkbox limits (max 2 per tier)
  const handleNoteToggle = (tier, note, selectedList, setSelectedList) => {
    if (selectedList.includes(note)) {
      setSelectedList(selectedList.filter(n => n !== note));
    } else {
      if (selectedList.length >= 2) {
        alert(`You can select a maximum of 2 notes for the ${tier} tier.`);
        return;
      }
      setSelectedList([...selectedList, note]);
    }
  };

  const getActiveColor = () => colors.find(c => c.id === selectedColor);
  const getActiveShape = () => shapes.find(s => s.id === selectedShape);

  // Generate WhatsApp compiled text
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedTop.length === 0 && selectedHeart.length === 0 && selectedBase.length === 0) {
      alert('Please select at least one scent note to build your custom recipe.');
      return;
    }

    const shapeLabel = getActiveShape().label;
    const colorLabel = getActiveColor().label;

    const message = `Hello Al-Qadsiya Khushbuu Mahal! I would like to order a Custom Scent with these specifications:
- *Bottle Shape:* ${shapeLabel}
- *Liquid Color/Aura:* ${colorLabel}
- *Custom Label Name:* "${customLabel}"
- *Top Notes (max 2):* ${selectedTop.join(', ') || 'None'}
- *Heart Notes (max 2):* ${selectedHeart.join(', ') || 'None'}
- *Base Notes (max 2):* ${selectedBase.join(', ') || 'None'}
Please let me know the pricing and delivery details. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodedMessage}`;
    
    // Open in new window
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="view-section active" id="view-bespoke" style={{ paddingTop: '120px' }}>
      <div className="section-header">
        <span className="section-subtitle">Bespoke Workspace</span>
        <h2 className="section-title">Custom Scent Customizer</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '50px', marginTop: '40px' }} className="quickview-layout">
        
        {/* Visual bottle representation column */}
        <div style={{
          background: 'var(--color-card-bg)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--box-shadow-medium)',
          backdropFilter: 'var(--backdrop-blur)',
          position: 'sticky',
          top: '120px',
          height: 'fit-content'
        }}>
          
          <h3 className="font-serif" style={{ fontSize: '1.6rem', marginBottom: '20px', color: 'var(--text-main)' }}>
            Real-Time Visualizer
          </h3>

          {/* Dynamic SVG Perfume Bottle */}
          <svg width="300" height="350" viewBox="0 0 300 350" style={{ filter: 'drop-shadow(0 15px 25px rgba(60, 42, 61, 0.12))' }}>
            {/* Glass Bottle Cap */}
            <rect x="130" y="30" width="40" height="40" rx="8" fill="#e5c158" stroke="#cca32e" strokeWidth="1.5" />
            <line x1="130" y1="50" x2="170" y2="50" stroke="#cca32e" strokeWidth="1" />
            
            {/* Spray Nozzle Stem */}
            <rect x="145" y="70" width="10" height="12" fill="#d1d1d1" />

            {/* Dynamic Liquid Body Fill */}
            <path
              d={getActiveShape().path}
              fill={getActiveColor().fill}
              stroke="transparent"
              style={{ transition: 'fill 0.5s ease' }}
            />

            {/* Inner Liquid Wave effect */}
            <path
              d="M 68 150 Q 150 140 232 150 L 232 260 L 68 260 Z"
              fill="rgba(255,255,255,0.08)"
              pointerEvents="none"
            />

            {/* Glass Bottle Border Outline */}
            <path
              d={getActiveShape().path}
              fill="transparent"
              stroke="#D4B26F"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Glass reflections */}
            <path
              d="M 85 130 C 85 130 95 240 100 240"
              fill="none"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Custom Label Area */}
            <g transform="translate(95, 170)">
              <rect x="0" y="0" width="110" height="50" rx="4" fill="white" stroke="#e5c158" strokeWidth="1.5" />
              <text
                x="55"
                y="22"
                textAnchor="middle"
                fontFamily="'Outfit', sans-serif"
                fontSize="9"
                fontWeight="500"
                letterSpacing="0.1em"
                fill="var(--text-main)"
                style={{ textTransform: 'uppercase' }}
              >
                AL-QADSIYA
              </text>
              <text
                x="55"
                y="38"
                textAnchor="middle"
                fontFamily="'Cormorant Garamond', serif"
                fontSize="12"
                fontWeight="bold"
                fill="var(--text-main)"
                fontStyle="italic"
              >
                {customLabel.substring(0, 15) || 'My Essence'}
              </text>
            </g>
          </svg>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '20px', letterSpacing: '0.05em' }}>
            Liquid Fill: <strong>{getActiveColor().label}</strong> | Shape: <strong>{getActiveShape().label}</strong>
          </span>
        </div>

        {/* Controls and selections column */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* 1. Bottle Shape selection */}
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '15px', borderBottom: '1px solid rgba(60, 42, 61, 0.05)', paddingBottom: '6px' }}>
              1. Select Bottle Silhouette
            </h3>
            <div style={{ display: 'flex', gap: '15px' }}>
              {shapes.map((shape) => (
                <button
                  key={shape.id}
                  type="button"
                  className={`btn btn-secondary ${selectedShape === shape.id ? 'active-shape-btn' : ''}`}
                  style={{ flexGrow: 1, padding: '12px 10px', fontSize: '0.8rem' }}
                  onClick={() => setSelectedShape(shape.id)}
                >
                  {shape.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Liquid Fill selection */}
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '15px', borderBottom: '1px solid rgba(60, 42, 61, 0.05)', paddingBottom: '6px' }}>
              2. Select Aura / Liquid Hue
            </h3>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              {colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={`color-dot ${selectedColor === color.id ? 'active-color' : ''}`}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: color.hex,
                    border: '2px solid white',
                    boxShadow: 'var(--box-shadow-soft)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedColor(color.id)}
                  title={color.label}
                />
              ))}
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
                {getActiveColor().label}
              </span>
            </div>
          </div>

          {/* 3. Custom Label input */}
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '15px', borderBottom: '1px solid rgba(60, 42, 61, 0.05)', paddingBottom: '6px' }}>
              3. Engrave Custom Name on Label
            </h3>
            <input
              type="text"
              className="admin-form-input"
              style={{ width: '100%', padding: '14px 20px', fontSize: '1rem' }}
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="e.g. Amber Whisper, My Scent..."
              maxLength={15}
            />
          </div>

          {/* 4. Notes Customization */}
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '8px', borderBottom: '1px solid rgba(60, 42, 61, 0.05)', paddingBottom: '6px' }}>
              4. Curate Olfactory Profile
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Select a maximum of 2 notes per tier to compose your formula.
            </p>

            {/* Top notes tier */}
            <div style={{ marginBottom: '25px' }}>
              <span className="qv-category" style={{ display: 'block', marginBottom: '8px' }}>
                Top Tier Notes ({selectedTop.length}/2 selected)
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {topNotes.map((note) => (
                  <label
                    key={note}
                    className={`note-checkbox-label ${selectedTop.includes(note) ? 'note-checked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTop.includes(note)}
                      onChange={() => handleNoteToggle('Top', note, selectedTop, setSelectedTop)}
                    />
                    {note}
                  </label>
                ))}
              </div>
            </div>

            {/* Heart notes tier */}
            <div style={{ marginBottom: '25px' }}>
              <span className="qv-category" style={{ display: 'block', marginBottom: '8px' }}>
                Heart/Middle Tier Notes ({selectedHeart.length}/2 selected)
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {heartNotes.map((note) => (
                  <label
                    key={note}
                    className={`note-checkbox-label ${selectedHeart.includes(note) ? 'note-checked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedHeart.includes(note)}
                      onChange={() => handleNoteToggle('Heart', note, selectedHeart, setSelectedHeart)}
                    />
                    {note}
                  </label>
                ))}
              </div>
            </div>

            {/* Base notes tier */}
            <div style={{ marginBottom: '25px' }}>
              <span className="qv-category" style={{ display: 'block', marginBottom: '8px' }}>
                Base Tier Notes ({selectedBase.length}/2 selected)
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {baseNotes.map((note) => (
                  <label
                    key={note}
                    className={`note-checkbox-label ${selectedBase.includes(note) ? 'note-checked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBase.includes(note)}
                      onChange={() => handleNoteToggle('Base', note, selectedBase, setSelectedBase)}
                    />
                    {note}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit recipe compiled details */}
          <button
            type="submit"
            className="btn btn-primary btn-whatsapp-checkout"
            style={{ width: '100%', padding: '16px', borderRadius: '24px', color: '#1B5E20' }}
          >
            Submit Order on WhatsApp <i className="fa-brands fa-whatsapp"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default BespokeBuilder;
