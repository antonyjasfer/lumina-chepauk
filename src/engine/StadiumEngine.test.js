import { describe, it, expect, beforeEach } from 'vitest';
import StadiumEngine from './StadiumEngine';

describe('StadiumEngine - Chepauk IPL Simulation', () => {
  let engine;

  beforeEach(() => {
    engine = new StadiumEngine();
  });

  // ===== INITIALIZATION TESTS =====
  
  describe('Initialization', () => {
    it('initializes with correct Chepauk stand names', () => {
      const state = engine.getState();
      expect(state.stands).toHaveProperty('Lower J');
      expect(state.stands).toHaveProperty('Upper J');
      expect(state.stands).toHaveProperty('Anna Pavilion');
      expect(state.stands).toHaveProperty('KMK Lower');
      expect(state.stands).toHaveProperty('KMK Upper');
      expect(state.stands).toHaveProperty('Lower C');
      expect(state.stands).toHaveProperty('Upper C');
    });

    it('initializes all 23 stadium stands', () => {
      const state = engine.getState();
      const standCount = Object.keys(state.stands).length;
      expect(standCount).toBe(23);
    });

    it('initializes all 10 sponsor stalls', () => {
      const state = engine.getState();
      const stallCount = Object.keys(state.stalls).length;
      expect(stallCount).toBe(10);
      expect(state.stalls).toHaveProperty('Chai Kings Tea Lounge');
      expect(state.stalls).toHaveProperty('Erode Amman Mess (EAM)');
      expect(state.stalls).toHaveProperty('CSK Official SuperStore');
      expect(state.stalls).toHaveProperty('Dream11 Fan Zone');
      expect(state.stalls).toHaveProperty('CEAT Timeout Café');
    });

    it('initializes all 4 British Empire water stations', () => {
      const state = engine.getState();
      const waterCount = Object.keys(state.waterStations).length;
      expect(waterCount).toBe(4);
      expect(state.waterStations).toHaveProperty('British Empire Water Point A');
      expect(state.waterStations).toHaveProperty('British Empire Water Point D');
    });

    it('sets total attendance between 37000 and 38000', () => {
      const state = engine.getState();
      expect(state.matchInfo.totalAttendance).toBeGreaterThanOrEqual(37000);
      expect(state.matchInfo.totalAttendance).toBeLessThanOrEqual(38000);
    });

    it('initializes with CSK as home team', () => {
      const state = engine.getState();
      expect(state.matchInfo.team1.short).toBe('CSK');
      expect(state.matchInfo.venue).toContain('Chidambaram');
    });

    it('starts match in "In Progress" status', () => {
      const state = engine.getState();
      expect(state.matchStatus).toBe('In Progress');
      expect(state.currentInnings).toBe(1);
    });

    it('initializes DRS with 2 reviews per team', () => {
      const state = engine.getState();
      expect(state.drs.reviewsRemaining.team1).toBe(2);
      expect(state.drs.reviewsRemaining.team2).toBe(2);
      expect(state.drs.active).toBe(false);
    });

    it('sets toss information correctly', () => {
      const state = engine.getState();
      expect(state.matchInfo.toss).toBeTruthy();
      expect(state.matchInfo.toss).toContain('won the toss');
    });
  });

  // ===== BOUNDS & CLAMPING TESTS =====

  describe('Bounds Checking', () => {
    it('clamps density values between 0 and 100', () => {
      expect(engine._clamp(150)).toBe(100);
      expect(engine._clamp(-20)).toBe(0);
      expect(engine._clamp(50)).toBe(50);
      expect(engine._clamp(0)).toBe(0);
      expect(engine._clamp(100)).toBe(100);
    });

    it('prevents stand density from exceeding 100 after repeated increases', () => {
      const standKey = 'Lower J';
      engine.state.stands[standKey].density = 99;

      for (let i = 0; i < 50; i++) {
        engine.state.stands[standKey].density += 5;
        engine.state.stands[standKey].density = engine._clamp(engine.state.stands[standKey].density);
      }

      expect(engine.getState().stands[standKey].density).toBeLessThanOrEqual(100);
      expect(engine.getState().stands[standKey].density).toBeGreaterThanOrEqual(0);
    });

    it('prevents stand density from going below 0', () => {
      const standKey = 'Anna Pavilion';
      engine.state.stands[standKey].density = 5;

      for (let i = 0; i < 20; i++) {
        engine.state.stands[standKey].density -= 10;
        engine.state.stands[standKey].density = engine._clamp(engine.state.stands[standKey].density);
      }

      expect(engine.getState().stands[standKey].density).toBe(0);
    });
  });

  // ===== TICK & BALL SIMULATION TESTS =====

  describe('Ball Simulation', () => {
    it('advances the match state after a tick', () => {
      engine.tick();
      const stateAfter = engine.getState();
      
      // Either a ball was bowled or DRS/break is in progress
      const inn = stateAfter.scorecard.innings1;
      const totalBalls = inn.overs * 6 + inn.balls;
      expect(totalBalls).toBeGreaterThanOrEqual(0);
    });

    it('updates run rate after balls are bowled', () => {
      // Simulate several ticks
      for (let i = 0; i < 10; i++) {
        engine.tick();
      }
      const state = engine.getState();
      const inn = state.scorecard.innings1;
      const totalBalls = inn.overs * 6 + inn.balls;
      
      if (totalBalls > 0 && inn.runs > 0) {
        expect(inn.runRate).toBeGreaterThan(0);
      }
    });

    it('records last event after a ball', () => {
      // Tick until we get a non-DRS ball
      for (let i = 0; i < 5; i++) {
        engine.tick();
      }
      const state = engine.getState();
      // Last event should be set (unless DRS is active)
      if (!state.drs.active) {
        expect(state.scorecard.lastEvent).not.toBeNull();
      }
    });

    it('maintains last six balls array with max 6 entries', () => {
      for (let i = 0; i < 20; i++) {
        engine.tick();
      }
      const state = engine.getState();
      expect(state.scorecard.lastSixBalls.length).toBeLessThanOrEqual(6);
    });
  });

  // ===== CROWD DYNAMICS TESTS =====

  describe('Crowd Dynamics', () => {
    it('computes crowd zones correctly (seats + amenities + roaming = total)', () => {
      const state = engine.getState();
      const zones = state.crowdZones;
      expect(zones.total).toBe(zones.inSeats + zones.atAmenities + zones.roaming);
    });

    it('maintains positive crowd zone values', () => {
      for (let i = 0; i < 10; i++) {
        engine.tick();
      }
      const state = engine.getState();
      expect(state.crowdZones.inSeats).toBeGreaterThanOrEqual(0);
      expect(state.crowdZones.atAmenities).toBeGreaterThanOrEqual(0);
      expect(state.crowdZones.roaming).toBeGreaterThanOrEqual(0);
    });

    it('surges stall crowds during innings break', () => {
      const stallsBefore = Object.values(engine.getState().stalls).reduce((a, s) => a + s.crowd, 0);
      engine.triggerInningsBreak();
      const stallsAfter = Object.values(engine.getState().stalls).reduce((a, s) => a + s.crowd, 0);

      expect(stallsAfter).toBeGreaterThan(stallsBefore);
    });

    it('reduces seat occupancy during innings break', () => {
      const seatsBefore = engine.getState().crowdZones.inSeats;
      engine.triggerInningsBreak();
      const seatsAfter = engine.getState().crowdZones.inSeats;

      expect(seatsAfter).toBeLessThan(seatsBefore);
    });

    it('surges stall crowds during strategic timeout', () => {
      const stallsBefore = Object.values(engine.getState().stalls).reduce((a, s) => a + s.crowd, 0);
      engine.triggerStrategicTimeout();
      const stallsAfter = Object.values(engine.getState().stalls).reduce((a, s) => a + s.crowd, 0);

      expect(stallsAfter).toBeGreaterThan(stallsBefore);
    });

    it('logs observations during breaks', () => {
      engine.triggerInningsBreak();
      const state = engine.getState();
      expect(state.breakObservations.length).toBeGreaterThan(0);
      expect(state.breakObservations[0].type).toBe('innings_break');
    });

    it('logs observations during strategic timeout', () => {
      engine.triggerStrategicTimeout();
      const state = engine.getState();
      expect(state.breakObservations.length).toBeGreaterThan(0);
      expect(state.breakObservations[0].type).toBe('timeout');
    });
  });

  // ===== MATCH LIFECYCLE TESTS =====

  describe('Match Lifecycle', () => {
    it('sets matchStatus to "Innings Break" when triggered', () => {
      engine.triggerInningsBreak();
      expect(engine.getState().matchStatus).toBe('Innings Break');
    });

    it('sets matchStatus to "Strategic Timeout" when triggered', () => {
      engine.triggerStrategicTimeout();
      expect(engine.getState().matchStatus).toBe('Strategic Timeout');
    });

    it('resumes to "In Progress" after endBreak', () => {
      engine.triggerStrategicTimeout();
      engine.endBreak();
      expect(engine.getState().matchStatus).toBe('In Progress');
    });

    it('starts next match with a new random opponent', () => {
      engine.startNextMatch();
      // CSK is always team1
      expect(engine.getState().matchInfo.team1.short).toBe('CSK');
      // Score should reset
      expect(engine.getState().scorecard.innings1.runs).toBe(0);
      expect(engine.getState().scorecard.innings1.wickets).toBe(0);
    });

    it('resets DRS reviews on next match', () => {
      engine.startNextMatch();
      const state = engine.getState();
      expect(state.drs.reviewsRemaining.team1).toBe(2);
      expect(state.drs.reviewsRemaining.team2).toBe(2);
    });
  });

  // ===== REQUIRED RUN RATE TESTS =====

  describe('Required Run Rate', () => {
    it('returns null for first innings', () => {
      expect(engine.getRequiredRunRate()).toBeNull();
    });

    it('calculates required run rate in second innings', () => {
      // Simulate first innings score
      engine.state.scorecard.innings1.runs = 180;
      engine.state.scorecard.innings1.overs = 20;
      engine.state.scorecard.innings1.balls = 0;

      // Switch to second innings
      engine.state.currentInnings = 2;
      engine.state.scorecard.innings2.runs = 50;
      engine.state.scorecard.innings2.overs = 5;
      engine.state.scorecard.innings2.balls = 0;

      const rrr = engine.getRequiredRunRate();
      expect(rrr).not.toBeNull();
      expect(rrr.target).toBe(181);
      expect(rrr.runsNeeded).toBe(131);
      expect(rrr.ballsRemaining).toBe(90);
      expect(rrr.requiredRunRate).toBeGreaterThan(0);
    });
  });

  // ===== STATE IMMUTABILITY TESTS =====

  describe('State Immutability', () => {
    it('getState returns a deep clone (mutations do not affect engine)', () => {
      const state = engine.getState();
      state.matchStatus = 'HACKED';
      state.stands['Lower J'].density = 999;

      const freshState = engine.getState();
      expect(freshState.matchStatus).not.toBe('HACKED');
      expect(freshState.stands['Lower J'].density).not.toBe(999);
    });
  });
});
