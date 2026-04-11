import { describe, it, expect, beforeEach } from 'vitest';
import StadiumEngine from './StadiumEngine';

describe('StadiumEngine - Chepauk IPL Edition', () => {
  let engine;

  beforeEach(() => {
    engine = new StadiumEngine();
  });

  it('initializes with correct Chepauk stands', () => {
    const state = engine.getState();
    expect(state.stands).toHaveProperty('J-Stand');
    expect(state.stands).toHaveProperty('Anna Pavilion');
    expect(state.stands).toHaveProperty('C/D/E Lower');
  });

  it('keeps density bounds strictly between 0 and 100', () => {
    engine.state.stands['J-Stand'].density = 99;
    
    // Force up 50 times
    for (let i = 0; i < 50; i++) {
        engine.state.stands['J-Stand'].density += 5;
        engine.state.stands['J-Stand'].density = engine._clamp(engine.state.stands['J-Stand'].density);
    }
    
    expect(engine.getState().stands['J-Stand'].density).toBeLessThanOrEqual(100);
    expect(engine.getState().stands['J-Stand'].density).toBeGreaterThanOrEqual(0);
  });

  it('spikes wait times massively during Innings Break', () => {
    const initialState = engine.getState();
    const initialWait = initialState.concessions['J-Stand Food Court'].waitTime;
    
    engine.triggerInningsBreak();
    
    const postSurgeState = engine.getState();
    const postSurgeWait = postSurgeState.concessions['J-Stand Food Court'].waitTime;
    
    expect(postSurgeWait).toBe(initialWait + 35);
    expect(postSurgeState.matchStatus).toBe('Innings Break');
    expect(postSurgeState.concessions['J-Stand Food Court'].status).toBe('High');
  });

  it('decays wait times correctly after a surge', () => {
    engine.triggerStrategicTimeout();
    let initialSurgeWait = engine.getState().concessions['J-Stand Food Court'].waitTime;
    
    // Tick forward
    engine.tick();
    engine.tick();
    engine.tick();
    
    let postDecayWait = engine.getState().concessions['J-Stand Food Court'].waitTime;
    expect(postDecayWait).toBeLessThan(initialSurgeWait);
  });
  
  it('prevents negative wait times', () => {
      engine.state.concessions['Gate 3 Express'].waitTime = 1;
      engine.surgeActive = true;
      engine.surgeDecayRate = 10; // Rapid decay
      
      engine.tick();
      expect(engine.getState().concessions['Gate 3 Express'].waitTime).toBeGreaterThanOrEqual(0);
  });
});
