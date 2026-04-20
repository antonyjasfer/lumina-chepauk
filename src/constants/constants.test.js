import { describe, it, expect } from 'vitest';
import * as constants from './index';

/**
 * Constants Test Suite
 * Verifies all exported constants have correct values and types.
 * Ensures no accidental modifications to critical game rules.
 */
describe('Match Rules', () => {
  it('MAX_OVERS is 20 (T20 format)', () => {
    expect(constants.MAX_OVERS).toBe(20);
  });

  it('TOTAL_WICKETS is 10', () => {
    expect(constants.TOTAL_WICKETS).toBe(10);
  });

  it('BALLS_PER_OVER is 6', () => {
    expect(constants.BALLS_PER_OVER).toBe(6);
  });

  it('DRS_REVIEWS_PER_TEAM is 2', () => {
    expect(constants.DRS_REVIEWS_PER_TEAM).toBe(2);
  });
});

describe('Timer Durations', () => {
  it('STRATEGIC_TIMEOUT_DURATION is 150 seconds (2:30)', () => {
    expect(constants.STRATEGIC_TIMEOUT_DURATION).toBe(150);
  });

  it('INNINGS_BREAK_DURATION is 900 seconds (15 min)', () => {
    expect(constants.INNINGS_BREAK_DURATION).toBe(900);
  });

  it('SIMULATION_TICK_INTERVAL is 2000ms', () => {
    expect(constants.SIMULATION_TICK_INTERVAL).toBe(2000);
  });

  it('Timeout overs are at 8th and 14th', () => {
    expect(constants.TIMEOUT_OVER_1).toBe(8);
    expect(constants.TIMEOUT_OVER_2).toBe(14);
  });
});

describe('AI Concierge Constants', () => {
  it('MIN_REQUEST_INTERVAL is 2000ms', () => {
    expect(constants.MIN_REQUEST_INTERVAL).toBe(2000);
  });

  it('MAX_INPUT_LENGTH is 500 characters', () => {
    expect(constants.MAX_INPUT_LENGTH).toBe(500);
  });

  it('GEMINI_MODEL is gemini-2.0-flash', () => {
    expect(constants.GEMINI_MODEL).toBe('gemini-2.0-flash');
  });
});

describe('Stadium Configuration', () => {
  it('attendance range is 37000-38000', () => {
    expect(constants.MIN_ATTENDANCE).toBe(37000);
    expect(constants.MAX_ATTENDANCE).toBe(38000);
    expect(constants.MAX_ATTENDANCE).toBeGreaterThan(constants.MIN_ATTENDANCE);
  });

  it('has correct facility counts', () => {
    expect(constants.TOTAL_STANDS).toBe(23);
    expect(constants.TOTAL_STALLS).toBe(10);
    expect(constants.TOTAL_WATER_STATIONS).toBe(4);
  });
});

describe('Ball Probabilities', () => {
  it('probabilities are cumulative and ordered', () => {
    const p = constants.BALL_PROBABILITIES;
    expect(p.DOT).toBeLessThan(p.SINGLE);
    expect(p.SINGLE).toBeLessThan(p.DOUBLE);
    expect(p.DOUBLE).toBeLessThan(p.TRIPLE);
    expect(p.TRIPLE).toBeLessThan(p.FOUR);
    expect(p.FOUR).toBeLessThan(p.SIX);
    expect(p.SIX).toBeLessThan(p.WICKET);
    expect(p.WICKET).toBeLessThan(1.0);
  });
});

describe('Match Statuses', () => {
  it('all status constants are defined strings', () => {
    expect(typeof constants.STATUS_IN_PROGRESS).toBe('string');
    expect(typeof constants.STATUS_STRATEGIC_TIMEOUT).toBe('string');
    expect(typeof constants.STATUS_INNINGS_BREAK).toBe('string');
    expect(typeof constants.STATUS_MATCH_COMPLETE).toBe('string');
    expect(typeof constants.STATUS_READY_NEXT).toBe('string');
  });

  it('status values are non-empty', () => {
    expect(constants.STATUS_IN_PROGRESS.length).toBeGreaterThan(0);
    expect(constants.STATUS_STRATEGIC_TIMEOUT.length).toBeGreaterThan(0);
    expect(constants.STATUS_INNINGS_BREAK.length).toBeGreaterThan(0);
    expect(constants.STATUS_MATCH_COMPLETE.length).toBeGreaterThan(0);
    expect(constants.STATUS_READY_NEXT.length).toBeGreaterThan(0);
  });
});

describe('Analytics Events', () => {
  it('all event names are defined', () => {
    const events = constants.ANALYTICS_EVENTS;
    expect(Object.keys(events).length).toBeGreaterThanOrEqual(10);
  });

  it('event names follow snake_case convention', () => {
    Object.values(constants.ANALYTICS_EVENTS).forEach(name => {
      expect(name).toMatch(/^[a-z_]+$/);
    });
  });
});

describe('Google Maps Config', () => {
  it('has all required config keys', () => {
    const config = constants.GOOGLE_MAPS_CONFIG;
    expect(config.EMBED_URL).toBeDefined();
    expect(config.DIRECTIONS_URL).toBeDefined();
    expect(config.STADIUM_NAME).toBeDefined();
    expect(config.ADDRESS).toBeDefined();
  });

  it('URLs are valid strings', () => {
    expect(constants.GOOGLE_MAPS_CONFIG.EMBED_URL).toContain('google.com/maps');
    expect(constants.GOOGLE_MAPS_CONFIG.DIRECTIONS_URL).toContain('maps.google.com');
  });
});
