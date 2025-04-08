import { TireManager, SafetyCarSystem, DRSSystem } from '../utils/config.js';
import { calculateVariation } from '../utils/helpers.js';

export class Race {
  constructor(options) {
    this.track = options.track;
    this.drivers = options.drivers;
    this.weather = options.weather || 'dry';
    this.laps = options.laps || 50;
    this.sessionKey = options.sessionKey;
    this.drsSystem = new DRSSystem(this.track);
    
    this.driverStates = this.drivers.map(driver => ({
      driver,
      totalTime: 0,
      currentTires: 'medium',
      lapsOnTires: 0,
      retired: false,
      performance: null,
      crashProbability: 0.02
    }));
  }

  async initialize() {
    if (this.sessionKey) await this.fetchQualifyingData();
  }

  async fetchQualifyingData() {
    const url = `https://api.openf1.org/v1/qualifying?session_key=${this.sessionKey}`;
    const response = await fetch(url);
    const qualifyingData = await response.json();
    
    const qualMap = new Map(qualifyingData.map(d => [d.driver_number, d]));
    this.driverStates.forEach(state => {
      const data = qualMap.get(state.driver.driverNumber);
      if (data) {
        state.qualifyingTime = data.lap_time;
        state.gridPosition = data.position;
      }
    });
  }

  simulate() {
    for (let lap = 1; lap <= this.laps; lap++) {
      this.processLap(lap);
    }
    return this.getResults();
  }

  processLap(lap) {
    this.drsSystem.updateDRSStatus(lap, this.driverStates);
    const safetyCar = SafetyCarSystem.checkSafetyCar(this.weather, this.countCrashes());
    
    this.driverStates.forEach(state => {
      if (state.retired) return;
      
      this.checkTireWear(state);
      this.checkCrash(state);
      
      const lapTime = this.calculateLapTime(state, safetyCar);
      state.totalTime += lapTime;
      state.lapsOnTires++;
    });
    
    this.driverStates.sort((a, b) => a.totalTime - b.totalTime);
  }

  calculateLapTime(state, safetyCar) {
    const tire = TireManager.getTireProperties(state.currentTires);
    const baseTime = this.track.minLapTime + 
      (this.track.maxLapTime - this.track.minLapTime) * 
      (1 - state.performance / 100);
    
    let totalTime = baseTime + 
      tire.degradation * state.lapsOnTires +
      calculateVariation(state.driver.consistency);
    
    if (safetyCar) totalTime *= 1.2;
    if (this.drsSystem.isActive) totalTime *= 0.995;
    
    return totalTime;
  }

  checkTireWear(state) {
    const maxLaps = TireManager.compounds[state.currentTires].lifespan;
    if (state.lapsOnTires > maxLaps) {
      state.crashProbability += 0.1;
    }
  }

  checkCrash(state) {
    if (Math.random() < state.crashProbability) {
      state.retired = true;
    }
  }

  getResults() {
    return this.driverStates
      .sort((a, b) => a.totalTime - b.totalTime)
      .map(state => ({
        driver: state.driver.name,
        time: state.totalTime,
        retired: state.retired,
        tires: state.currentTires
      }));
  }
}