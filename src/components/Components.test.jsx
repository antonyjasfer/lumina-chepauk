import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Scorecard from './Scorecard';
import ErrorBoundary from './ErrorBoundary';
import GoogleMapsEmbed from './GoogleMapsEmbed';

/**
 * Component Render Tests
 * Verifies that UI components render without crashing
 * and display expected content.
 */

describe('Component Render Tests', () => {

  // ===== SCORECARD =====
  describe('Scorecard', () => {
    const defaultProps = {
      scorecard: {
        innings1: { team: 'CSK', runs: 120, wickets: 3, overs: 15, balls: 2, extras: 5, runRate: 7.87 },
        innings2: { team: 'RCB', runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0, runRate: 0 },
        currentBatsmen: [
          { name: 'Ruturaj Gaikwad', runs: 65, balls: 42, fours: 7, sixes: 2, onStrike: true },
          { name: 'Devon Conway', runs: 40, balls: 30, fours: 4, sixes: 1, onStrike: false },
        ],
        currentBowler: { name: 'Mohammed Siraj', overs: 3, balls: 2, runs: 28, wickets: 1, economy: 8.75 },
        lastSixBalls: ['4', '0', '1', 'W', '6', '2'],
        lastEvent: { type: 'four', description: 'Siraj to Gaikwad, FOUR! 🏏' },
        partnership: { runs: 85, balls: 58 },
      },
      matchInfo: {
        team1: { name: 'Chennai Super Kings', short: 'CSK', color: '#fcd500' },
        team2: { name: 'Royal Challengers Bengaluru', short: 'RCB', color: '#E33333' },
      },
      currentInnings: 1,
      drs: { active: false, reviewsRemaining: { team1: 2, team2: 2 } },
      matchResult: null,
      matchStatus: 'In Progress',
      requiredRunRate: null,
    };

    it('renders team scores correctly', () => {
      render(<Scorecard {...defaultProps} />);
      expect(screen.getAllByText('CSK').length).toBeGreaterThan(0);
      expect(screen.getAllByText('RCB').length).toBeGreaterThan(0);
      expect(screen.getByText('120/3')).toBeTruthy();
    });

    it('renders batsmen names', () => {
      render(<Scorecard {...defaultProps} />);
      expect(screen.getByText('Ruturaj Gaikwad *')).toBeTruthy();
      expect(screen.getByText('Devon Conway')).toBeTruthy();
    });

    it('renders bowler info', () => {
      render(<Scorecard {...defaultProps} />);
      expect(screen.getByText(/Mohammed Siraj/)).toBeTruthy();
    });

    it('renders ball indicators', () => {
      render(<Scorecard {...defaultProps} />);
      const balls = screen.getAllByRole('listitem');
      expect(balls.length).toBe(6);
    });

    it('renders commentary', () => {
      render(<Scorecard {...defaultProps} />);
      expect(screen.getByText(/FOUR/)).toBeTruthy();
    });

    it('renders run rate', () => {
      render(<Scorecard {...defaultProps} />);
      expect(screen.getByText('7.87')).toBeTruthy();
    });

    it('renders DRS reviews remaining', () => {
      render(<Scorecard {...defaultProps} />);
      const reviewsSection = screen.getByLabelText('DRS Reviews Remaining');
      expect(reviewsSection).toBeTruthy();
    });

    it('renders match result when match is complete', () => {
      render(<Scorecard {...defaultProps} matchResult="CSK won by 45 runs" matchStatus="Match Complete" />);
      expect(screen.getByText('CSK won by 45 runs')).toBeTruthy();
    });
  });

  // ===== ERROR BOUNDARY =====
  describe('ErrorBoundary', () => {
    // Suppress console.error for intentional error testing
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    it('renders children when no error', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child">Hello World</div>
        </ErrorBoundary>
      );
      expect(screen.getByTestId('child')).toBeTruthy();
      expect(screen.getByText('Hello World')).toBeTruthy();
    });

    it('renders fallback UI when child throws', () => {
      const BrokenComponent = () => {
        throw new Error('Test crash');
      };

      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeTruthy();
      expect(screen.getByText(/Reload Lumina/)).toBeTruthy();
    });

    consoleSpy.mockRestore?.();
  });

  // ===== GOOGLE MAPS EMBED =====
  describe('GoogleMapsEmbed', () => {
    it('renders the maps section', () => {
      render(<GoogleMapsEmbed />);
      expect(screen.getByLabelText('Stadium Location')).toBeTruthy();
    });

    it('renders the iframe with correct title', () => {
      render(<GoogleMapsEmbed />);
      const iframe = screen.getByTitle(/M.A. Chidambaram Stadium/);
      expect(iframe).toBeTruthy();
      expect(iframe.tagName).toBe('IFRAME');
    });

    it('renders the "Open in Google Maps" link', () => {
      render(<GoogleMapsEmbed />);
      const link = screen.getByText('Open in Google Maps →');
      expect(link).toBeTruthy();
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
    });

    it('shows the stadium address', () => {
      render(<GoogleMapsEmbed />);
      expect(screen.getByText(/Victoria Hostel Road/)).toBeTruthy();
    });
  });
});
