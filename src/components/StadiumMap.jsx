import React from 'react';

const StadiumMap = ({ state }) => {
  // Helper to map density to CSS class
  const getCongestionClass = (density) => {
    if (density > 85) return 'congestion-high';
    if (density > 60) return 'congestion-medium';
    return 'congestion-low';
  };

  const getConcessionClass = (waitTime) => {
    if (waitTime > 20) return 'congestion-high';
    if (waitTime > 10) return 'congestion-medium';
    return 'congestion-low';
  };

  return (
    <div className="map-container glass-panel">
      <div className="header-title glow-text">
        Live Heatmap
      </div>
      <div className="header-subtitle">
        M.A. Chidambaram Stadium (Chepauk)
      </div>

      <div className="map-svg-wrapper">
        <svg viewBox="0 0 400 400" width="100%" height="100%">
          {/* Pitch */}
          <ellipse cx="200" cy="200" rx="80" ry="100" fill="#0d283f" stroke="#fcd500" strokeWidth="2" opacity="0.3" />
          <text x="200" y="200" fill="#fff" textAnchor="middle" fontSize="12" opacity="0.5">Pitch</text>

          {/* Anna Pavilion (Top) */}
          <path 
            d="M 120 70 Q 200 20 280 70 L 260 100 Q 200 70 140 100 Z" 
            className={`stand-path ${getCongestionClass(state.stands['Anna Pavilion'].density)}`} 
          />
          <text x="200" y="55" fill="#fff" textAnchor="middle" fontSize="10">Anna Pavilion</text>
          
          {/* J-Stand (Bottom Right) */}
          <path 
            d="M 260 300 Q 320 250 340 180 L 300 170 Q 280 230 230 270 Z" 
            className={`stand-path ${getCongestionClass(state.stands['J-Stand'].density)}`} 
          />
          <text x="310" y="240" fill="#fff" textAnchor="middle" fontSize="10">J-Stand</text>
          
          {/* C/D/E Lower (Left) */}
          <path 
            d="M 60 180 Q 80 280 160 320 L 180 280 Q 120 250 100 180 Z" 
            className={`stand-path ${getCongestionClass(state.stands['C/D/E Lower'].density)}`} 
          />
          <text x="90" y="240" fill="#fff" textAnchor="middle" fontSize="10">C/D/E Lower</text>

          {/* Points of Interest (Concessions) */}
          <circle cx="280" cy="280" r="10" className={`stand-path ${getConcessionClass(state.concessions['J-Stand Food Court'].waitTime)}`} />
          <text x="280" y="305" fill="#fff" textAnchor="middle" fontSize="8" opacity="0.7">J-Food (Wait: {state.concessions['J-Stand Food Court'].waitTime}m)</text>

          <circle cx="120" cy="120" r="10" className={`stand-path ${getConcessionClass(state.concessions['Gate 3 Express'].waitTime)}`} />
          <text x="120" y="105" fill="#fff" textAnchor="middle" fontSize="8" opacity="0.7">Gate 3 Expr (Wait: {state.concessions['Gate 3 Express'].waitTime}m)</text>

          <circle cx="280" cy="120" r="10" className={`stand-path ${getConcessionClass(state.concessions['Pavilion Lounge'].waitTime)}`} />
          <text x="280" y="105" fill="#fff" textAnchor="middle" fontSize="8" opacity="0.7">Lounge (Wait: {state.concessions['Pavilion Lounge'].waitTime}m)</text>

        </svg>
      </div>
    </div>
  );
};

export default StadiumMap;
