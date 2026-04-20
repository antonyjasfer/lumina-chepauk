/**
 * @module formatters
 * @description Utility functions for formatting display values across the Lumina Chepauk app.
 * Extracted from components for reusability and testability.
 */

/**
 * Format a duration in seconds to a mm:ss display string.
 *
 * @param {number} seconds - Total seconds to format
 * @returns {string} Formatted time string (e.g., "2:30", "15:00")
 *
 * @example
 * formatTime(150)  // "2:30"
 * formatTime(900)  // "15:00"
 * formatTime(0)    // "0:00"
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Format a large number with locale-appropriate separators.
 *
 * @param {number} num - Number to format
 * @returns {string} Formatted number string (e.g., "37,500")
 *
 * @example
 * formatNumber(37500)  // "37,500"
 * formatNumber(0)      // "0"
 */
export function formatNumber(num) {
  return (num || 0).toLocaleString();
}

/**
 * Calculate the percentage of a value relative to a capacity.
 *
 * @param {number} value - Current value
 * @param {number} capacity - Maximum capacity
 * @returns {number} Percentage (0-100), rounded to the nearest integer
 *
 * @example
 * calculatePercentage(750, 1000)  // 75
 * calculatePercentage(0, 1000)    // 0
 */
export function calculatePercentage(value, capacity) {
  if (!capacity || capacity <= 0) return 0;
  return Math.round((value / capacity) * 100);
}

/**
 * Get a congestion severity level string based on a percentage.
 *
 * @param {number} percentage - Occupancy percentage (0-100)
 * @returns {'low' | 'medium' | 'high'} Congestion level
 *
 * @example
 * getCongestionLevel(50)  // 'low'
 * getCongestionLevel(70)  // 'medium'
 * getCongestionLevel(90)  // 'high'
 */
export function getCongestionLevel(percentage) {
  if (percentage > 85) return 'high';
  if (percentage > 60) return 'medium';
  return 'low';
}

/**
 * Clamp a number to a specified range.
 *
 * @param {number} val - Value to clamp
 * @param {number} [min=0] - Minimum bound
 * @param {number} [max=100] - Maximum bound
 * @returns {number} Clamped and rounded integer
 *
 * @example
 * clamp(150)      // 100
 * clamp(-20)      // 0
 * clamp(50)       // 50
 */
export function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(val)));
}
