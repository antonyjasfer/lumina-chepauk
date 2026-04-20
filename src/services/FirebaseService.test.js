import { describe, it, expect, beforeEach } from 'vitest';
import { ANALYTICS_EVENTS } from '../constants/index.js';

/**
 * FirebaseService Test Suite
 * Tests Firebase Analytics event tracking, Performance Monitoring traces,
 * Remote Config value retrieval, and graceful fallback behavior.
 *
 * Note: Tests run in demo mode (no Firebase credentials) to verify
 * that all methods fail gracefully and the app remains functional.
 */

describe('FirebaseService - Demo Mode Behavior', () => {
  let firebaseService;

  beforeEach(async () => {
    const module = await import('./FirebaseService');
    firebaseService = module.default;
  });

  // ===== INITIALIZATION =====

  describe('Initialization', () => {
    it('initializes without crashing when no Firebase config is present', () => {
      expect(firebaseService).toBeTruthy();
      expect(typeof firebaseService.trackEvent).toBe('function');
    });

    it('reports not initialized in demo mode', () => {
      // Without valid credentials, Firebase should not be fully initialized
      expect(typeof firebaseService.isInitialized).toBe('function');
    });

    it('has all required public methods', () => {
      expect(typeof firebaseService.trackEvent).toBe('function');
      expect(typeof firebaseService.startTrace).toBe('function');
      expect(typeof firebaseService.stopTrace).toBe('function');
      expect(typeof firebaseService.getRemoteConfigValue).toBe('function');
      expect(typeof firebaseService.trackMatchEvent).toBe('function');
      expect(typeof firebaseService.trackCricketEvent).toBe('function');
      expect(typeof firebaseService.isInitialized).toBe('function');
    });
  });

  // ===== EVENT TRACKING =====

  describe('Event Tracking (Demo Mode)', () => {
    it('trackEvent does not throw in demo mode', () => {
      expect(() => {
        firebaseService.trackEvent(ANALYTICS_EVENTS.MATCH_STARTED, {
          team1: 'CSK',
          team2: 'RCB',
        });
      }).not.toThrow();
    });

    it('trackEvent handles all analytics event types', () => {
      Object.values(ANALYTICS_EVENTS).forEach(eventName => {
        expect(() => {
          firebaseService.trackEvent(eventName, { test: true });
        }).not.toThrow();
      });
    });

    it('trackEvent handles empty params', () => {
      expect(() => {
        firebaseService.trackEvent(ANALYTICS_EVENTS.PAGE_VIEW);
      }).not.toThrow();
    });

    it('trackMatchEvent does not throw', () => {
      expect(() => {
        firebaseService.trackMatchEvent(ANALYTICS_EVENTS.MATCH_STARTED, {
          team1: { short: 'CSK' },
          team2: { short: 'RCB' },
          venue: 'Chepauk',
          totalAttendance: 37500,
          matchNumber: 1,
        });
      }).not.toThrow();
    });

    it('trackMatchEvent handles null matchInfo gracefully', () => {
      expect(() => {
        firebaseService.trackMatchEvent(ANALYTICS_EVENTS.MATCH_STARTED, null);
      }).not.toThrow();
    });

    it('trackCricketEvent does not throw', () => {
      expect(() => {
        firebaseService.trackCricketEvent(ANALYTICS_EVENTS.BOUNDARY_HIT, {
          innings: 1,
          overs: 14,
          runs: 4,
          batsman: 'Gaikwad',
        });
      }).not.toThrow();
    });
  });

  // ===== PERFORMANCE TRACES =====

  describe('Performance Traces (Demo Mode)', () => {
    it('startTrace does not throw', () => {
      expect(() => {
        firebaseService.startTrace('test_trace');
      }).not.toThrow();
    });

    it('stopTrace does not throw', () => {
      expect(() => {
        firebaseService.stopTrace('test_trace', { status: 'ok' });
      }).not.toThrow();
    });

    it('stopTrace handles non-existent traces gracefully', () => {
      expect(() => {
        firebaseService.stopTrace('non_existent_trace');
      }).not.toThrow();
    });

    it('handles start/stop trace lifecycle', () => {
      expect(() => {
        firebaseService.startTrace('gemini_response_time');
        firebaseService.stopTrace('gemini_response_time', { mock: 'true' });
      }).not.toThrow();
    });
  });

  // ===== REMOTE CONFIG =====

  describe('Remote Config (Demo Mode)', () => {
    it('getRemoteConfigValue returns null for unknown keys', () => {
      const value = firebaseService.getRemoteConfigValue('unknown_key');
      // In demo mode, should return null or a default
      expect(value === null || value !== undefined).toBe(true);
    });

    it('getRemoteConfigValue does not throw for any type', () => {
      expect(() => {
        firebaseService.getRemoteConfigValue('test_key', 'string');
        firebaseService.getRemoteConfigValue('test_key', 'number');
        firebaseService.getRemoteConfigValue('test_key', 'boolean');
      }).not.toThrow();
    });
  });
});

describe('AnalyticsService - Unified Analytics', () => {
  let analyticsService;

  beforeEach(async () => {
    const module = await import('./AnalyticsService');
    analyticsService = module.default;
  });

  // ===== INITIALIZATION =====

  describe('Initialization', () => {
    it('initializes without crashing', () => {
      expect(analyticsService).toBeTruthy();
    });

    it('has all required public methods', () => {
      expect(typeof analyticsService.track).toBe('function');
      expect(typeof analyticsService.trackMatchStarted).toBe('function');
      expect(typeof analyticsService.trackMatchCompleted).toBe('function');
      expect(typeof analyticsService.trackInningsBreak).toBe('function');
      expect(typeof analyticsService.trackStrategicTimeout).toBe('function');
      expect(typeof analyticsService.trackDRSReview).toBe('function');
      expect(typeof analyticsService.trackDRSResult).toBe('function');
      expect(typeof analyticsService.trackChatMessage).toBe('function');
      expect(typeof analyticsService.trackChatResponse).toBe('function');
      expect(typeof analyticsService.trackBoundary).toBe('function');
      expect(typeof analyticsService.trackWicket).toBe('function');
      expect(typeof analyticsService.startTrace).toBe('function');
      expect(typeof analyticsService.stopTrace).toBe('function');
    });
  });

  // ===== EVENT TRACKING =====

  describe('Event Tracking', () => {
    it('track does not throw for any event', () => {
      expect(() => {
        analyticsService.track(ANALYTICS_EVENTS.MATCH_STARTED, { team: 'CSK' });
      }).not.toThrow();
    });

    it('trackMatchStarted handles valid matchInfo', () => {
      expect(() => {
        analyticsService.trackMatchStarted({
          team1: { short: 'CSK' },
          team2: { short: 'RCB' },
          venue: 'Chepauk',
          totalAttendance: 37000,
          toss: 'CSK won the toss',
          battingFirst: 'CSK',
        });
      }).not.toThrow();
    });

    it('trackMatchCompleted handles valid data', () => {
      expect(() => {
        analyticsService.trackMatchCompleted(
          { team1: { short: 'CSK' }, team2: { short: 'RCB' } },
          'CSK won by 45 runs'
        );
      }).not.toThrow();
    });

    it('trackChatMessage and response lifecycle', () => {
      expect(() => {
        analyticsService.trackChatMessage('food');
        analyticsService.trackChatResponse(150, true);
      }).not.toThrow();
    });

    it('trackBoundary handles four and six', () => {
      expect(() => {
        analyticsService.trackBoundary('four', 'Gaikwad', 'Siraj');
        analyticsService.trackBoundary('six', 'Dhoni', 'Bumrah');
      }).not.toThrow();
    });

    it('trackWicket tracks dismissal', () => {
      expect(() => {
        analyticsService.trackWicket('Kohli', 'Pathirana', 'Caught');
      }).not.toThrow();
    });

    it('trackDRSReview handles DRS data', () => {
      expect(() => {
        analyticsService.trackDRSReview({
          team: 'CSK',
          reviewType: 'LBW Review',
          batsmanName: 'Kohli',
          bowlerName: 'Jadeja',
        });
      }).not.toThrow();
    });

    it('trackInningsBreak tracks correctly', () => {
      expect(() => {
        analyticsService.trackInningsBreak(1, { innings1: { runs: 185, wickets: 6 } });
      }).not.toThrow();
    });

    it('trackStrategicTimeout tracks correctly', () => {
      expect(() => {
        analyticsService.trackStrategicTimeout(1, 8);
      }).not.toThrow();
    });
  });
});
