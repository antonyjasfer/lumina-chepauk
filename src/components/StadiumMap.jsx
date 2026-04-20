import React from 'react';
import PropTypes from 'prop-types';

/**
 * StadiumMap — SVG-based real-time heatmap visualization of M.A. Chidambaram Stadium.
 * Renders 23 stands, 10 sponsor stalls, 4 water stations, and cricket field.
 * Color-coded congestion levels update dynamically via the StadiumEngine.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.state - Current stadium state from StadiumEngine
 * @accessibility SVG has role="img" and aria-label for screen readers.
 * @accessibility Each stand/stall has a <title> element for tooltip accessibility.
 */
const StadiumMap = React.memo(({ state }) => {
  const getCongestionClass = (density) => {
    if (!density && density !== 0) return 'congestion-low';
    if (density > 85) return 'congestion-high';
    if (density > 60) return 'congestion-medium';
    return 'congestion-low';
  };

  const getStallCrowdClass = (crowd, capacity) => {
    const pct = (crowd / capacity) * 100;
    if (pct > 70) return 'congestion-high';
    if (pct > 40) return 'congestion-medium';
    return 'congestion-low';
  };

  // 12 lower sections
  const lowerStands = [
    { name: 'Anna Pavilion', angle: 0 },
    { name: 'Lower C', angle: 30 },
    { name: 'Lower D', angle: 60 },
    { name: 'Lower E', angle: 90 },
    { name: 'Lower F', angle: 120 },
    { name: 'Lower G', angle: 150 },
    { name: 'KMK Lower', angle: 180 },
    { name: 'Lower H', angle: 210 },
    { name: 'Lower I', angle: 240 },
    { name: 'Lower J', angle: 270 },
    { name: 'Lower K', angle: 300 },
    { name: 'Lower L', angle: 330 }
  ];

  // 11 upper sections (no Anna Pavilion upper)
  const upperStands = [
    { name: 'Upper C', angle: 30 },
    { name: 'Upper D', angle: 60 },
    { name: 'Upper E', angle: 90 },
    { name: 'Upper F', angle: 120 },
    { name: 'Upper G', angle: 150 },
    { name: 'KMK Upper', angle: 180 },
    { name: 'Upper H', angle: 210 },
    { name: 'Upper I', angle: 240 },
    { name: 'Upper J', angle: 270 },
    { name: 'Upper K', angle: 300 },
    { name: 'Upper L', angle: 330 }
  ];

  // 10 stalls placed around the perimeter
  const stallPositions = [
    { name: 'Chai Kings Tea Lounge', angle: 15 },
    { name: 'The Catering Co. Express', angle: 45 },
    { name: 'Erode Amman Mess (EAM)', angle: 75 },
    { name: 'Ganga Sweets Corner', angle: 105 },
    { name: 'Moksha Morsel Café', angle: 135 },
    { name: 'British Empire Beverages', angle: 195 },
    { name: 'CSK Official SuperStore', angle: 225 },
    { name: 'Dream11 Fan Zone', angle: 255 },
    { name: 'JioCinema VR Zone', angle: 285 },
    { name: 'CEAT Timeout Café', angle: 315 }
  ];

  // 4 water stations
  const waterPositions = [
    { name: 'British Empire Water Point A', angle: 0 },
    { name: 'British Empire Water Point B', angle: 90 },
    { name: 'British Empire Water Point C', angle: 180 },
    { name: 'British Empire Water Point D', angle: 270 }
  ];

  const renderStandPolygon = (standName, angle, tier) => {
    const standData = state.stands[standName];
    if (!standData) return null;

    const capacity = standData.capacity || 1000;
    const peopleCount = Math.floor(capacity * (standData.density / 100));

    let polyPoints, textY;
    if (tier === 'lower') {
      polyPoints = "-24,-105 24,-105 42,-170 -42,-170";
      textY = -138;
    } else {
      polyPoints = "-44,-175 44,-175 60,-230 -60,-230";
      textY = -203;
    }

    const textRotation = (angle > 90 && angle < 270) ? 180 : 0;
    const shortName = standName.replace('Lower ', 'L-').replace('Upper ', 'U-').replace('Anna Pavilion', 'Pavilion');

    return (
      <g key={standName} transform={`rotate(${angle})`} className={`stand-path ${getCongestionClass(standData.density)}`} style={{ cursor: 'pointer' }}>
        <polygon points={polyPoints} />
        <title>{`${standName}: ${peopleCount.toLocaleString()} / ${capacity.toLocaleString()} people (${Math.round(standData.density)}% full)`}</title>
        <g transform={`translate(0, ${textY}) rotate(${textRotation})`}>
          <text x="0" y="-4" fill="#fff" textAnchor="middle" fontSize={tier === 'lower' ? '9' : '10'} fontWeight="bold" opacity="0.95">{shortName}</text>
          <text x="0" y="7" fill="#fff" textAnchor="middle" fontSize={tier === 'lower' ? '7' : '8'} opacity="0.85">
            👥 <tspan fill="var(--chepauk-yellow)" fontWeight="bold">{peopleCount.toLocaleString()}</tspan>
          </text>
        </g>
      </g>
    );
  };

  const renderStall = (stallName, angle) => {
    const stallData = state.stalls[stallName];
    if (!stallData) return null;

    const radius = 275;
    const rad = (angle - 90) * (Math.PI / 180);
    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;

    // Short display name (sponsor name)
    const shortName = stallData.sponsor || stallName.split(' ')[0];

    return (
      <g key={stallName} transform={`translate(${x}, ${y})`} className="stall-marker">
        <rect x="-32" y="-22" width="64" height="44" rx="8"
          className={`stall-rect ${getStallCrowdClass(stallData.crowd, stallData.capacity)}`} />
        <text x="0" y="-8" fill="#fff" textAnchor="middle" fontSize="10" fontWeight="bold">{stallData.emoji}</text>
        <text x="0" y="4" fill="#fff" textAnchor="middle" fontSize="5.5" fontWeight="bold" opacity="0.9">{shortName}</text>
        <text x="0" y="13" fill="var(--chepauk-yellow)" textAnchor="middle" fontSize="6" fontWeight="bold">{stallData.crowd}</text>
        <title>{`${stallName} (${stallData.sponsor || 'IPL Sponsor'}): ${stallData.crowd}/${stallData.capacity} people`}</title>
      </g>
    );
  };

  const renderWaterStation = (wsName, angle) => {
    const wsData = state.waterStations[wsName];
    if (!wsData) return null;

    const radius = 250;
    const rad = (angle - 90) * (Math.PI / 180);
    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;

    const brandName = wsData.brand || 'Water';

    return (
      <g key={wsName} transform={`translate(${x}, ${y})`} className="water-station">
        <circle cx="0" cy="0" r="16" className="water-circle" />
        <text x="0" y="-2" fill="#fff" textAnchor="middle" fontSize="10">{wsData.emoji}</text>
        <text x="0" y="8" fill="#38bdf8" textAnchor="middle" fontSize="4.5" fontWeight="bold">{brandName}</text>
        <text x="0" y="24" fill="#38bdf8" textAnchor="middle" fontSize="7" fontWeight="bold">FREE</text>
        <text x="0" y="32" fill="#94a3b8" textAnchor="middle" fontSize="5">{wsData.crowd} ppl</text>
        <title>{`${wsName}: ${wsData.crowd} people (FREE)`}</title>
      </g>
    );
  };

  // Fielder positions (cricket field)
  const fielderPositions = [
    { label: 'WK', x: 0, y: 30 },
    { label: 'Slip', x: 18, y: 25 },
    { label: 'Gully', x: 30, y: 15 },
    { label: 'Cover', x: 45, y: -15 },
    { label: 'Mid-off', x: 25, y: -40 },
    { label: 'Mid-on', x: -25, y: -40 },
    { label: 'Mid-wkt', x: -40, y: -10 },
    { label: 'Sq Leg', x: -35, y: 15 },
    { label: 'Fine Leg', x: -25, y: 50 },
  ];

  const anim = state.animation;
  const zones = state.crowdZones || { inSeats: 0, atAmenities: 0, roaming: 0, total: 0 };

  return (
    <section className="map-container glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} aria-label="Stadium Heatmap" id="stadium-heatmap">
      <div>
        <h2 className="header-title glow-text" style={{ fontSize: '1.4rem' }}>🏟️ Live Heatmap & Crowd Analytics</h2>
        <div className="header-subtitle">M.A. Chidambaram Stadium (Chepauk) — Real-Time Capacity Monitoring</div>
        
        {/* Crowd Zone Breakdown */}
        <div className="crowd-zones-panel" id="crowd-zones" aria-label="Crowd Zone Breakdown" role="group">
          <div className="crowd-zone-item">
            <span className="zone-icon" aria-hidden="true">🪑</span>
            <span className="zone-label">In Seats</span>
            <span className="zone-value zone-seats" aria-label={`${zones.inSeats.toLocaleString()} in seats`}>{zones.inSeats.toLocaleString()}</span>
          </div>
          <div className="crowd-zone-divider" aria-hidden="true"></div>
          <div className="crowd-zone-item">
            <span className="zone-icon" aria-hidden="true">🏬</span>
            <span className="zone-label">At Stalls</span>
            <span className="zone-value zone-stalls" aria-label={`${zones.atAmenities.toLocaleString()} at stalls`}>{zones.atAmenities.toLocaleString()}</span>
          </div>
          <div className="crowd-zone-divider" aria-hidden="true"></div>
          <div className="crowd-zone-item">
            <span className="zone-icon" aria-hidden="true">🚶</span>
            <span className="zone-label">Roaming</span>
            <span className="zone-value zone-roaming" aria-label={`${zones.roaming.toLocaleString()} roaming`}>{zones.roaming.toLocaleString()}</span>
          </div>
          <div className="crowd-zone-divider" aria-hidden="true"></div>
          <div className="crowd-zone-item crowd-zone-total">
            <span className="zone-icon" aria-hidden="true">📊</span>
            <span className="zone-label">Total</span>
            <span className="zone-value zone-total-val" aria-label={`Total ${zones.total.toLocaleString()}`}>{zones.total.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ marginTop: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            Legend:
            <span className="legend-dot" style={{ background: 'var(--status-clear)' }} aria-label="Green: under 60% capacity"></span> &lt;60%
            <span className="legend-dot" style={{ background: 'var(--status-moderate)' }} aria-label="Amber: 60-85% capacity"></span> 60-85%
            <span className="legend-dot" style={{ background: 'var(--status-critical)' }} aria-label="Red: over 85% capacity"></span> &gt;85%
          </span>
        </div>
      </div>

      <div className="map-svg-wrapper" style={{ flex: 1, minHeight: '520px' }}>
        <svg viewBox="-320 -320 640 640" width="100%" height="100%" style={{ overflow: 'visible' }} role="img" aria-label="Interactive heatmap of Chepauk Stadium showing crowd density across all stands, stalls, and water stations">
          <title>Live Crowd Heatmap — M.A. Chidambaram Stadium (Chepauk)</title>
          <desc>Real-time visualization showing crowd density in 23 stands, 10 sponsor stalls, and 4 water stations. Colors indicate congestion: green (under 60%), amber (60-85%), red (over 85%).</desc>

          {/* Outer ring guide */}
          <circle cx="0" cy="0" r="240" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="0" cy="0" r="280" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Pitch — Cricket Ground */}
          <ellipse cx="0" cy="0" rx="65" ry="78" fill="#1a4a2e" stroke="#2d8a4e" strokeWidth="1.5" opacity="0.6" />
          <rect x="-3" y="-22" width="6" height="44" fill="#c4a35a" opacity="0.5" rx="1" />

          {/* 30-yard circle */}
          <circle cx="0" cy="0" r="50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="3 3" />

          {/* Boundary rope */}
          <ellipse cx="0" cy="0" rx="65" ry="78" fill="none" stroke="#fcd500" strokeWidth="0.5" opacity="0.3" />

          {/* Batsman */}
          <g transform="translate(0, 18)">
            <circle cx="0" cy="0" r="4" fill="#fcd500" className={anim.batsmanSwing ? 'batsman-swing' : ''} />
            <text x="0" y="12" fill="#fcd500" textAnchor="middle" fontSize="5" fontWeight="bold">BAT</text>
          </g>

          {/* Bowler */}
          <g transform="translate(0, -55)">
            <circle cx="0" cy="0" r="3.5" fill="#ff6b6b" className={anim.bowlerRun ? 'bowler-run' : ''} />
            <text x="0" y="-8" fill="#ff6b6b" textAnchor="middle" fontSize="5" fontWeight="bold">BOWL</text>
          </g>

          {/* Ball animation */}
          {anim.ballInPlay && (
            <circle cx="0" cy="-10" r="2" fill="#fff" className={`ball-anim ball-anim-${anim.ballTarget}`} />
          )}

          {/* Fielders */}
          {fielderPositions.map((f, i) => (
            <g key={i} transform={`translate(${f.x}, ${f.y})`} className="fielder-dot">
              <circle cx="0" cy="0" r="2.5" fill="#38bdf8" opacity="0.7" />
              <text x="0" y="-5" fill="#94a3b8" textAnchor="middle" fontSize="4">{f.label}</text>
            </g>
          ))}

          {/* Stands */}
          {lowerStands.map(s => renderStandPolygon(s.name, s.angle, 'lower'))}
          {upperStands.map(s => renderStandPolygon(s.name, s.angle, 'upper'))}

          {/* Stalls */}
          {stallPositions.map(s => renderStall(s.name, s.angle))}

          {/* Water Stations */}
          {waterPositions.map(w => renderWaterStation(w.name, w.angle))}

          {/* Boundary flash */}
          {anim.ballTarget === 'boundary' && (
            <ellipse cx="0" cy="0" rx="65" ry="78" fill="none" stroke="#fcd500" strokeWidth="3" opacity="0.6" className="boundary-flash" />
          )}
          {anim.ballTarget === 'six' && (
            <ellipse cx="0" cy="0" rx="65" ry="78" fill="none" stroke="#ff6b6b" strokeWidth="4" opacity="0.8" className="six-flash" />
          )}
        </svg>
      </div>
    </section>
  );
});

StadiumMap.displayName = 'StadiumMap';

StadiumMap.propTypes = {
  /** Current stadium state object from StadiumEngine */
  state: PropTypes.shape({
    stands: PropTypes.objectOf(PropTypes.shape({
      density: PropTypes.number.isRequired,
      excitement: PropTypes.number,
      capacity: PropTypes.number.isRequired,
    })).isRequired,
    stalls: PropTypes.objectOf(PropTypes.shape({
      crowd: PropTypes.number.isRequired,
      capacity: PropTypes.number.isRequired,
      type: PropTypes.string,
      emoji: PropTypes.string,
      sponsor: PropTypes.string,
    })).isRequired,
    waterStations: PropTypes.objectOf(PropTypes.shape({
      crowd: PropTypes.number.isRequired,
      capacity: PropTypes.number.isRequired,
      emoji: PropTypes.string,
      brand: PropTypes.string,
    })).isRequired,
    animation: PropTypes.shape({
      ballInPlay: PropTypes.bool,
      ballTarget: PropTypes.string,
      batsmanSwing: PropTypes.bool,
      bowlerRun: PropTypes.bool,
    }).isRequired,
    crowdZones: PropTypes.shape({
      inSeats: PropTypes.number.isRequired,
      atAmenities: PropTypes.number.isRequired,
      roaming: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
    }),
  }).isRequired,
};

export default StadiumMap;
