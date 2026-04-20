/**
 * @module constants
 * @description Central configuration constants for the Lumina Chepauk application.
 * All magic numbers and configuration values are extracted here for maintainability,
 * testability, and code quality. Constants are organized by domain.
 */

// ===== MATCH RULES (IPL T20 Official) =====

/** @constant {number} Maximum overs per innings in T20 format */
export const MAX_OVERS = 20;

/** @constant {number} Total wickets per innings */
export const TOTAL_WICKETS = 10;

/** @constant {number} Balls per over */
export const BALLS_PER_OVER = 6;

/** @constant {number} Number of DRS reviews available per team per innings */
export const DRS_REVIEWS_PER_TEAM = 2;

/** @constant {number} DRS processing time in engine ticks (~30 seconds real-time) */
export const DRS_PROCESS_TICKS = 15;

/** @constant {number} DRS result display time in engine ticks (~16 seconds real-time) */
export const DRS_RESULT_TICKS = 8;

// ===== TIMER DURATIONS (seconds) =====

/** @constant {number} Strategic Timeout duration in seconds (2 minutes 30 seconds per IPL rules) */
export const STRATEGIC_TIMEOUT_DURATION = 150;

/** @constant {number} Innings Break duration in seconds (15 minutes per IPL rules) */
export const INNINGS_BREAK_DURATION = 900;

/** @constant {number} Simulation tick interval in milliseconds */
export const SIMULATION_TICK_INTERVAL = 2000;

// ===== STRATEGIC TIMEOUT OVERS =====

/** @constant {number} Over at which the first mandatory strategic timeout occurs */
export const TIMEOUT_OVER_1 = 8;

/** @constant {number} Over at which the second mandatory strategic timeout occurs */
export const TIMEOUT_OVER_2 = 14;

// ===== AI CONCIERGE =====

/** @constant {number} Minimum interval between AI requests in milliseconds (rate limiting) */
export const MIN_REQUEST_INTERVAL = 2000;

/** @constant {number} Maximum user input length in characters */
export const MAX_INPUT_LENGTH = 500;

/** @constant {string} Gemini model identifier */
export const GEMINI_MODEL = 'gemini-2.0-flash';

// ===== STADIUM CONFIGURATION =====

/** @constant {number} Minimum total attendance for a match */
export const MIN_ATTENDANCE = 37000;

/** @constant {number} Maximum total attendance for a match */
export const MAX_ATTENDANCE = 38000;

/** @constant {number} Total number of stands in Chepauk Stadium */
export const TOTAL_STANDS = 23;

/** @constant {number} Total number of sponsor stalls */
export const TOTAL_STALLS = 10;

/** @constant {number} Total number of water stations */
export const TOTAL_WATER_STATIONS = 4;

// ===== CROWD DYNAMICS =====

/** @constant {number} Percentage of fans leaving stands during innings break (low end) */
export const INNINGS_BREAK_LEAVE_PCT_MIN = 55;

/** @constant {number} Additional random range for innings break leave percentage */
export const INNINGS_BREAK_LEAVE_PCT_RANGE = 10;

/** @constant {number} Percentage of fans leaving stands during strategic timeout (low end) */
export const TIMEOUT_LEAVE_PCT_MIN = 10;

/** @constant {number} Additional random range for timeout leave percentage */
export const TIMEOUT_LEAVE_PCT_RANGE = 20;

/** @constant {number} Mass transit people per tick during crowd return */
export const MASS_TRANSIT_PER_TICK = 250;

// ===== BALL OUTCOME PROBABILITIES (cumulative) =====

/** @constant {Object} Cumulative probability thresholds for ball outcomes */
export const BALL_PROBABILITIES = {
  DOT: 0.30,
  SINGLE: 0.55,
  DOUBLE: 0.68,
  TRIPLE: 0.72,
  FOUR: 0.84,
  SIX: 0.92,
  WICKET: 0.96,
  // Remainder (0.96-1.0) = Wide
};

// ===== DRS RESULT PROBABILITIES =====

/** @constant {Object} Cumulative probability thresholds for DRS outcomes */
export const DRS_PROBABILITIES = {
  NOT_OUT_OVERTURNED: 0.35,
  UMPIRES_CALL: 0.55,
  // Remainder (0.55-1.0) = OUT confirmed
};

/** @constant {number} Probability that a wicket triggers a DRS review */
export const DRS_REVIEW_CHANCE = 0.40;

// ===== MATCH STATUSES =====

/** @constant {string} Match is actively in play */
export const STATUS_IN_PROGRESS = 'In Progress';

/** @constant {string} Strategic timeout is active */
export const STATUS_STRATEGIC_TIMEOUT = 'Strategic Timeout';

/** @constant {string} Innings break is active */
export const STATUS_INNINGS_BREAK = 'Innings Break';

/** @constant {string} Match has finished */
export const STATUS_MATCH_COMPLETE = 'Match Complete';

/** @constant {string} Stadium is empty, ready for next match */
export const STATUS_READY_NEXT = 'Ready For Next Match';

// ===== FIREBASE EVENT NAMES =====

/** @constant {Object} Standardized Firebase Analytics event names */
export const ANALYTICS_EVENTS = {
  MATCH_STARTED: 'match_started',
  MATCH_COMPLETED: 'match_completed',
  INNINGS_BREAK: 'innings_break_triggered',
  STRATEGIC_TIMEOUT: 'strategic_timeout_triggered',
  DRS_REVIEW: 'drs_review_initiated',
  DRS_RESULT: 'drs_result',
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  CHAT_RESPONSE_RECEIVED: 'chat_response_received',
  NEXT_MATCH_STARTED: 'next_match_started',
  BOUNDARY_HIT: 'boundary_hit',
  WICKET_FALLEN: 'wicket_fallen',
  PAGE_VIEW: 'page_view',
};

// ===== GOOGLE SERVICES CONFIG =====

/** @constant {Object} Google Maps embed configuration */
export const GOOGLE_MAPS_CONFIG = {
  EMBED_URL: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.747!2d80.2789!3d13.0627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sM.A.Chidambaram%20Stadium!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  DIRECTIONS_URL: 'https://maps.google.com/?q=MA+Chidambaram+Stadium+Chennai',
  STADIUM_NAME: 'M.A. Chidambaram Stadium',
  ADDRESS: 'Victoria Hostel Road, Chepauk, Chennai — 600005, Tamil Nadu',
};
