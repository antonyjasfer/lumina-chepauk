/**
 * StadiumEngine.js
 * 
 * Full IPL Match Simulation Engine for M.A. Chidambaram Stadium (Chepauk).
 * Simulates: crowd dynamics, stall traffic, water stations, cricket match
 * ball-by-ball action, scorecard, DRS reviews, and event-based crowd reactions.
 */

class StadiumEngine {
  constructor() {
    // IPL 2026 Teams & Rosters Database
    this.iplTeams = [
      { id: 'CSK', name: 'Chennai Super Kings', short: 'CSK', color: '#fcd500', 
        batsmen: ['Ruturaj Gaikwad', 'Devon Conway', 'Shivam Dube', 'Daryl Mitchell', 'Ravindra Jadeja', 'MS Dhoni', 'Shardul Thakur', 'Deepak Chahar', 'Tushar Deshpande', 'Matheesha Pathirana', 'Maheesh Theekshana'],
        bowlers: ['Deepak Chahar', 'Matheesha Pathirana', 'Ravindra Jadeja', 'Maheesh Theekshana', 'Shardul Thakur', 'Tushar Deshpande'] },
      { id: 'RCB', name: 'Royal Challengers Bengaluru', short: 'RCB', color: '#E33333',
        batsmen: ['Virat Kohli', 'Faf du Plessis', 'Rajat Patidar', 'Glenn Maxwell', 'Cameron Green', 'Dinesh Karthik', 'Mahipal Lomror', 'Mohammed Siraj', 'Yash Dayal', 'Lockie Ferguson', 'Karn Sharma'],
        bowlers: ['Mohammed Siraj', 'Yash Dayal', 'Lockie Ferguson', 'Glenn Maxwell', 'Cameron Green', 'Karn Sharma'] },
      { id: 'MI', name: 'Mumbai Indians', short: 'MI', color: '#004BA0',
        batsmen: ['Rohit Sharma', 'Ishan Kishan', 'Suryakumar Yadav', 'Hardik Pandya', 'Tilak Varma', 'Tim David', 'Romario Shepherd', 'Jasprit Bumrah', 'Gerald Coetzee', 'Piyush Chawla', 'Nuwan Thushara'],
        bowlers: ['Jasprit Bumrah', 'Gerald Coetzee', 'Hardik Pandya', 'Piyush Chawla', 'Nuwan Thushara', 'Romario Shepherd'] },
      { id: 'KKR', name: 'Kolkata Knight Riders', short: 'KKR', color: '#3A225D',
        batsmen: ['Sunil Narine', 'Phil Salt', 'Venkatesh Iyer', 'Shreyas Iyer', 'Andre Russell', 'Rinku Singh', 'Nitish Rana', 'Mitchell Starc', 'Varun Chakravarthy', 'Harshit Rana', 'Vaibhav Arora'],
        bowlers: ['Mitchell Starc', 'Sunil Narine', 'Varun Chakravarthy', 'Andre Russell', 'Harshit Rana', 'Vaibhav Arora'] },
      { id: 'SRH', name: 'Sunrisers Hyderabad', short: 'SRH', color: '#FF822A',
        batsmen: ['Travis Head', 'Abhishek Sharma', 'Aiden Markram', 'Heinrich Klaasen', 'Nitish Reddy', 'Abdul Samad', 'Shahbaz Ahmed', 'Pat Cummins', 'Bhuvneshwar Kumar', 'T Natarajan', 'Mayank Markande'],
        bowlers: ['Pat Cummins', 'Bhuvneshwar Kumar', 'T Natarajan', 'Shahbaz Ahmed', 'Mayank Markande', 'Nitish Reddy'] },
      { id: 'RR', name: 'Rajasthan Royals', short: 'RR', color: '#EA1A85',
        batsmen: ['Yashasvi Jaiswal', 'Jos Buttler', 'Sanju Samson', 'Riyan Parag', 'Shimron Hetmyer', 'Dhruv Jurel', 'Ravichandran Ashwin', 'Trent Boult', 'Yuzvendra Chahal', 'Avesh Khan', 'Sandeep Sharma'],
        bowlers: ['Trent Boult', 'Yuzvendra Chahal', 'Ravichandran Ashwin', 'Avesh Khan', 'Sandeep Sharma'] },
      { id: 'LSG', name: 'Lucknow Super Giants', short: 'LSG', color: '#0AB1ED',
        batsmen: ['KL Rahul', 'Quinton de Kock', 'Marcus Stoinis', 'Nicholas Pooran', 'Ayush Badoni', 'Krunal Pandya', 'Ravi Bishnoi', 'Mohsin Khan', 'Naveen-ul-Haq', 'Yash Thakur', 'Mayank Yadav'],
        bowlers: ['Ravi Bishnoi', 'Mohsin Khan', 'Naveen-ul-Haq', 'Krunal Pandya', 'Yash Thakur', 'Mayank Yadav'] },
      { id: 'DC', name: 'Delhi Capitals', short: 'DC', color: '#00008B',
        batsmen: ['David Warner', 'Prithvi Shaw', 'Jake Fraser-McGurk', 'Rishabh Pant', 'Tristan Stubbs', 'Axar Patel', 'Kuldeep Yadav', 'Anrich Nortje', 'Khaleel Ahmed', 'Mukesh Kumar', 'Ishant Sharma'],
        bowlers: ['Kuldeep Yadav', 'Axar Patel', 'Anrich Nortje', 'Khaleel Ahmed', 'Mukesh Kumar', 'Ishant Sharma'] },
      { id: 'PBKS', name: 'Punjab Kings', short: 'PBKS', color: '#DD1F2D',
        batsmen: ['Shikhar Dhawan', 'Prabhsimran Singh', 'Jonny Bairstow', 'Sam Curran', 'Liam Livingstone', 'Jitesh Sharma', 'Shashank Singh', 'Kagiso Rabada', 'Harshal Patel', 'Arshdeep Singh', 'Rahul Chahar'],
        bowlers: ['Kagiso Rabada', 'Arshdeep Singh', 'Harshal Patel', 'Sam Curran', 'Rahul Chahar'] },
      { id: 'GT', name: 'Gujarat Titans', short: 'GT', color: '#1B2133',
        batsmen: ['Shubman Gill', 'Sai Sudharsan', 'Kane Williamson', 'David Miller', 'Rahul Tewatia', 'Rashid Khan', 'Spencer Johnson', 'Mohit Sharma', 'Umesh Yadav', 'Noor Ahmad', 'Sai Kishore'],
        bowlers: ['Rashid Khan', 'Mohit Sharma', 'Spencer Johnson', 'Umesh Yadav', 'Noor Ahmad', 'Sai Kishore'] }
    ];

    this.state = this._createInitialState();
    this.tickCount = 0;
    this._crowdReturning = false;
    this._matchNumber = 0;
    this.startNextMatch();
  }

  _createInitialState() {
    return {
      matchStatus: 'In Progress',
      currentInnings: 1,
      matchResult: null,

      matchInfo: {
        team1: { name: 'Chennai Super Kings', short: 'CSK', color: '#fcd500' },
        team2: { name: 'Kolkata Knight Riders', short: 'KKR', color: '#3A225D' },
        venue: 'M.A. Chidambaram Stadium, Chepauk, Chennai',
        date: '',
        toss: '',
        totalAttendance: 37500,
        battingFirst: 'CSK',
        bowlingFirst: 'KKR',
      },

      // DRS System
      drs: {
        active: false,
        team: null,
        reviewType: null,
        result: null,
        timer: 0,
        phase: 'idle', // 'idle' | 'processing' | 'result'
        reviewsRemaining: { team1: 2, team2: 2 },
      },

      // Scorecard
      scorecard: {
        innings1: { team: 'CSK', runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0, runRate: 0.00 },
        innings2: { team: 'KKR', runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0, runRate: 0.00 },
        currentBatsmen: [
          { name: 'Ruturaj Gaikwad', runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: true },
          { name: 'Devon Conway', runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: false },
        ],
        currentBowler: { name: 'Sunil Narine', overs: 0, balls: 0, runs: 0, wickets: 0, economy: 0.00 },
        lastSixBalls: [],
        lastEvent: null,
        partnership: { runs: 0, balls: 0 },
      },

      // Cricket Animation State
      animation: {
        ballInPlay: false,
        ballX: 0,
        ballY: 0,
        ballTarget: null,
        batsmanSwing: false,
        bowlerRun: false,
      },

      // Crowd Zones (computed each tick)
      crowdZones: {
        inSeats: 0,
        atAmenities: 0,
        roaming: 0,
        total: 0,
      },

      // Stadium Stands (Total capacity ~40,800 — safely holds 37k-38k)
      stands: {
        'Lower C': { density: 92, excitement: 85, capacity: 2000 },
        'Lower D': { density: 88, excitement: 80, capacity: 1700 },
        'Lower E': { density: 90, excitement: 82, capacity: 1800 },
        'Lower F': { density: 85, excitement: 78, capacity: 2000 },
        'Lower G': { density: 87, excitement: 83, capacity: 2200 },
        'Lower H': { density: 91, excitement: 88, capacity: 2100 },
        'Lower I': { density: 95, excitement: 95, capacity: 2500 },
        'Lower J': { density: 93, excitement: 92, capacity: 2800 },
        'Lower K': { density: 89, excitement: 86, capacity: 2200 },
        'Lower L': { density: 86, excitement: 79, capacity: 2000 },
        'Upper C': { density: 78, excitement: 70, capacity: 1400 },
        'Upper D': { density: 75, excitement: 68, capacity: 1300 },
        'Upper E': { density: 80, excitement: 72, capacity: 1300 },
        'Upper F': { density: 77, excitement: 70, capacity: 1400 },
        'Upper G': { density: 82, excitement: 75, capacity: 1500 },
        'Upper H': { density: 84, excitement: 80, capacity: 1600 },
        'Upper I': { density: 88, excitement: 85, capacity: 2000 },
        'Upper J': { density: 85, excitement: 82, capacity: 1900 },
        'Upper K': { density: 80, excitement: 76, capacity: 1700 },
        'Upper L': { density: 76, excitement: 68, capacity: 1400 },
        'KMK Lower': { density: 96, excitement: 98, capacity: 1800 },
        'KMK Upper': { density: 90, excitement: 92, capacity: 1200 },
        'Anna Pavilion': { density: 70, excitement: 65, capacity: 1000 },
      },

      // 10 Official Chepauk Stadium Sponsor Stalls
      stalls: {
        'Chai Kings Tea Lounge':       { crowd: 0, capacity: 2500, type: 'cafe', emoji: '☕', sponsor: 'Chai Kings' },
        'The Catering Co. Express':    { crowd: 0, capacity: 2200, type: 'food', emoji: '🍽️', sponsor: 'The Catering Co.' },
        'Erode Amman Mess (EAM)':      { crowd: 0, capacity: 2500, type: 'food', emoji: '🥘', sponsor: 'EAM' },
        'Ganga Sweets Corner':         { crowd: 0, capacity: 2000, type: 'food', emoji: '🍬', sponsor: 'Ganga Sweets' },
        'Moksha Morsel Café':          { crowd: 0, capacity: 2000, type: 'food', emoji: '🍦', sponsor: 'Moksha Morsel' },
        'British Empire Beverages':    { crowd: 0, capacity: 1800, type: 'drinks', emoji: '💧', sponsor: 'British Empire' },
        'CSK Official SuperStore':     { crowd: 0, capacity: 2000, type: 'merch', emoji: '🏏', sponsor: 'CSK' },
        'Dream11 Fan Zone':            { crowd: 0, capacity: 2200, type: 'fanzone', emoji: '🎮', sponsor: 'Dream11' },
        'JioCinema VR Zone':           { crowd: 0, capacity: 2000, type: 'experience', emoji: '🎬', sponsor: 'JioCinema' },
        'CEAT Timeout Café':           { crowd: 0, capacity: 1800, type: 'cafe', emoji: '⏱️', sponsor: 'CEAT' },
      },

      // 4 Free Water Stations (British Empire - Official Hydration Partner)
      waterStations: {
        'British Empire Water Point A': { crowd: 0, capacity: 1500, emoji: '💧', brand: 'British Empire' },
        'British Empire Water Point B': { crowd: 0, capacity: 1500, emoji: '💧', brand: 'British Empire' },
        'British Empire Water Point C': { crowd: 0, capacity: 1500, emoji: '💧', brand: 'British Empire' },
        'British Empire Water Point D': { crowd: 0, capacity: 1500, emoji: '💧', brand: 'British Empire' },
      },

      concourseCount: 0,

      // Innings break observation log
      breakObservations: [],
    };
  }

  startNextMatch() {
    this._matchNumber++;
    const opponents = this.iplTeams.filter(t => t.id !== 'CSK');
    const opp = opponents[Math.floor(Math.random() * opponents.length)];
    const csk = this.iplTeams.find(t => t.id === 'CSK');

    // Toss logic — proper IPL toss
    const tossWinner = Math.random() > 0.5 ? csk : opp;
    const tossDecision = Math.random() > 0.5 ? 'bat' : 'bowl';
    const battingFirst = tossDecision === 'bat' ? tossWinner : (tossWinner.id === 'CSK' ? opp : csk);
    const bowlingFirst = battingFirst.id === 'CSK' ? opp : csk;

    this._battingFirstTeam = battingFirst;
    this._bowlingFirstTeam = bowlingFirst;
    this._cskTeam = csk;
    this._oppTeam = opp;

    this._battingFirstBatsmen = battingFirst.batsmen;
    this._battingFirstBowlers = battingFirst.bowlers;
    this._bowlingFirstBatsmen = bowlingFirst.batsmen;
    this._bowlingFirstBowlers = bowlingFirst.bowlers;

    this._wicketsFallen1 = 0;
    this._wicketsFallen2 = 0;
    this._bowlerBallsThisOver = 0;
    this._bowlerIndex = 0;
    this._crowdReturning = false;
    this._drsProcessTicks = 0;

    // Reset Attendance exactly between 37000 and 38000
    const targetAttendance = Math.floor(Math.random() * 1001) + 37000;

    // Reset stands
    const standKeys = Object.keys(this.state.stands);
    standKeys.forEach(key => {
      this.state.stands[key].density = 0;
      this.state.stands[key].excitement = 50 + Math.floor(Math.random() * 30);
    });

    // Fast proportional distribution — fill each stand proportional to its capacity
    const totalCapacity = standKeys.reduce((sum, k) => sum + this.state.stands[k].capacity, 0);
    let distributed = 0;
    standKeys.forEach((key, i) => {
      const cap = this.state.stands[key].capacity;
      let share;
      if (i === standKeys.length - 1) {
        // Last stand gets the remainder to ensure EXACT total
        share = targetAttendance - distributed;
      } else {
        // Proportional share with ±2% random jitter for realism
        const basePct = cap / totalCapacity;
        const jitter = 0.98 + Math.random() * 0.04;
        share = Math.floor(targetAttendance * basePct * jitter);
      }
      share = Math.min(share, cap); // Never exceed stand capacity
      share = Math.max(0, share);
      this.state.stands[key].density = (share / cap) * 100;
      distributed += share;
    });

    // If rounding caused a shortfall, distribute remainder
    let shortfall = targetAttendance - distributed;
    let idx = 0;
    while (shortfall > 0 && idx < standKeys.length * 3) {
      const key = standKeys[idx % standKeys.length];
      const cap = this.state.stands[key].capacity;
      const current = Math.floor(cap * (this.state.stands[key].density / 100));
      if (current < cap) {
        const add = Math.min(shortfall, cap - current);
        this.state.stands[key].density = ((current + add) / cap) * 100;
        shortfall -= add;
      }
      idx++;
    }

    // Reset stalls & water
    Object.keys(this.state.stalls).forEach(k => this.state.stalls[k].crowd = 0);
    Object.keys(this.state.waterStations).forEach(k => this.state.waterStations[k].crowd = 0);

    const tossStr = `${tossWinner.short} won the toss and elected to ${tossDecision} first`;

    // Any people that still couldn't fit go to concourse
    const leftover = Math.max(0, shortfall);

    this.state = {
      ...this.state,
      matchStatus: 'In Progress',
      currentInnings: 1,
      matchResult: null,
      concourseCount: leftover,
      breakObservations: [],
      matchInfo: {
        team1: { name: csk.name, short: csk.short, color: csk.color },
        team2: { name: opp.name, short: opp.short, color: opp.color },
        venue: 'M.A. Chidambaram Stadium, Chepauk, Chennai',
        date: new Date().toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' IST',
        toss: tossStr,
        totalAttendance: targetAttendance,
        battingFirst: battingFirst.short,
        bowlingFirst: bowlingFirst.short,
        matchNumber: this._matchNumber,
      },
      drs: {
        active: false,
        team: null,
        reviewType: null,
        result: null,
        timer: 0,
        phase: 'idle',
        reviewsRemaining: { team1: 2, team2: 2 },
      },
      scorecard: {
        innings1: { team: battingFirst.short, runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0, runRate: 0.00 },
        innings2: { team: bowlingFirst.short, runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0, runRate: 0.00 },
        currentBatsmen: [
          { name: battingFirst.batsmen[0], runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: true },
          { name: battingFirst.batsmen[1], runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: false },
        ],
        currentBowler: { name: bowlingFirst.bowlers[0], overs: 0, balls: 0, runs: 0, wickets: 0, economy: 0.00 },
        lastSixBalls: [],
        lastEvent: null,
        partnership: { runs: 0, balls: 0 },
      },
      animation: {
        ballInPlay: false, ballX: 0, ballY: 0, ballTarget: null, batsmanSwing: false, bowlerRun: false,
      },
    };

    this._updateCrowdZones();
  }

  getState() {
    return structuredClone(this.state);
  }

  _clamp(val, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Math.round(val)));
  }

  // ===== CROWD ZONE COMPUTATION =====

  _updateCrowdZones() {
    const standKeys = Object.keys(this.state.stands);
    const stallKeys = Object.keys(this.state.stalls);
    const waterKeys = Object.keys(this.state.waterStations);

    const inSeats = standKeys.reduce((a, s) => a + Math.floor((this.state.stands[s].capacity || 1000) * (this.state.stands[s].density / 100)), 0);
    const atStalls = stallKeys.reduce((a, s) => a + this.state.stalls[s].crowd, 0);
    const atWater = waterKeys.reduce((a, w) => a + this.state.waterStations[w].crowd, 0);
    const atAmenities = atStalls + atWater;
    const roaming = Math.max(0, this.state.concourseCount);
    const total = inSeats + atAmenities + roaming;

    this.state.crowdZones = { inSeats, atAmenities, roaming, total };
  }

  // ===== DRS SYSTEM =====

  _tryDRS(outcome, striker, bowler) {
    // DRS only on wicket deliveries — ~40% chance the batting team reviews
    if (outcome !== 'wicket') return false;
    if (Math.random() > 0.40) return false;

    // Check if reviewing team has reviews left
    const reviewingTeamKey = this.state.currentInnings === 1 ? 'team1' : 'team2';
    if (this.state.drs.reviewsRemaining[reviewingTeamKey] <= 0) return false;

    const reviewTypes = ['LBW Review', 'Caught Behind (Ultra Edge)', 'No Ball Check', 'Stumping Review'];
    const reviewType = reviewTypes[Math.floor(Math.random() * reviewTypes.length)];

    // Determine batting team
    const battingTeam = this.state.currentInnings === 1 
      ? this.state.matchInfo.battingFirst 
      : this.state.matchInfo.bowlingFirst;

    this.state.drs = {
      ...this.state.drs,
      active: true,
      team: battingTeam,
      reviewType: reviewType,
      batsmanName: striker.name,
      bowlerName: bowler.name,
      result: null,
      timer: 15, // 15 ticks processing time (~30 seconds)
      phase: 'processing',
    };

    this._drsProcessTicks = 0;
    return true;
  }

  _processDRS() {
    if (!this.state.drs.active) return;

    this._drsProcessTicks++;

    if (this._drsProcessTicks >= this.state.drs.timer) {
      // Determine result (60% OUT confirmed, 40% NOT OUT / Umpire's Call)
      const rand = Math.random();
      let result, reviewLost;

      if (rand < 0.35) {
        result = 'NOT OUT — Decision Overturned!';
        reviewLost = false; // Review retained
      } else if (rand < 0.55) {
        result = "NOT OUT — Umpire's Call (Review Retained)";
        reviewLost = false;
      } else {
        result = 'OUT — Decision Stands';
        reviewLost = true;
      }

      // Deduct review if lost
      if (reviewLost) {
        const reviewingTeamKey = this.state.currentInnings === 1 ? 'team1' : 'team2';
        this.state.drs.reviewsRemaining[reviewingTeamKey] = Math.max(0, this.state.drs.reviewsRemaining[reviewingTeamKey] - 1);
      }

      // If NOT OUT, reverse the wicket
      if (!reviewLost || result.includes('NOT OUT')) {
        this._reverseDRSWicket();
      }

      this.state.drs.result = result;
      this.state.drs.phase = 'result';
      this.state.drs.timer = 8; // Show result for 8 ticks (~16 seconds)
      this._drsProcessTicks = 0;
    }
  }

  _processDRSResult() {
    if (this.state.drs.phase !== 'result') return;

    this._drsProcessTicks++;
    if (this._drsProcessTicks >= this.state.drs.timer) {
      this.state.drs = {
        ...this.state.drs,
        active: false,
        team: null,
        reviewType: null,
        result: null,
        timer: 0,
        phase: 'idle',
      };
      this._drsProcessTicks = 0;
    }
  }

  _reverseDRSWicket() {
    // Reverse the wicket — bring back the batsman and reduce wicket count
    const innings = this.state.currentInnings === 1 ? this.state.scorecard.innings1 : this.state.scorecard.innings2;
    if (innings.wickets > 0) {
      innings.wickets--;
    }

    // Restore batsman on strike (the one who was given out)
    if (this.state.currentInnings === 1) {
      if (this._wicketsFallen1 > 0) {
        this._wicketsFallen1--;
        // Put the original batsman back
        const originalBat = this._battingFirstBatsmen[this._wicketsFallen1 + 1];
        // Find the replacement and swap back
        const idx = this.state.scorecard.currentBatsmen.findIndex(b => b.onStrike);
        if (idx !== -1 && this._drsOriginalBatsman) {
          this.state.scorecard.currentBatsmen[idx] = this._drsOriginalBatsman;
        }
      }
    } else {
      if (this._wicketsFallen2 > 0) {
        this._wicketsFallen2--;
        const idx = this.state.scorecard.currentBatsmen.findIndex(b => b.onStrike);
        if (idx !== -1 && this._drsOriginalBatsman) {
          this.state.scorecard.currentBatsmen[idx] = this._drsOriginalBatsman;
        }
      }
    }

    // Update commentary
    this.state.scorecard.lastEvent = {
      type: 'drs_overturned',
      description: `DRS: ${this.state.drs.batsmanName} is NOT OUT! Decision overturned! The batsman survives! 🟢`
    };
  }

  // ===== MATCH RESULT CALCULATION =====

  _calculateMatchResult() {
    const inn1 = this.state.scorecard.innings1;
    const inn2 = this.state.scorecard.innings2;
    const batFirst = this.state.matchInfo.battingFirst;
    const bowlFirst = this.state.matchInfo.bowlingFirst;

    if (this.state.currentInnings === 2) {
      if (inn2.runs > inn1.runs) {
        // Chasing team won
        const wicketsLeft = 10 - inn2.wickets;
        this.state.matchResult = `${bowlFirst} won by ${wicketsLeft} wicket${wicketsLeft !== 1 ? 's' : ''}`;
      } else if (inn2.runs === inn1.runs) {
        this.state.matchResult = 'Match Tied!';
      } else {
        // Batting first team won
        const runMargin = inn1.runs - inn2.runs;
        this.state.matchResult = `${batFirst} won by ${runMargin} run${runMargin !== 1 ? 's' : ''}`;
      }
    }
  }

  // ===== CRICKET SIMULATION =====

  _simulateBall() {
    if (this.state.matchStatus !== 'In Progress') return;

    // Don't simulate during DRS
    if (this.state.drs.active) return;

    const innings = this.state.currentInnings === 1 ? this.state.scorecard.innings1 : this.state.scorecard.innings2;

    // Victory via Chase Condition
    if (this.state.currentInnings === 2) {
      if (this.state.scorecard.innings2.runs > this.state.scorecard.innings1.runs) {
        this._calculateMatchResult();
        this.state.matchStatus = 'Match Complete';
        return;
      }
    }

    if (innings.wickets >= 10 || (innings.overs >= 20 && innings.balls === 0)) {
      if (this.state.currentInnings === 1) {
        // App.jsx handles Innings Break transitioning
        return;
      } else {
        this._calculateMatchResult();
        this.state.matchStatus = 'Match Complete';
        return;
      }
    }

    // Determine outcome
    const rand = Math.random();
    let outcome, runs, description;
    const striker = this.state.scorecard.currentBatsmen.find(b => b.onStrike);
    const bowler = this.state.scorecard.currentBowler;

    if (rand < 0.30) {
      outcome = 'dot'; runs = 0;
      description = `${bowler.name} to ${striker.name}, no run.`;
    } else if (rand < 0.55) {
      outcome = 'single'; runs = 1;
      description = `${bowler.name} to ${striker.name}, single to fine leg.`;
    } else if (rand < 0.68) {
      outcome = 'double'; runs = 2;
      description = `${bowler.name} to ${striker.name}, pushed to covers for two.`;
    } else if (rand < 0.72) {
      outcome = 'triple'; runs = 3;
      description = `${bowler.name} to ${striker.name}, excellent running between the wickets!`;
    } else if (rand < 0.84) {
      outcome = 'four'; runs = 4;
      description = `${bowler.name} to ${striker.name}, FOUR! Smashed through the gap! 🏏`;
    } else if (rand < 0.92) {
      outcome = 'six'; runs = 6;
      description = `${bowler.name} to ${striker.name}, SIX! Massive hit into the stands! 💥`;
    } else if (rand < 0.96) {
      outcome = 'wicket'; runs = 0;
      const dismissalTypes = ['Caught behind', 'Bowled', 'LBW', 'Caught at mid-off', 'Run out'];
      description = `${bowler.name} to ${striker.name}, OUT! ${dismissalTypes[Math.floor(Math.random() * dismissalTypes.length)]}! 🔴`;
    } else {
      outcome = 'wide'; runs = 1;
      description = `${bowler.name} bowls a wide. Extra run.`;
      innings.extras++;
    }

    // Update scorecard
    innings.runs += runs;
    if (outcome !== 'wide') {
      innings.balls++;
      striker.balls++;
      this._bowlerBallsThisOver++;
      bowler.balls++;
    }

    if (outcome === 'four') striker.fours++;
    if (outcome === 'six') striker.sixes++;
    if (runs > 0 && outcome !== 'wicket' && outcome !== 'wide') striker.runs += runs;

    // Bowler stats
    if (outcome !== 'wide') bowler.runs += runs;

    if (outcome === 'wicket') {
      // Save original batsman for DRS reversal
      this._drsOriginalBatsman = { ...striker };

      // Try DRS before confirming wicket
      const drsTriggered = this._tryDRS(outcome, striker, bowler);

      innings.wickets++;
      bowler.wickets++;

      // Replace batter
      if (this.state.currentInnings === 1) {
        this._wicketsFallen1++;
        if (this._wicketsFallen1 < 10) {
          const newBat = this._battingFirstBatsmen[this._wicketsFallen1 + 1];
          const idx = this.state.scorecard.currentBatsmen.findIndex(b => b.onStrike);
          if (newBat) {
            this.state.scorecard.currentBatsmen[idx] = { name: newBat, runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: true };
          }
        }
      } else {
        this._wicketsFallen2++;
        if (this._wicketsFallen2 < 10) {
          const newBat = this._bowlingFirstBatsmen[this._wicketsFallen2 + 1];
          const idx = this.state.scorecard.currentBatsmen.findIndex(b => b.onStrike);
          if (newBat) {
            this.state.scorecard.currentBatsmen[idx] = { name: newBat, runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: true };
          }
        }
      }
      this.state.scorecard.partnership = { runs: 0, balls: 0 };

      if (drsTriggered) {
        description += ' — 📺 DRS REVIEW TAKEN!';
      }
    }

    // Rotate strike on odd runs
    if (runs % 2 === 1 && outcome !== 'wide') {
      this.state.scorecard.currentBatsmen.forEach(b => { b.onStrike = !b.onStrike; });
    }

    // Over completion
    if (this._bowlerBallsThisOver >= 6) {
      innings.overs++;
      innings.balls = 0;
      this._bowlerBallsThisOver = 0;
      // Change bowler
      const bowlers = this.state.currentInnings === 1 ? this._bowlingFirstBowlers : this._battingFirstBowlers;
      this._bowlerIndex = (this._bowlerIndex + 1) % bowlers.length;
      this.state.scorecard.currentBowler = {
        name: bowlers[this._bowlerIndex],
        overs: 0, balls: 0, runs: 0, wickets: 0, economy: 0.00
      };
      // Rotate strike at end of over
      this.state.scorecard.currentBatsmen.forEach(b => { b.onStrike = !b.onStrike; });
    }

    // Update run rate
    const totalBalls = innings.overs * 6 + innings.balls;
    innings.runRate = totalBalls > 0 ? parseFloat((innings.runs / (totalBalls / 6)).toFixed(2)) : 0;

    // Bowler economy
    const bBalls = bowler.overs * 6 + bowler.balls;
    bowler.economy = bBalls > 0 ? parseFloat((bowler.runs / (bBalls / 6)).toFixed(2)) : 0;
    bowler.overs = Math.floor(bowler.balls / 6);

    // Update last 6 balls
    this.state.scorecard.lastSixBalls.push(outcome === 'wicket' ? 'W' : outcome === 'wide' ? 'Wd' : runs.toString());
    if (this.state.scorecard.lastSixBalls.length > 6) this.state.scorecard.lastSixBalls.shift();

    // Set event
    this.state.scorecard.lastEvent = { type: outcome, description };

    // Update partnership
    if (outcome !== 'wicket') {
      this.state.scorecard.partnership.runs += runs;
      this.state.scorecard.partnership.balls++;
    }

    // Animation state
    this.state.animation = {
      ballInPlay: true,
      ballTarget: outcome === 'four' ? 'boundary' : outcome === 'six' ? 'six' : outcome === 'wicket' ? 'wicket' : 'fielder',
      batsmanSwing: true,
      bowlerRun: true,
      ballX: 0, ballY: 0,
    };

    // Crowd excitement spike on boundaries/wickets
    if (outcome === 'six' || outcome === 'four') {
      Object.keys(this.state.stands).forEach(key => {
        this.state.stands[key].excitement = this._clamp(this.state.stands[key].excitement + (outcome === 'six' ? 15 : 8));
      });
    } else if (outcome === 'wicket') {
      // Check which team is batting — CSK fans cheer when opponent is out
      const cskIsBatting = (this.state.currentInnings === 1 && this.state.matchInfo.battingFirst === 'CSK')
                        || (this.state.currentInnings === 2 && this.state.matchInfo.bowlingFirst === 'CSK');
      
      if (!cskIsBatting) {
        // Opponent wicket — CSK fans cheer!
        Object.keys(this.state.stands).forEach(key => {
          this.state.stands[key].excitement = this._clamp(this.state.stands[key].excitement + 20);
        });
      } else {
        // CSK wicket — fans disappointed
        Object.keys(this.state.stands).forEach(key => {
          this.state.stands[key].excitement = this._clamp(this.state.stands[key].excitement - 10);
        });
      }
    }

    // Check chase completion after scoring
    if (this.state.currentInnings === 2 && this.state.scorecard.innings2.runs > this.state.scorecard.innings1.runs) {
      this._calculateMatchResult();
      this.state.matchStatus = 'Match Complete';
    }
  }

  // ===== MAIN TICK =====

  tick() {
    this.tickCount++;

    // Process DRS if active
    if (this.state.drs.active) {
      if (this.state.drs.phase === 'processing') {
        this._processDRS();
      } else if (this.state.drs.phase === 'result') {
        this._processDRSResult();
      }
      this._updateCrowdZones();
      return this.getState();
    }

    this._simulateBall();

    const stallKeys = Object.keys(this.state.stalls);
    const waterKeys = Object.keys(this.state.waterStations);
    const standKeys = Object.keys(this.state.stands);

    // POST-MATCH CROWD DISPERSAL
    if (this.state.matchStatus === 'Match Complete' || this.state.matchStatus === 'Ready For Next Match') {
      // Slowly remove people from concourse (exiting the stadium)
      const exitRate = Math.min(this.state.concourseCount, Math.floor(Math.random() * 400 + 200));
      this.state.concourseCount = Math.max(0, this.state.concourseCount - exitRate);

      // Extract people from stands to concourse (leaving seats slowly)
      standKeys.forEach(stKey => {
        const p = Math.floor(this.state.stands[stKey].capacity * (this.state.stands[stKey].density / 100));
        if (p > 0) {
          const leaving = Math.min(p, Math.floor(Math.random() * 60 + 15));
          this.state.stands[stKey].density = ((p - leaving) / this.state.stands[stKey].capacity) * 100;
          this.state.concourseCount += leaving;
        }
      });

      // Extract from stalls
      stallKeys.forEach(k => {
        const leaving = Math.min(this.state.stalls[k].crowd, Math.floor(Math.random() * 20 + 5));
        this.state.stalls[k].crowd = Math.max(0, this.state.stalls[k].crowd - leaving);
        this.state.concourseCount += leaving;
      });

      // Extract from water stations
      waterKeys.forEach(k => {
        const leaving = Math.min(this.state.waterStations[k].crowd, Math.floor(Math.random() * 15 + 5));
        this.state.waterStations[k].crowd = Math.max(0, this.state.waterStations[k].crowd - leaving);
        this.state.concourseCount += leaving;
      });

      // Check if stadium is empty
      this._updateCrowdZones();
      if (this.state.crowdZones.total <= 0 && this.state.matchStatus === 'Match Complete') {
        this.state.matchStatus = 'Ready For Next Match';
        this.state.concourseCount = 0;
      }

      return this.getState();
    }

    // Normal match crowd flow — people getting thirsty/hungry
    if (this.state.matchStatus === 'In Progress' && !this._crowdReturning) {
      let thirstyPeople = Math.floor(Math.random() * 30 + 10);
      let attempts = 0;
      while (thirstyPeople > 0 && attempts < 50) {
        const stKey = standKeys[Math.floor(Math.random() * standKeys.length)];
        const p = Math.floor(this.state.stands[stKey].capacity * (this.state.stands[stKey].density / 100));
        if (p > 5) {
          this.state.stands[stKey].density = ((p - 1) / this.state.stands[stKey].capacity) * 100;
          this.state.concourseCount++;
          thirstyPeople--;
        }
        attempts++;
      }
    }

    // Distribute concourse to stalls and water
    if (this.state.concourseCount > 0) {
      let enteringLines = Math.min(this.state.concourseCount, Math.floor(this.state.concourseCount * 0.2) + 5);
      this.state.concourseCount -= enteringLines;

      while (enteringLines > 0) {
        if (Math.random() < 0.6) {
          const wKey = waterKeys[Math.floor(Math.random() * waterKeys.length)];
          this.state.waterStations[wKey].crowd++;
        } else {
          const sKey = stallKeys[Math.floor(Math.random() * stallKeys.length)];
          this.state.stalls[sKey].crowd++;
        }
        enteringLines--;
      }
    }

    // Process people finishing at stalls/water and returning
    let finishingCount = 0;
    stallKeys.forEach(k => {
      const done = Math.floor(this.state.stalls[k].crowd * (Math.random() * 0.05 + 0.02));
      this.state.stalls[k].crowd = Math.max(0, this.state.stalls[k].crowd - done);
      finishingCount += done;
    });
    waterKeys.forEach(k => {
      const done = Math.floor(this.state.waterStations[k].crowd * (Math.random() * 0.20 + 0.10));
      this.state.waterStations[k].crowd = Math.max(0, this.state.waterStations[k].crowd - done);
      finishingCount += done;
    });
    this.state.concourseCount += finishingCount;

    // Return to stands naturally
    if (this.state.matchStatus === 'In Progress' && !this._crowdReturning && this.state.concourseCount > 0) {
      let returning = Math.min(this.state.concourseCount, Math.floor(this.state.concourseCount * 0.1) + 2);
      this.state.concourseCount -= returning;
      while (returning > 0) {
        const stKey = standKeys[Math.floor(Math.random() * standKeys.length)];
        const p = Math.floor(this.state.stands[stKey].capacity * (this.state.stands[stKey].density / 100));
        if (p < this.state.stands[stKey].capacity) {
          this.state.stands[stKey].density = ((p + 1) / this.state.stands[stKey].capacity) * 100;
        } else {
          this.state.concourseCount++;
        }
        returning--;
      }
    }

    // MASS Crowd returning (after breaks)
    if (this._crowdReturning) {
      if (this.state.concourseCount > 0) {
        let massTransit = Math.min(this.state.concourseCount, 250);
        this.state.concourseCount -= massTransit;
        while (massTransit > 0) {
          const stKey = standKeys[Math.floor(Math.random() * standKeys.length)];
          const p = Math.floor(this.state.stands[stKey].capacity * (this.state.stands[stKey].density / 100));
          if (p < this.state.stands[stKey].capacity) {
            this.state.stands[stKey].density = ((p + 1) / this.state.stands[stKey].capacity) * 100;
          } else {
            this.state.concourseCount++;
          }
          massTransit--;
        }
      }
      if (Object.values(this.state.stalls).reduce((a, v) => a + v.crowd, 0) < 600 && this.state.concourseCount < 500) {
        this._crowdReturning = false;
      }
    }

    // Excitement decay
    standKeys.forEach(key => {
      if (this.state.stands[key].excitement > 70) {
        this.state.stands[key].excitement = this._clamp(this.state.stands[key].excitement - 0.5);
      }
    });

    this._updateCrowdZones();
    return this.getState();
  }

  // ===== TRIGGERS =====

  triggerInningsBreak() {
    // Record crowd snapshot before break
    const preSeatCount = this.state.crowdZones.inSeats;
    const preAmenitiesCount = this.state.crowdZones.atAmenities;

    this.state.matchStatus = 'Innings Break';

    // 55-65% of people leave the stands and enter concourse
    Object.keys(this.state.stands).forEach(key => {
      const cap = this.state.stands[key].capacity;
      const currentP = Math.floor(cap * (this.state.stands[key].density / 100));
      const leavePct = 55 + Math.random() * 10;
      const leavers = Math.floor(currentP * (leavePct / 100));

      this.state.stands[key].density = ((currentP - leavers) / cap) * 100;
      this.state.concourseCount += leavers;
    });

    // Surge stalls during break (people grabbing food)
    Object.keys(this.state.stalls).forEach(k => {
      const surge = Math.floor(Math.random() * 200 + 100);
      const fromConcourse = Math.min(this.state.concourseCount, surge);
      this.state.stalls[k].crowd += fromConcourse;
      this.state.concourseCount -= fromConcourse;
    });

    // Surge water stations
    Object.keys(this.state.waterStations).forEach(k => {
      const surge = Math.floor(Math.random() * 80 + 40);
      const fromConcourse = Math.min(this.state.concourseCount, surge);
      this.state.waterStations[k].crowd += fromConcourse;
      this.state.concourseCount -= fromConcourse;
    });

    this._updateCrowdZones();

    // Log observation
    const seatDrop = preSeatCount > 0 ? Math.round(((preSeatCount - this.state.crowdZones.inSeats) / preSeatCount) * 100) : 0;
    const amenitiesMultiple = preAmenitiesCount > 0 ? (this.state.crowdZones.atAmenities / preAmenitiesCount).toFixed(1) : '∞';

    this.state.breakObservations.push({
      type: 'innings_break',
      time: new Date().toLocaleTimeString(),
      message: `Innings Break: In-seat ↓ ${seatDrop}% | Amenities surged ↑ ${amenitiesMultiple}x | Roaming: ${this.state.crowdZones.roaming.toLocaleString()}`
    });
  }

  triggerStrategicTimeout() {
    const preSeatCount = this.state.crowdZones.inSeats;

    this.state.matchStatus = 'Strategic Timeout';

    // 10-30% leave stands during timeout
    Object.keys(this.state.stands).forEach(key => {
      const cap = this.state.stands[key].capacity;
      const currentP = Math.floor(cap * (this.state.stands[key].density / 100));
      const leavePct = 10 + Math.random() * 20;
      const leavers = Math.floor(currentP * (leavePct / 100));

      this.state.stands[key].density = ((currentP - leavers) / cap) * 100;
      this.state.concourseCount += leavers;
    });

    // Some people visit stalls during timeout
    Object.keys(this.state.stalls).forEach(k => {
      const surge = Math.floor(Math.random() * 40 + 10);
      const fromConcourse = Math.min(this.state.concourseCount, surge);
      this.state.stalls[k].crowd += fromConcourse;
      this.state.concourseCount -= fromConcourse;
    });

    this._updateCrowdZones();

    const seatDrop = preSeatCount > 0 ? Math.round(((preSeatCount - this.state.crowdZones.inSeats) / preSeatCount) * 100) : 0;
    this.state.breakObservations.push({
      type: 'timeout',
      time: new Date().toLocaleTimeString(),
      message: `Strategic Timeout: In-seat ↓ ${seatDrop}% | Quick stall rush detected`
    });
  }

  endBreak() {
    this.state.matchStatus = 'In Progress';
    this._crowdReturning = true;

    // If innings 1 just ended, switch to innings 2
    if (this.state.currentInnings === 1 && (this.state.scorecard.innings1.overs >= 20 || this.state.scorecard.innings1.wickets >= 10)) {
      this.state.currentInnings = 2;
      this.state.scorecard.innings2.team = this._bowlingFirstTeam.short;
      this._wicketsFallen2 = 0;
      this._bowlerIndex = 0;
      this._bowlerBallsThisOver = 0;
      this.state.scorecard.currentBatsmen = [
        { name: this._bowlingFirstBatsmen[0], runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: true },
        { name: this._bowlingFirstBatsmen[1], runs: 0, balls: 0, fours: 0, sixes: 0, onStrike: false },
      ];
      this.state.scorecard.currentBowler = { 
        name: this._battingFirstBowlers[0], overs: 0, balls: 0, runs: 0, wickets: 0, economy: 0.00 
      };
      this.state.scorecard.lastSixBalls = [];
      this.state.scorecard.partnership = { runs: 0, balls: 0 };

      // Reset DRS reviews for 2nd innings
      this.state.drs.reviewsRemaining = { team1: 2, team2: 2 };
    }
  }

  // Get required run rate for 2nd innings
  getRequiredRunRate() {
    if (this.state.currentInnings !== 2) return null;
    const inn1 = this.state.scorecard.innings1;
    const inn2 = this.state.scorecard.innings2;
    const target = inn1.runs + 1;
    const runsNeeded = target - inn2.runs;
    const ballsRemaining = Math.max(1, (20 - inn2.overs) * 6 - inn2.balls);
    const oversRemaining = ballsRemaining / 6;
    return {
      target,
      runsNeeded: Math.max(0, runsNeeded),
      ballsRemaining,
      requiredRunRate: oversRemaining > 0 ? parseFloat((runsNeeded / oversRemaining).toFixed(2)) : 0,
    };
  }
}

export default StadiumEngine;
