import { describe, it, expect, beforeEach } from 'vitest';

/**
 * GeminiService Test Suite
 * Tests the mock response engine and input sanitization.
 * Note: Live API tests are skipped (require API key).
 */

// We need to mock import.meta.env so we test the mock path
// Testing the exported singleton's methods directly

describe('GeminiService - Mock Response Engine', () => {
  let service;

  beforeEach(async () => {
    // Dynamic import to get the singleton
    const module = await import('./GeminiService');
    service = module.default;
    // Ensure we're in mock mode
    service.apiKey = null;
    service._lastRequestTime = 0; // Reset rate limiter
  });

  // ===== INPUT SANITIZATION =====

  describe('Input Sanitization', () => {
    it('strips HTML tags from user input', () => {
      const result = service.sanitizeInput('<script>alert("xss")</script>Hello');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
      expect(result).toContain('Hello');
    });

    it('removes special characters that could break prompts', () => {
      const result = service.sanitizeInput('Hello <world> "test" & \'quotes\'');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).not.toContain('"');
      expect(result).not.toContain("'");
      expect(result).not.toContain('&');
    });

    it('normalizes whitespace', () => {
      const result = service.sanitizeInput('hello    world   test');
      expect(result).toBe('hello world test');
    });

    it('trims leading and trailing whitespace', () => {
      const result = service.sanitizeInput('   hello world   ');
      expect(result).toBe('hello world');
    });

    it('truncates input to 500 characters', () => {
      const longInput = 'a'.repeat(1000);
      const result = service.sanitizeInput(longInput);
      expect(result.length).toBe(500);
    });

    it('returns empty string for non-string input', () => {
      expect(service.sanitizeInput(null)).toBe('');
      expect(service.sanitizeInput(undefined)).toBe('');
      expect(service.sanitizeInput(123)).toBe('');
    });

    it('returns empty string for empty input', () => {
      expect(service.sanitizeInput('')).toBe('');
      expect(service.sanitizeInput('   ')).toBe('');
    });
  });

  // ===== MOCK RESPONSE TESTS =====

  describe('Mock Responses', () => {
    const mockState = {
      matchStatus: 'In Progress',
      currentInnings: 1,
      crowdZones: { inSeats: 30000, atAmenities: 5000, roaming: 2000, total: 37000 },
      stalls: {
        'Chai Kings Tea Lounge': { crowd: 1800, capacity: 2500, type: 'cafe', sponsor: 'Chai Kings', emoji: '☕' },
        'Erode Amman Mess (EAM)': { crowd: 500, capacity: 2500, type: 'food', sponsor: 'EAM', emoji: '🥘' },
        'CSK Official SuperStore': { crowd: 1000, capacity: 2000, type: 'merch', sponsor: 'CSK', emoji: '🏏' },
      },
      waterStations: {
        'British Empire Water Point A': { crowd: 200, capacity: 1500, emoji: '💧', brand: 'British Empire' },
      },
      scorecard: {
        innings1: { team: 'CSK', runs: 120, wickets: 3, overs: 14, balls: 2, runRate: 8.42 },
        innings2: { team: 'RCB', runs: 0, wickets: 0, overs: 0, balls: 0, runRate: 0 },
        lastEvent: null,
      },
    };

    it('responds to food-related queries with stall data', async () => {
      service._lastRequestTime = 0;
      const response = await service.getConciergeResponse('Where can I get food?', mockState);
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(10);
    });

    it('responds to water queries mentioning FREE stations', async () => {
      service._lastRequestTime = 0;
      const response = await service.getConciergeResponse('I need water', mockState);
      expect(response.toLowerCase()).toContain('free');
    });

    it('responds to merchandise queries', async () => {
      service._lastRequestTime = 0;
      const response = await service.getConciergeResponse('Where can I buy a jersey?', mockState);
      expect(response).toContain('CSK');
    });

    it('responds to score queries with match data', async () => {
      service._lastRequestTime = 0;
      const response = await service.getConciergeResponse('What is the score?', mockState);
      expect(response).toBeTruthy();
    });

    it('handles rate limiting', async () => {
      service._lastRequestTime = Date.now(); // Just sent a message
      const response = await service.getConciergeResponse('test', mockState);
      expect(response).toContain('wait');
    });

    it('rejects empty sanitized input', async () => {
      service._lastRequestTime = 0;
      const response = await service.getConciergeResponse('   ', mockState);
      expect(response).toContain('rephrase');
    });
  });
});
