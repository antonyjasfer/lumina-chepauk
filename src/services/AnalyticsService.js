/**
 * @module AnalyticsService
 * @description Unified analytics layer combining Google Analytics 4 (gtag.js)
 * and Firebase Analytics into a single API. All analytics events flow through
 * this service, which dispatches to both GA4 and Firebase simultaneously.
 *
 * This design ensures:
 * - Single point of analytics integration for the entire app
 * - Consistent event naming via ANALYTICS_EVENTS constants
 * - Graceful degradation when either service is unavailable
 * - Performance monitoring via Firebase Performance traces
 *
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs
 * @see https://firebase.google.com/docs/analytics
 */
import firebaseService from './FirebaseService.js';
import { ANALYTICS_EVENTS } from '../constants/index.js';

/**
 * @typedef {Object} AnalyticsEventParams
 * @property {string} [category] - Event category for GA4
 * @property {string} [label] - Event label for GA4
 * @property {number} [value] - Numeric value associated with the event
 */

class AnalyticsService {
  /**
   * Creates a new AnalyticsService instance.
   * Binds to the global gtag function if available (loaded in index.html).
   */
  constructor() {
    /** @type {boolean} Whether GA4 gtag is available */
    this._gtagAvailable = typeof window !== 'undefined' && typeof window.gtag === 'function';

    if (this._gtagAvailable) {
      console.info('[AnalyticsService] GA4 gtag detected — dual analytics enabled.');
    } else {
      console.info('[AnalyticsService] GA4 gtag not found — using Firebase Analytics only.');
    }
  }

  /**
   * Send an event to both GA4 and Firebase Analytics.
   *
   * @param {string} eventName - Standardized event name from ANALYTICS_EVENTS
   * @param {AnalyticsEventParams} [params={}] - Event parameters
   * @returns {void}
   *
   * @example
   * analyticsService.track(ANALYTICS_EVENTS.MATCH_STARTED, {
   *   team1: 'CSK', team2: 'RCB', attendance: 37500
   * });
   */
  track(eventName, params = {}) {
    // GA4 (gtag.js)
    if (this._gtagAvailable) {
      try {
        window.gtag('event', eventName, params);
      } catch (error) {
        console.warn('[AnalyticsService] GA4 event failed:', error.message);
      }
    }

    // Firebase Analytics
    firebaseService.trackEvent(eventName, params);
  }

  /**
   * Track a match started event with full context.
   *
   * @param {Object} matchInfo - Match information from StadiumEngine
   * @returns {void}
   */
  trackMatchStarted(matchInfo) {
    this.track(ANALYTICS_EVENTS.MATCH_STARTED, {
      team1: matchInfo?.team1?.short,
      team2: matchInfo?.team2?.short,
      venue: matchInfo?.venue,
      attendance: matchInfo?.totalAttendance,
      toss: matchInfo?.toss,
      batting_first: matchInfo?.battingFirst,
    });
    firebaseService.startTrace('match_duration');
  }

  /**
   * Track a match completed event with results.
   *
   * @param {Object} matchInfo - Match information
   * @param {string} matchResult - Result string
   * @returns {void}
   */
  trackMatchCompleted(matchInfo, matchResult) {
    this.track(ANALYTICS_EVENTS.MATCH_COMPLETED, {
      team1: matchInfo?.team1?.short,
      team2: matchInfo?.team2?.short,
      result: matchResult,
    });
    firebaseService.stopTrace('match_duration', { result: matchResult || 'unknown' });
  }

  /**
   * Track an innings break event.
   *
   * @param {number} currentInnings - Current innings number
   * @param {Object} scorecard - Current scorecard state
   * @returns {void}
   */
  trackInningsBreak(currentInnings, scorecard) {
    this.track(ANALYTICS_EVENTS.INNINGS_BREAK, {
      innings: currentInnings,
      runs: scorecard?.innings1?.runs || 0,
      wickets: scorecard?.innings1?.wickets || 0,
    });
  }

  /**
   * Track a strategic timeout event.
   *
   * @param {number} currentInnings - Current innings number
   * @param {number} currentOver - Over at which timeout was triggered
   * @returns {void}
   */
  trackStrategicTimeout(currentInnings, currentOver) {
    this.track(ANALYTICS_EVENTS.STRATEGIC_TIMEOUT, {
      innings: currentInnings,
      over: currentOver,
    });
  }

  /**
   * Track a DRS review event.
   *
   * @param {Object} drsInfo - DRS review information
   * @returns {void}
   */
  trackDRSReview(drsInfo) {
    this.track(ANALYTICS_EVENTS.DRS_REVIEW, {
      team: drsInfo?.team,
      review_type: drsInfo?.reviewType,
      batsman: drsInfo?.batsmanName,
      bowler: drsInfo?.bowlerName,
    });
  }

  /**
   * Track a DRS result.
   *
   * @param {string} result - DRS result string
   * @param {boolean} reviewLost - Whether the review was lost
   * @returns {void}
   */
  trackDRSResult(result, reviewLost) {
    this.track(ANALYTICS_EVENTS.DRS_RESULT, {
      result,
      review_lost: reviewLost,
    });
  }

  /**
   * Track a chat message sent to the AI Concierge.
   *
   * @param {string} messageType - Type of query (food, water, score, etc.)
   * @returns {void}
   */
  trackChatMessage(messageType) {
    this.track(ANALYTICS_EVENTS.CHAT_MESSAGE_SENT, {
      message_type: messageType,
    });
    firebaseService.startTrace('gemini_response_time');
  }

  /**
   * Track a chat response received from the AI Concierge.
   *
   * @param {number} responseLength - Length of the response in characters
   * @param {boolean} isMock - Whether the response came from mock mode
   * @returns {void}
   */
  trackChatResponse(responseLength, isMock = false) {
    this.track(ANALYTICS_EVENTS.CHAT_RESPONSE_RECEIVED, {
      response_length: responseLength,
      is_mock: isMock,
    });
    firebaseService.stopTrace('gemini_response_time', {
      mock_mode: String(isMock),
    });
  }

  /**
   * Track a boundary (four or six) hit event.
   *
   * @param {string} type - 'four' or 'six'
   * @param {string} batsmanName - Name of the batsman
   * @param {string} bowlerName - Name of the bowler
   * @returns {void}
   */
  trackBoundary(type, batsmanName, bowlerName) {
    this.track(ANALYTICS_EVENTS.BOUNDARY_HIT, {
      boundary_type: type,
      batsman: batsmanName,
      bowler: bowlerName,
    });
  }

  /**
   * Track a wicket event.
   *
   * @param {string} batsmanName - Name of the dismissed batsman
   * @param {string} bowlerName - Name of the bowler
   * @param {string} dismissalType - Type of dismissal
   * @returns {void}
   */
  trackWicket(batsmanName, bowlerName, dismissalType) {
    this.track(ANALYTICS_EVENTS.WICKET_FALLEN, {
      batsman: batsmanName,
      bowler: bowlerName,
      dismissal: dismissalType,
    });
  }

  /**
   * Start a custom performance trace.
   *
   * @param {string} traceName - Name of the trace
   * @returns {void}
   */
  startTrace(traceName) {
    firebaseService.startTrace(traceName);
  }

  /**
   * Stop a custom performance trace.
   *
   * @param {string} traceName - Name of the trace
   * @param {Object} [attributes={}] - Custom attributes
   * @returns {void}
   */
  stopTrace(traceName, attributes = {}) {
    firebaseService.stopTrace(traceName, attributes);
  }
}

/**
 * Singleton Analytics service instance.
 * @type {AnalyticsService}
 */
const analyticsService = new AnalyticsService();
export default analyticsService;
