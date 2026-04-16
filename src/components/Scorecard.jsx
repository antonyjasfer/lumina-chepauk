import React from 'react';

const Scorecard = ({ scorecard, matchInfo, currentInnings, drs, matchResult, matchStatus, requiredRunRate }) => {
  const innings = currentInnings === 1 ? scorecard.innings1 : scorecard.innings2;
  const striker = scorecard.currentBatsmen.find(b => b.onStrike);
  const nonStriker = scorecard.currentBatsmen.find(b => !b.onStrike);
  const bowler = scorecard.currentBowler;
  const lastEvent = scorecard.lastEvent;

  const getBallClass = (ball) => {
    if (ball === 'W') return 'ball-wicket';
    if (ball === '4') return 'ball-four';
    if (ball === '6') return 'ball-six';
    if (ball === '0') return 'ball-dot';
    if (ball === 'Wd') return 'ball-wide';
    return 'ball-run';
  };

  const isExciting = lastEvent && (lastEvent.type === 'four' || lastEvent.type === 'six');
  const isWicket = lastEvent && lastEvent.type === 'wicket';
  const isDRSOverturned = lastEvent && lastEvent.type === 'drs_overturned';

  return (
    <div className={`scorecard glass-panel ${isExciting ? 'scorecard-celebration' : ''} ${isWicket ? 'scorecard-wicket' : ''}`}>

      {/* === DRS REVIEW OVERLAY === */}
      {drs && drs.active && (
        <div className={`drs-banner ${drs.phase === 'result' ? (drs.result?.includes('NOT OUT') ? 'drs-not-out' : 'drs-out') : 'drs-processing'}`} id="drs-review-panel">
          <div className="drs-header">
            <span className="drs-badge">📺 DRS REVIEW</span>
            <span className="drs-team">{drs.team} reviewing</span>
          </div>
          <div className="drs-type">{drs.reviewType}</div>
          <div className="drs-players">
            <span>🏏 {drs.batsmanName}</span>
            <span className="drs-vs">vs</span>
            <span>🎳 {drs.bowlerName}</span>
          </div>
          {drs.phase === 'processing' && (
            <div className="drs-processing-indicator">
              <div className="drs-spinner"></div>
              <span>Processing Review...</span>
            </div>
          )}
          {drs.phase === 'result' && drs.result && (
            <div className={`drs-result ${drs.result.includes('NOT OUT') ? 'drs-result-notout' : 'drs-result-out'}`}>
              {drs.result}
            </div>
          )}
        </div>
      )}

      {/* === MATCH RESULT BANNER === */}
      {matchResult && matchStatus === 'Match Complete' && (
        <div className="match-result-banner" id="match-result">
          <div className="result-trophy">🏆</div>
          <div className="result-text">{matchResult}</div>
          <div className="result-sub">Stadium emptying... fans heading to exits</div>
        </div>
      )}

      {/* Team Scores — map each team to their correct innings */}
      <div className="scorecard-header">
        {(() => {
          const team1Inn = scorecard.innings1.team === matchInfo.team1.short ? scorecard.innings1 : scorecard.innings2;
          const team2Inn = scorecard.innings1.team === matchInfo.team2.short ? scorecard.innings1 : scorecard.innings2;
          return (
            <>
              <div className="team-score" id="team1-score">
                <span className="team-badge" style={{ background: matchInfo.team1.color, color: '#051624' }}>{matchInfo.team1.short}</span>
                <span className="score-text">{team1Inn.runs}/{team1Inn.wickets}</span>
                <span className="overs-text">({team1Inn.overs}.{team1Inn.balls})</span>
              </div>
              <div className="vs-badge">VS</div>
              <div className="team-score" id="team2-score">
                <span className="team-badge" style={{ background: matchInfo.team2.color, color: '#fff' }}>{matchInfo.team2.short}</span>
                <span className="score-text">{team2Inn.runs}/{team2Inn.wickets}</span>
                <span className="overs-text">({team2Inn.overs}.{team2Inn.balls})</span>
              </div>
            </>
          );
        })()}
      </div>

      {/* Current Run Rate & Required Run Rate */}
      <div className="scorecard-rr">
        CRR: <strong>{innings.runRate}</strong>
        {currentInnings === 2 && requiredRunRate && (
          <span className="rrr-info">
            <span className="rrr-divider">|</span>
            RRR: <strong className="rrr-value">{requiredRunRate.requiredRunRate}</strong>
            <span className="rrr-divider">|</span>
            Need: <strong className="rrr-needed">{requiredRunRate.runsNeeded}</strong> from <strong>{requiredRunRate.ballsRemaining}</strong> balls
            <span className="rrr-divider">|</span>
            Target: <strong className="rrr-target">{requiredRunRate.target}</strong>
          </span>
        )}
      </div>

      {/* Reviews Remaining */}
      {drs && (
        <div className="reviews-remaining" id="reviews-remaining">
          <span className="review-team">
            <span className="team-badge-mini" style={{ background: matchInfo.team1.color, color: '#051624' }}>{matchInfo.team1.short}</span>
            Reviews: <strong>{drs.reviewsRemaining?.team1 ?? 2}</strong>/2
          </span>
          <span className="review-team">
            <span className="team-badge-mini" style={{ background: matchInfo.team2.color, color: '#fff' }}>{matchInfo.team2.short}</span>
            Reviews: <strong>{drs.reviewsRemaining?.team2 ?? 2}</strong>/2
          </span>
        </div>
      )}

      {/* Batsmen */}
      <div className="scorecard-batsmen">
        <div className={`batsman-row ${striker && striker.onStrike ? 'on-strike' : ''}`} id="batsman-striker">
          <span className="batsman-name">{striker ? `${striker.name} *` : '-'}</span>
          <span className="batsman-stats">{striker ? `${striker.runs}(${striker.balls})` : ''} {striker && striker.fours > 0 ? `4s:${striker.fours}` : ''} {striker && striker.sixes > 0 ? `6s:${striker.sixes}` : ''}</span>
        </div>
        <div className="batsman-row" id="batsman-non-striker">
          <span className="batsman-name">{nonStriker ? nonStriker.name : '-'}</span>
          <span className="batsman-stats">{nonStriker ? `${nonStriker.runs}(${nonStriker.balls})` : ''}</span>
        </div>
      </div>

      {/* Bowler */}
      <div className="scorecard-bowler" id="current-bowler">
        <span>🎳 {bowler.name}</span>
        <span>{bowler.overs}.{bowler.balls % 6}-{bowler.runs}-{bowler.wickets} (Econ: {bowler.economy})</span>
      </div>

      {/* Last 6 Balls */}
      <div className="last-six-balls" id="last-6-balls">
        {scorecard.lastSixBalls.map((ball, i) => (
          <span key={i} className={`ball-indicator ${getBallClass(ball)}`}>{ball}</span>
        ))}
        {scorecard.lastSixBalls.length === 0 && <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Match starting...</span>}
      </div>

      {/* Commentary */}
      {lastEvent && (
        <div className={`commentary ${isExciting ? 'commentary-exciting' : ''} ${isWicket ? 'commentary-wicket' : ''} ${isDRSOverturned ? 'commentary-drs' : ''}`} id="live-commentary">
          {lastEvent.description}
        </div>
      )}

      {/* Partnership */}
      <div className="partnership" id="partnership-info">
        Partnership: {scorecard.partnership.runs} ({scorecard.partnership.balls} balls)
      </div>
    </div>
  );
};

export default Scorecard;
