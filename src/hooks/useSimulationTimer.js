/**
 * @module useSimulationTimer
 * @description Custom React hook for managing simulation tick intervals.
 * Encapsulates the setInterval logic for the StadiumEngine tick cycle,
 * providing a clean, reusable API for the main App component.
 *
 * @example
 * const { stadiumState } = useSimulationTimer(engine, SIMULATION_TICK_INTERVAL);
 */
import { useState, useEffect, useCallback } from 'react';
import { SIMULATION_TICK_INTERVAL } from '../constants/index.js';

/**
 * Custom hook that drives the simulation loop by calling engine.tick()
 * at a specified interval and managing the reactive stadium state.
 *
 * @param {Object} engine - StadiumEngine instance
 * @param {number} [interval=SIMULATION_TICK_INTERVAL] - Tick interval in milliseconds
 * @returns {Object} Hook return value
 * @returns {Object} return.stadiumState - Current immutable state snapshot
 * @returns {Function} return.refreshState - Manually refresh the state snapshot
 */
export function useSimulationTimer(engine, interval = SIMULATION_TICK_INTERVAL) {
  const [stadiumState, setStadiumState] = useState(() => engine.getState());

  useEffect(() => {
    const timer = setInterval(() => {
      setStadiumState(engine.tick());
    }, interval);
    return () => clearInterval(timer);
  }, [engine, interval]);

  const refreshState = useCallback(() => {
    setStadiumState(engine.getState());
  }, [engine]);

  return { stadiumState, setStadiumState, refreshState };
}

export default useSimulationTimer;
