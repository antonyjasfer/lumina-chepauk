import React from 'react';
import PropTypes from 'prop-types';

/**
 * Scorecard — Live cricket scorecard component.
 * Displays team scores, batsmen stats, bowler stats, DRS reviews,
 * last 6 balls, live commentary, and partnership info.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.scorecard - Scorecard data including innings, batsmen, bowler
 * @param {Object} props.matchInfo - Match information (teams, venue)
 * @param {number} props.currentInnings - Current innings number (1 or 2)
 * @param {Object} props.drs - DRS review state
 * @param {string|null} props.matchResult - Match result string
 * @param {string} props.matchStatus - Current match status
 * @param {Object|null} props.requiredRunRate - Required run rate data for 2nd innings
 * @accessibility Uses aria-live regions for dynamic score updates.
 */
const Scorecard = React.memo(({ scorecard, matchInfo, currentInnings, drs, matchResult, matchStatus, requiredRunRate }) => {
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
    <section className={`scorecard glass-panel ${isExciting ? 'scorecard-celebration' : ''} ${isWicket ? 'scorecard-wicket' : ''}`} aria-label="Live Cricket Scorecard" id="live-scorecard">

      {/* === DRS REVIEW OVERLAY === */}
      {drs && drs.active && (
        <div className={`drs-banner ${drs.phase === 'result' ? (drs.result?.includes('NOT OUT') ? 'drs-not-out' : 'drs-out') : 'drs-processing'}`} id="drs-review-panel" role="alert" aria-live="assertive">
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
            <div className="drs-processing-indicator" aria-label="DRS review being processed">
              <div className="drs-spinner"></div>
              <span>Processing Review...</span>
            </div>
          )}
          {drs.phase === 'result' && drs.result && (
            <div className={`drs-result ${drs.result.includes('NOT OUT') ? 'drs-result-notout' : 'drs-result-out'}`} aria-live="assertive">
              {drs.result}
            </div>
          )}
        </div>
      )}

      {/* === MATCH RESULT BANNER === */}
      {matchResult && matchStatus === 'Match Complete' && (
        <div className="match-result-banner" id="match-result" role="alert" aria-live="assertive">
          <div className="result-trophy">🏆</div>
          <div className="result-text">{matchResult}</div>
          <div className="result-sub">Stadium emptying... fans heading to exits</div>
        </div>
      )}

      {/* Team Scores — map each team to their correct innings */}
      <div className="scorecard-header" aria-live="polite" aria-atomic="true">
        {(() => {
          const team1Inn = scorecard.innings1.team === matchInfo.team1.short ? scorecard.innings1 : scorecard.innings2;
          const team2Inn = scorecard.innings1.team === matchInfo.team2.short ? scorecard.innings1 : scorecard.innings2;
          return (
            <>
              <div className="team-score" id="team1-score" aria-label={`${matchInfo.team1.short} score: ${team1Inn.runs} for ${team1Inn.wickets}`}>
                <span className="team-badge" style={{ background: matchInfo.team1.color, color: '#051624' }}>{matchInfo.team1.short}</span>
                <span className="score-text">{team1Inn.runs}/{team1Inn.wickets}</span>
                <span className="overs-text">({team1Inn.overs}.{team1Inn.balls})</span>
              </div>
              <div className="vs-badge" aria-hidden="true">VS</div>
              <div className="team-score" id="team2-score" aria-label={`${matchInfo.team2.short} score: ${team2Inn.runs} for ${team2Inn.wickets}`}>
                <span className="team-badge" style={{ background: matchInfo.team2.color, color: '#fff' }}>{matchInfo.team2.short}</span>
                <span className="score-text">{team2Inn.runs}/{team2Inn.wickets}</span>
                <span className="overs-text">({team2Inn.overs}.{team2Inn.balls})</span>
              </div>
            </>
          );
        })()}
      </div>

      {/* Current Run Rate & Required Run Rate */}
      <div className="scorecard-rr" aria-live="polite" id="run-rate-display">
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
        <div className="reviews-remaining" id="reviews-remaining" aria-label="DRS Reviews Remaining">
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
      <div className="scorecard-batsmen" aria-label="Current Batsmen">
        <div className={`batsman-row ${striker && striker.onStrike ? 'on-strike' : ''}`} id="batsman-striker" aria-label={`On strike: ${striker ? striker.name : 'none'}`}>
          <span className="batsman-name">{striker ? `${striker.name} *` : '-'}</span>
          <span className="batsman-stats">{striker ? `${striker.runs}(${striker.balls})` : ''} {striker && striker.fours > 0 ? `4s:${striker.fours}` : ''} {striker && striker.sixes > 0 ? `6s:${striker.sixes}` : ''}</span>
        </div>
        <div className="batsman-row" id="batsman-non-striker" aria-label={`Non-striker: ${nonStriker ? nonStriker.name : 'none'}`}>
          <span className="batsman-name">{nonStriker ? nonStriker.name : '-'}</span>
          <span className="batsman-stats">{nonStriker ? `${nonStriker.runs}(${nonStriker.balls})` : ''}</span>
        </div>
      </div>

      {/* Bowler */}
      <div className="scorecard-bowler" id="current-bowler" aria-label={`Current bowler: ${bowler.name}`}>
        <span>🎳 {bowler.name}</span>
        <span>{bowler.overs}.{bowler.balls % 6}-{bowler.runs}-{bowler.wickets} (Econ: {bowler.economy})</span>
      </div>

      {/* Last 6 Balls */}
      <div className="last-six-balls" id="last-6-balls" aria-label="Last 6 balls" role="list">
        {scorecard.lastSixBalls.map((ball, i) => (
          <span key={i} className={`ball-indicator ${getBallClass(ball)}`} role="listitem" aria-label={`Ball: ${ball}`}>{ball}</span>
        ))}
        {scorecard.lastSixBalls.length === 0 && <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Match starting...</span>}
      </div>

      {/* Commentary */}
      {lastEvent && (
        <div className={`commentary ${isExciting ? 'commentary-exciting' : ''} ${isWicket ? 'commentary-wicket' : ''} ${isDRSOverturned ? 'commentary-drs' : ''}`} id="live-commentary" role="status" aria-live="polite">
          {lastEvent.description}
        </div>
      )}

      {/* Partnership */}
      <div className="partnership" id="partnership-info" aria-label={`Partnership: ${scorecard.partnership.runs} runs from ${scorecard.partnership.balls} balls`}>
        Partnership: {scorecard.partnership.runs} ({scorecard.partnership.balls} balls)
      </div>
    </section>
  );
});

Scorecard.displayName = 'Scorecard';

/**
 * @typedef {Object} InningsData
 * @property {string} team - Team short name
 * @property {number} runs - Total runs scored
 * @property {number} wickets - Total wickets lost
 * @property {number} overs - Completed overs
 * @property {number} balls - Balls in current over
 * @property {number} extras - Total extras
 * @property {number} runRate - Current run rate
 */

/**
 * @typedef {Object} BatsmanData
 * @property {string} name - Batsman name
 * @property {number} runs - Runs scored
 * @property {number} balls - Balls faced
 * @property {number} fours - Number of fours
 * @property {number} sixes - Number of sixes
 * @property {boolean} onStrike - Whether currently on strike
 */

Scorecard.propTypes = {
  /** Full scorecard data including both innings, batsmen, bowler, etc. */
  scorecard: PropTypes.shape({
    innings1: PropTypes.shape({
      team: PropTypes.string.isRequired,
      runs: PropTypes.number.isRequired,
      wickets: PropTypes.number.isRequired,
      overs: PropTypes.number.isRequired,
      balls: PropTypes.number.isRequired,
      extras: PropTypes.number,
      runRate: PropTypes.number.isRequired,
    }).isRequired,
    innings2: PropTypes.shape({
      team: PropTypes.string.isRequired,
      runs: PropTypes.number.isRequired,
      wickets: PropTypes.number.isRequired,
      overs: PropTypes.number.isRequired,
      balls: PropTypes.number.isRequired,
      extras: PropTypes.number,
      runRate: PropTypes.number.isRequired,
    }).isRequired,
    currentBatsmen: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      runs: PropTypes.number.isRequired,
      balls: PropTypes.number.isRequired,
      fours: PropTypes.number.isRequired,
      sixes: PropTypes.number.isRequired,
      onStrike: PropTypes.bool.isRequired,
    })).isRequired,
    currentBowler: PropTypes.shape({
      name: PropTypes.string.isRequired,
      overs: PropTypes.number.isRequired,
      balls: PropTypes.number.isRequired,
      runs: PropTypes.number.isRequired,
      wickets: PropTypes.number.isRequired,
      economy: PropTypes.number.isRequired,
    }).isRequired,
    lastSixBalls: PropTypes.arrayOf(PropTypes.string).isRequired,
    lastEvent: PropTypes.shape({
      type: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
    partnership: PropTypes.shape({
      runs: PropTypes.number.isRequired,
      balls: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  /** Match information including both team details */
  matchInfo: PropTypes.shape({
    team1: PropTypes.shape({
      name: PropTypes.string.isRequired,
      short: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }).isRequired,
    team2: PropTypes.shape({
      name: PropTypes.string.isRequired,
      short: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  /** Current innings number (1 or 2) */
  currentInnings: PropTypes.number.isRequired,
  /** DRS (Decision Review System) state */
  drs: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    reviewsRemaining: PropTypes.shape({
      team1: PropTypes.number,
      team2: PropTypes.number,
    }),
  }),
  /** Match result string (null if match in progress) */
  matchResult: PropTypes.string,
  /** Current match status string */
  matchStatus: PropTypes.string.isRequired,
  /** Required run rate data for second innings chase */
  requiredRunRate: PropTypes.shape({
    target: PropTypes.number.isRequired,
    runsNeeded: PropTypes.number.isRequired,
    ballsRemaining: PropTypes.number.isRequired,
    requiredRunRate: PropTypes.number.isRequired,
  }),
};

Scorecard.defaultProps = {
  matchResult: null,
  requiredRunRate: null,
  drs: null,
};

export default Scorecard;
