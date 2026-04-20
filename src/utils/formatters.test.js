import { describe, it, expect } from 'vitest';
import { formatTime, formatNumber, calculatePercentage, getCongestionLevel, clamp } from './formatters';

/**
 * Formatters Utility Test Suite
 * Tests all utility formatting functions for correctness and edge cases.
 */
describe('formatTime', () => {
  it('formats 0 seconds as 0:00', () => {
    expect(formatTime(0)).toBe('0:00');
  });

  it('formats 150 seconds as 2:30 (Strategic Timeout)', () => {
    expect(formatTime(150)).toBe('2:30');
  });

  it('formats 900 seconds as 15:00 (Innings Break)', () => {
    expect(formatTime(900)).toBe('15:00');
  });

  it('formats 59 seconds as 0:59', () => {
    expect(formatTime(59)).toBe('0:59');
  });

  it('formats 61 seconds as 1:01', () => {
    expect(formatTime(61)).toBe('1:01');
  });

  it('formats 3600 seconds as 60:00', () => {
    expect(formatTime(3600)).toBe('60:00');
  });
});

describe('formatNumber', () => {
  it('formats 37500 with commas', () => {
    expect(formatNumber(37500)).toBe('37,500');
  });

  it('handles 0', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('handles null/undefined gracefully', () => {
    expect(formatNumber(null)).toBe('0');
    expect(formatNumber(undefined)).toBe('0');
  });
});

describe('calculatePercentage', () => {
  it('calculates 75% correctly', () => {
    expect(calculatePercentage(750, 1000)).toBe(75);
  });

  it('returns 0 for empty capacity', () => {
    expect(calculatePercentage(100, 0)).toBe(0);
  });

  it('returns 0 for null capacity', () => {
    expect(calculatePercentage(100, null)).toBe(0);
  });

  it('returns 100 for full capacity', () => {
    expect(calculatePercentage(1000, 1000)).toBe(100);
  });

  it('rounds to nearest integer', () => {
    expect(calculatePercentage(1, 3)).toBe(33);
  });
});

describe('getCongestionLevel', () => {
  it('returns low for < 60%', () => {
    expect(getCongestionLevel(50)).toBe('low');
  });

  it('returns medium for 60-85%', () => {
    expect(getCongestionLevel(70)).toBe('medium');
  });

  it('returns high for > 85%', () => {
    expect(getCongestionLevel(90)).toBe('high');
  });

  it('returns low for 0%', () => {
    expect(getCongestionLevel(0)).toBe('low');
  });

  it('returns medium for exactly 61%', () => {
    expect(getCongestionLevel(61)).toBe('medium');
  });

  it('returns high for exactly 86%', () => {
    expect(getCongestionLevel(86)).toBe('high');
  });
});

describe('clamp', () => {
  it('clamps values above max to 100', () => {
    expect(clamp(150)).toBe(100);
  });

  it('clamps values below min to 0', () => {
    expect(clamp(-20)).toBe(0);
  });

  it('passes through values in range', () => {
    expect(clamp(50)).toBe(50);
  });

  it('supports custom min/max', () => {
    expect(clamp(5, 10, 20)).toBe(10);
    expect(clamp(25, 10, 20)).toBe(20);
    expect(clamp(15, 10, 20)).toBe(15);
  });

  it('rounds to nearest integer', () => {
    expect(clamp(50.7)).toBe(51);
    expect(clamp(50.3)).toBe(50);
  });
});
