import React, { useState } from 'react';

const ScentPyramid = ({ topNotes, middleNotes, baseNotes }) => {
  const [activeTier, setActiveTier] = useState(null);

  const tiers = [
    {
      id: 'top',
      label: 'Top Notes',
      value: topNotes || 'Not specified',
      class: 'pyramid-tier-top',
      accentColor: '#FCE1E4',
      description: 'The initial scent burst, lasting for the first 15-30 minutes.'
    },
    {
      id: 'middle',
      label: 'Heart Notes',
      value: middleNotes || 'Not specified',
      class: 'pyramid-tier-middle',
      accentColor: '#FCF6BD',
      description: 'The core body of the fragrance, developing after top notes fade.'
    },
    {
      id: 'base',
      label: 'Base Notes',
      value: baseNotes || 'Not specified',
      class: 'pyramid-tier-base',
      accentColor: '#D8F3DC',
      description: 'The deepest notes that linger on skin for hours.'
    }
  ];

  return (
    <div style={{ marginTop: '20px' }}>
      <span className="qv-category" style={{ display: 'block', marginBottom: '8px' }}>
        Scent Pyramid Visualizer
      </span>
      <div className="scent-pyramid-container">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`pyramid-tier ${tier.class}`}
            onMouseEnter={() => setActiveTier(tier.id)}
            onMouseLeave={() => setActiveTier(null)}
            style={{
              borderColor: activeTier === tier.id ? tier.accentColor : 'rgba(60, 42, 61, 0.08)'
            }}
          >
            <span className="pyramid-label">{tier.label}</span>
            <span className="pyramid-value">{tier.value}</span>
          </div>
        ))}
      </div>
      
      {/* Dynamic descriptor detail area */}
      <div style={{
        marginTop: '15px',
        padding: '12px 15px',
        minHeight: '75px',
        backgroundColor: 'rgba(60, 42, 61, 0.02)',
        borderRadius: '8px',
        fontSize: '0.8rem',
        border: '1px solid rgba(60, 42, 61, 0.05)',
        transition: 'all 0.3s ease'
      }}>
        {activeTier ? (
          <>
            <strong style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--accent-gold)', display: 'block', marginBottom: '4px' }}>
              {tiers.find(t => t.id === activeTier).label} Profile
            </strong>
            <p style={{ color: 'var(--text-muted)' }}>
              {tiers.find(t => t.id === activeTier).description}
            </p>
          </>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: '10px', fontStyle: 'italic' }}>
            Hover over the pyramid levels to explore olfactory structures.
          </p>
        )}
      </div>
    </div>
  );
};

export default ScentPyramid;
