import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import StadiumEngine from './engine/StadiumEngine';
import StadiumMap from './components/StadiumMap';
import Scorecard from './components/Scorecard';
import AiConcierge from './components/AiConcierge';
import GoogleMapsEmbed from './components/GoogleMapsEmbed';
import ErrorBoundary from './components/ErrorBoundary';
import analyticsService from './services/AnalyticsService';
import {
  STRATEGIC_TIMEOUT_DURATION,
  INNINGS_BREAK_DURATION,
  SIMULATION_TICK_INTERVAL,
  TIMEOUT_OVER_1,
  TIMEOUT_OVER_2,
  STATUS_IN_PROGRESS,
  STATUS_STRATEGIC_TIMEOUT,
  STATUS_INNINGS_BREAK,
  STATUS_MATCH_COMPLETE,
  STATUS_READY_NEXT,
} from './constants/index.js';
import { formatTime } from './utils/formatters';

/**
 * App — Root component for the Lumina Chepauk IPL Simulation.
 * Manages the simulation loop, event triggers, and layout orchestration.
 *
 * @component
 * @returns {React.ReactElement} The root application element
 */
const App = () => {
  const [engine] = useState(() => new StadiumEngine());
  const [stadiumState, setStadiumState] = useState(engine.getState());
  const [timeoutTimer, setTimeoutTimer] = useState(0);
  const [inningsTimer, setInningsTimer] = useState(0);

  // Track automated timeouts
  const automatedTriggers = useRef({
    inn1_to1: false,
    inn1_to2: false,
    inn2_to1: false,
    inn2_to2: false,
    inningsBreak: false
  });

  // Track match start for analytics
  const matchTrackedRef = useRef(false);

  // Track initial match start
  useEffect(() => {
    if (!matchTrackedRef.current && stadiumState.matchInfo) {
      analyticsService.trackMatchStarted(stadiumState.matchInfo);
      matchTrackedRef.current = true;
    }
  }, [stadiumState.matchInfo]);

  // Simulation tick — every 2 seconds a new ball is bowled
  useEffect(() => {
    const timer = setInterval(() => {
      analyticsService.startTrace('engine_tick_duration');
      const newState = engine.tick();
      analyticsService.stopTrace('engine_tick_duration');
      setStadiumState(newState);
    }, SIMULATION_TICK_INTERVAL);
    return () => clearInterval(timer);
  }, [engine]);

  // Strategic Timeout countdown (2:30 = 150s)
  useEffect(() => {
    let interval;
    if (timeoutTimer > 0) {
      interval = setInterval(() => {
        setTimeoutTimer(prev => prev - 1);
      }, 1000);
    } else if (timeoutTimer === 0 && stadiumState.matchStatus === STATUS_STRATEGIC_TIMEOUT) {
      queueMicrotask(() => {
        engine.endBreak();
        setStadiumState(engine.getState());
      });
    }
    return () => clearInterval(interval);
  }, [timeoutTimer, stadiumState.matchStatus, engine]);

  // Innings Break countdown (15 min = 900s)
  useEffect(() => {
    let interval;
    if (inningsTimer > 0) {
      interval = setInterval(() => {
        setInningsTimer(prev => prev - 1);
      }, 1000);
    } else if (inningsTimer === 0 && stadiumState.matchStatus === STATUS_INNINGS_BREAK) {
      queueMicrotask(() => {
        engine.endBreak();
        setStadiumState(engine.getState());
      });
    }
    return () => clearInterval(interval);
  }, [inningsTimer, stadiumState.matchStatus, engine]);

  // Track match completion
  useEffect(() => {
    if (stadiumState.matchStatus === STATUS_MATCH_COMPLETE && stadiumState.matchResult) {
      analyticsService.trackMatchCompleted(stadiumState.matchInfo, stadiumState.matchResult);
    }
  }, [stadiumState.matchStatus, stadiumState.matchResult, stadiumState.matchInfo]);

  const handleInningsBreak = useCallback(() => {
    engine.triggerInningsBreak();
    setStadiumState(engine.getState());
    setInningsTimer(INNINGS_BREAK_DURATION);
    analyticsService.trackInningsBreak(stadiumState.currentInnings, stadiumState.scorecard);
  }, [engine, stadiumState.currentInnings, stadiumState.scorecard]);

  const handleStrategicTimeout = useCallback(() => {
    engine.triggerStrategicTimeout();
    setStadiumState(engine.getState());
    setTimeoutTimer(STRATEGIC_TIMEOUT_DURATION);
    const innings = stadiumState.currentInnings === 1 ? stadiumState.scorecard.innings1 : stadiumState.scorecard.innings2;
    analyticsService.trackStrategicTimeout(stadiumState.currentInnings, innings?.overs || 0);
  }, [engine, stadiumState.currentInnings, stadiumState.scorecard]);

  // Automated Timeouts Logic (8th over and 14th over) + Innings Break
  useEffect(() => {
    if (stadiumState.matchStatus !== STATUS_IN_PROGRESS) return;

    const currentInningsNum = stadiumState.currentInnings;
    const innings = currentInningsNum === 1 ? stadiumState.scorecard.innings1 : stadiumState.scorecard.innings2;

    if (currentInningsNum === 1) {
      if (innings.overs === TIMEOUT_OVER_1 && innings.balls === 0 && !automatedTriggers.current.inn1_to1) {
        automatedTriggers.current.inn1_to1 = true;
        queueMicrotask(() => handleStrategicTimeout());
      } else if (innings.overs === TIMEOUT_OVER_2 && innings.balls === 0 && !automatedTriggers.current.inn1_to2) {
        automatedTriggers.current.inn1_to2 = true;
        queueMicrotask(() => handleStrategicTimeout());
      } else if ((innings.wickets >= 10 || (innings.overs >= 20 && innings.balls === 0)) && !automatedTriggers.current.inningsBreak) {
        automatedTriggers.current.inningsBreak = true;
        queueMicrotask(() => handleInningsBreak());
      }
    } else if (currentInningsNum === 2) {
      if (innings.overs === TIMEOUT_OVER_1 && innings.balls === 0 && !automatedTriggers.current.inn2_to1) {
        automatedTriggers.current.inn2_to1 = true;
        queueMicrotask(() => handleStrategicTimeout());
      } else if (innings.overs === TIMEOUT_OVER_2 && innings.balls === 0 && !automatedTriggers.current.inn2_to2) {
        automatedTriggers.current.inn2_to2 = true;
        queueMicrotask(() => handleStrategicTimeout());
      }
    }
  }, [stadiumState, handleInningsBreak, handleStrategicTimeout]);

  // Memoize derived values
  const zones = useMemo(() => stadiumState.crowdZones || { inSeats: 0, atAmenities: 0, roaming: 0, total: 0 }, [stadiumState.crowdZones]);
  const matchInfo = stadiumState.matchInfo;
  const isTimeout = stadiumState.matchStatus === STATUS_STRATEGIC_TIMEOUT;
  const isInningsBreak = stadiumState.matchStatus === STATUS_INNINGS_BREAK;
  const isMatchComplete = stadiumState.matchStatus === STATUS_MATCH_COMPLETE;
  const lastEvent = stadiumState.scorecard.lastEvent;
  const isBoundary = lastEvent && (lastEvent.type === 'four' || lastEvent.type === 'six');
  const isDRS = stadiumState.drs && stadiumState.drs.active;

  // Required run rate
  const requiredRunRate = useMemo(() => {
    return stadiumState.currentInnings === 2 ? engine.getRequiredRunRate() : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stadiumState.currentInnings, stadiumState.scorecard, engine]);

  // Break observations
  const observations = stadiumState.breakObservations || [];

  return (
    <ErrorBoundary>
      <div className="app-container" role="application" aria-label="Lumina Stadium Concierge">
        {/* === MATCH INFO BANNER === */}
        <div className={`match-banner glass-panel ${isBoundary ? 'match-banner-flash' : ''} ${isDRS ? 'match-banner-drs' : ''}`} id="match-info-banner" role="banner">
          <div className="match-banner-teams">
            <div className="team-block">
              <span className="team-logo" style={{ background: matchInfo.team1.color, color: '#051624' }}>{matchInfo.team1.short}</span>
              <span className="team-full-name">{matchInfo.team1.name}</span>
            </div>
            <div className="match-center-info">
              <div className="match-vs">VS</div>
              <div className="match-venue">{matchInfo.venue}</div>
              <div className="match-date">{matchInfo.date}</div>
            </div>
            <div className="team-block">
              <span className="team-logo" style={{ background: matchInfo.team2.color, color: '#fff' }}>{matchInfo.team2.short}</span>
              <span className="team-full-name">{matchInfo.team2.name}</span>
            </div>
          </div>
          <div className="match-meta-row">
            <span className="toss-info">🪙 {matchInfo.toss}</span>
            <span className="attendance-badge" id="total-attendance" aria-label={`Total attendance ${zones.total.toLocaleString()}`}>
              🎟️ Attendance: <strong>{zones.total.toLocaleString()}</strong>
              {' | '}🪑 <strong>{zones.inSeats.toLocaleString()}</strong>
              {' | '}🏬 <strong>{zones.atAmenities.toLocaleString()}</strong>
              {' | '}🚶 <strong>{zones.roaming.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        {/* === HEADER WITH CONTROLS & TIMERS === */}
        <header className="header" role="heading" aria-level="1">
          <div>
            <h1 className="header-title glow-text">
              Lumina
              {timeoutTimer > 0 && (
                <span className="timer-display timer-pulse" aria-live="assertive" role="timer">⏱ {formatTime(timeoutTimer)}</span>
              )}
              {inningsTimer > 0 && (
                <span className="timer-display timer-innings" aria-live="assertive" role="timer">🕐 {formatTime(inningsTimer)}</span>
              )}
              {isDRS && (
                <span className="timer-display timer-drs" aria-live="assertive">📺 DRS REVIEW</span>
              )}
            </h1>
            <p className="header-subtitle">
              Chepauk Orchestrator | Status: <strong style={{ color: isDRS ? '#a855f7' : isTimeout ? 'var(--status-critical)' : isInningsBreak ? '#f59e0b' : isMatchComplete ? '#38bdf8' : 'var(--status-clear)' }}>
                {isDRS ? 'DRS Review in Progress' : stadiumState.matchStatus}
              </strong>
              {matchInfo.matchNumber && <span style={{ marginLeft: '12px', opacity: 0.6 }}>Match #{matchInfo.matchNumber}</span>}
            </p>
          </div>

          <nav className="controls" aria-label="Simulation Controls" role="toolbar">
            <button className="control-btn timeout-btn" onClick={handleStrategicTimeout} disabled={isTimeout || isInningsBreak || isMatchComplete || isDRS} aria-label="Trigger Strategic Timeout">
              ⏸ Strategic Timeout
            </button>
            <button className="control-btn innings-btn" onClick={handleInningsBreak} disabled={isTimeout || isInningsBreak || isMatchComplete || isDRS} aria-label="Trigger Innings Break">
              🔄 Innings Break
            </button>
          </nav>
        </header>

        {/* === BREAK OBSERVATIONS LOG === */}
        {observations.length > 0 && (
          <div className="observations-bar glass-panel" id="break-observations" role="log" aria-label="Crowd Observations Log">
            <span className="obs-title">📋 Crowd Observations:</span>
            <div className="obs-scroll">
              {observations.map((obs, i) => (
                <span key={i} className={`obs-item ${obs.type === 'innings_break' ? 'obs-innings' : 'obs-timeout'}`}>
                  {obs.message}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* === MAIN CONTENT === */}
        <main className="main-content" id="main-content" style={{ position: 'relative' }} role="main">
          <div className="left-column">
            <StadiumMap state={stadiumState} />
          </div>
          <div className="right-column">
            <Scorecard
              scorecard={stadiumState.scorecard}
              matchInfo={stadiumState.matchInfo}
              currentInnings={stadiumState.currentInnings}
              drs={stadiumState.drs}
              matchResult={stadiumState.matchResult}
              matchStatus={stadiumState.matchStatus}
              requiredRunRate={requiredRunRate}
            />
            <AiConcierge stadiumState={stadiumState} />
            <GoogleMapsEmbed />
          </div>

          {/* OVERLAY: NEXT MATCH */}
          {stadiumState.matchStatus === STATUS_READY_NEXT && (
            <div className="next-match-overlay" role="dialog" aria-label="Start Next Match">
              <div className="next-match-card glass-panel">
                <div className="next-match-trophy">🏟️</div>
                <h2 className="next-match-title">Stadium is Empty!</h2>
                {stadiumState.matchResult && (
                  <p className="next-match-result">
                    🏆 {stadiumState.matchResult}
                  </p>
                )}
                <p className="next-match-desc">The match is over and the crowd has fully departed. All {matchInfo.totalAttendance.toLocaleString()} fans have exited.</p>
                <p className="next-match-question">Do you want to start the next match?</p>
                <p className="next-match-home">CSK will play at home — next opponent will be randomly selected</p>
                <button
                  className="next-match-btn"
                  aria-label="Start the next IPL match"
                  onClick={() => {
                    engine.startNextMatch();
                    setStadiumState(engine.getState());
                    setTimeoutTimer(0);
                    setInningsTimer(0);
                    automatedTriggers.current = {
                      inn1_to1: false, inn1_to2: false, inn2_to1: false, inn2_to2: false, inningsBreak: false
                    };
                    analyticsService.trackMatchStarted(engine.getState().matchInfo);
                  }}
                >
                  ✨ START NEXT MATCH
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
