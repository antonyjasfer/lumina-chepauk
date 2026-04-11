import React, { useState, useEffect, useRef } from 'react';
import StadiumEngine from './engine/StadiumEngine';
import StadiumMap from './components/StadiumMap';
import AiConcierge from './components/AiConcierge';

const App = () => {
  const [engine] = useState(() => new StadiumEngine());
  const [stadiumState, setStadiumState] = useState(engine.getState());

  useEffect(() => {
    const timer = setInterval(() => {
      setStadiumState(engine.tick());
    }, 3000); // Tick every 3 seconds for demo purposes
    return () => clearInterval(timer);
  }, [engine]);

  const handleInningsBreak = () => {
    engine.triggerInningsBreak();
    setStadiumState(engine.getState());
  };

  const handleStrategicTimeout = () => {
    engine.triggerStrategicTimeout();
    setStadiumState(engine.getState());
  };

  return (
    <div className="app-container">
      <header className="header">
        <div>
          <h1 className="header-title glow-text">Lumina</h1>
          <p className="header-subtitle">Chepauk Orchestrator | Match Status: <strong style={{color: 'var(--chepauk-yellow)'}}>{stadiumState.matchStatus}</strong></p>
        </div>
        
        <div className="controls" aria-label="Simulation Controls">
          <button className="control-btn" onClick={handleStrategicTimeout}>Trigger Strategic Timeout</button>
          <button className="control-btn active" style={{borderColor: 'var(--status-critical)', color: 'var(--status-critical)'}} onClick={handleInningsBreak}>Trigger Innings Break</button>
        </div>
      </header>
      
      <main className="main-content">
        <StadiumMap state={stadiumState} />
        <AiConcierge stadiumState={stadiumState} />
      </main>
    </div>
  );
};

export default App;
