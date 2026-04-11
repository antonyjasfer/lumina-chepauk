/**
 * StadiumEngine.js
 * 
 * Simulates real-time crowd dynamics, congestion, and wait times for 
 * M.A. Chidambaram Stadium (Chepauk) during an IPL match.
 */

class StadiumEngine {
  constructor() {
    this.state = {
      matchStatus: 'In Progress',
      stands: {
        'J-Stand': { density: 85, excitement: 95 },
        'Anna Pavilion': { density: 60, excitement: 70 },
        'C/D/E Lower': { density: 75, excitement: 80 }
      },
      concessions: {
        'Gate 3 Express': { waitTime: 5, status: 'Clear' },
        'Pavilion Lounge': { waitTime: 12, status: 'Moderate' },
        'J-Stand Food Court': { waitTime: 25, status: 'High' }
      },
      gates: {
        'Wallajah Road Entry': { waitTime: 2, status: 'Clear' },
        'Bells Road Entry': { waitTime: 8, status: 'Clear' }
      }
    };
    
    // Internal counters
    this.tickCount = 0;
    this.surgeActive = false;
    this.surgeDecayRate = 0;
  }

  // Returns current full state
  getState() {
    return structuredClone(this.state);
  }

  // Clamps value between min and max
  _clamp(val, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Math.round(val)));
  }

  // Advance simulation by one "tick" (e.g. 1 minute of real time)
  tick() {
    this.tickCount++;

    // Base fluctuation
    Object.keys(this.state.stands).forEach(key => {
      let change = (Math.random() - 0.5) * 4; // -2 to +2
      this.state.stands[key].density = this._clamp(this.state.stands[key].density + change);
    });

    Object.keys(this.state.concessions).forEach(key => {
      let change = (Math.random() - 0.5) * 2; // -1 to +1
      this.state.concessions[key].waitTime = this._clamp(this.state.concessions[key].waitTime + change, 0, 120);
      this._updateConcessionStatus(key);
    });

    // Decay surge if active
    if (this.surgeActive) {
      Object.keys(this.state.concessions).forEach(key => {
        this.state.concessions[key].waitTime -= this.surgeDecayRate;
        this.state.concessions[key].waitTime = this._clamp(this.state.concessions[key].waitTime, 0, 120);
        this._updateConcessionStatus(key);
      });
      
      this.surgeDecayRate *= 0.9; // Slow down decay
      if (this.surgeDecayRate < 0.5) {
        this.surgeActive = false;
        this.state.matchStatus = 'In Progress';
      }
    }
    
    return this.getState();
  }

  _updateConcessionStatus(key) {
    const time = this.state.concessions[key].waitTime;
    if (time > 20) this.state.concessions[key].status = 'High';
    else if (time > 10) this.state.concessions[key].status = 'Moderate';
    else this.state.concessions[key].status = 'Clear';
  }

  // Triggers
  triggerInningsBreak() {
    this.state.matchStatus = 'Innings Break';
    this.surgeActive = true;
    this.surgeDecayRate = 2.0;

    // Massive surge everywhere, especially J-Stand and Pavilion
    this.state.concessions['J-Stand Food Court'].waitTime += 35;
    this.state.concessions['Pavilion Lounge'].waitTime += 25;
    this.state.concessions['Gate 3 Express'].waitTime += 15;

    // Ensure bounds
    Object.keys(this.state.concessions).forEach(key => {
      this.state.concessions[key].waitTime = this._clamp(this.state.concessions[key].waitTime, 0, 120);
      this._updateConcessionStatus(key);
    });
  }

  triggerStrategicTimeout() {
    this.state.matchStatus = 'Strategic Timeout';
    this.surgeActive = true;
    this.surgeDecayRate = 4.0; // Decay faster because timeout is short

    this.state.concessions['J-Stand Food Court'].waitTime += 15;
    this.state.concessions['Gate 3 Express'].waitTime += 8;

    Object.keys(this.state.concessions).forEach(key => {
        this.state.concessions[key].waitTime = this._clamp(this.state.concessions[key].waitTime, 0, 120);
        this._updateConcessionStatus(key);
    });
  }
}

export default StadiumEngine;
