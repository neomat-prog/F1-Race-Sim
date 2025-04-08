// src/core/classes/Race.js

import fetch from "node-fetch";

export class Track {
  constructor(name, minLapTime, maxLapTime) {
    this.name = name;
    this.maxLapTime = maxLapTime;
    this.minLapTime = minLapTime;
  }
}

export class Team {
  constructor(name, carPerformance) {
    this.name = name;
    this.carPerformance = carPerformance;
  }
}

export class Driver {
  constructor(name, team, consistency, driverNumber) {
    this.name = name;
    this.team = team;
    this.consistency = consistency;
    this.driverNumber = driverNumber;
  }
}

export default class Race {
  constructor(options) {
    this.track = options.track;
    this.drivers = options.drivers;
    this.weather = options.weather || "dry";
    this.laps = options.laps || 50;
    this.pitStrategies = options.pitStrategies || {};
    this.sessionKey = options.sessionKey;
    this.driverStates = this.drivers.map((driver) => ({
      driver,
      totalTime: 0,
      currentTires: "medium",
      lapsOnTires: 0,
      retired: false,
      performance: null,
    }));
    this.currentLap = 0;
    this.events = [];
    this.isSafetyCarOut = false;
    this.safetyCarLapsRemaining = 0;
  }

  async initialize() {
    if (this.sessionKey) {
      await this.fetchQualifyingData();
    } else {
      this.driverStates.sort(
        (a, b) =>
          (b.driver.team?.carPerformance || 90) -
          (a.driver.team?.carPerformance || 90)
      );
    }
  }

  async fetchQualifyingData() {
    const url = `https://api.openf1.org/v1/qualifying?session_key=${this.sessionKey}`;
    const response = await fetch(url);
    const qualifyingData = await response.json();

    const qualifyingMap = new Map(
      qualifyingData.map((d) => [d.driver_number, d])
    );

    const driverPerformance = [];
    for (const state of this.driverStates) {
      const driverData = qualifyingMap.get(state.driver.driverNumber);
      if (driverData) {
        state.position = driverData.position;
        driverPerformance.push({ state, lapTime: driverData.lap_time });
      } else {
        console.warn(
          `No qualifying data for ${state.driver.name}; using default`
        );
        state.performance = state.driver.team.carPerformance;
      }
    }

    this.driverStates.sort((a, b) => a.position - b.position);

    if (driverPerformance.length > 0) {
      const lapTimes = driverPerformance.map((dp) => dp.lapTime);
      const minLapTime = Math.min(...lapTimes);
      const maxLapTime = Math.max(...lapTimes);
      this.track.minLapTime = minLapTime;
      this.track.maxLapTime = maxLapTime;

      for (const { state, lapTime } of driverPerformance) {
        state.performance =
          80 + 20 * ((maxLapTime - lapTime) / (maxLapTime - minLapTime));
      }
    }
  }

  simulate() {
    while (this.currentLap < this.laps) {
      this.currentLap++;
      this.checkEvents();
      this.driverStates.forEach((state) => {
        if (state.retired) return;
        const strategy = this.pitStrategies[state.driver.name];
        if (strategy && strategy[this.currentLap]) {
          this.performPitStop(state, strategy[this.currentLap]);
        }
        const lapTime = this.calculateLapTime(state);
        state.totalTime += lapTime;
        state.lapsOnTires++;
      });
      this.updatePositions();
    }
    return this.generateResults();
  }

  calculateLapTime(state) {
    const { driver } = state;
    const performance = state.performance || driver.team.carPerformance;
    const minPerformance = 80;
    const maxPerformance = 100;
    const performanceRange = maxPerformance - minPerformance;
    const lapTimeRange = this.track.maxLapTime - this.track.minLapTime;
    const carLapTime =
      this.track.maxLapTime -
      ((performance - minPerformance) / performanceRange) * lapTimeRange;

    const tire = this.getTireProperties(state.currentTires);
    const tirePenalty =
      tire.baseOffset + tire.degradationRate * state.lapsOnTires;

    const weatherMultiplier = this.getWeatherMultiplier();

    let baseLapTime = (carLapTime + tirePenalty) * weatherMultiplier;

    if (this.isSafetyCarOut) {
      baseLapTime += 20;
    }

    const variation = 0.5 * (1 - driver.consistency / 100);
    const randomVariation = (Math.random() * 2 - 1) * variation;

    return baseLapTime + randomVariation;
  }

  // Placeholder methods
  checkEvents() {}
  performPitStop(state, tireType) {
    state.currentTires = tireType;
    state.lapsOnTires = 0;
  }
  getTireProperties(tireType) {
    return { baseOffset: 0.5, degradationRate: 0.1 };
  }
  getWeatherMultiplier() {
    return this.weather === "dry" ? 1 : 1.1;
  }
  updatePositions() {
    this.driverStates.sort((a, b) => a.totalTime - b.totalTime);
  }
  generateResults() {
    return this.driverStates.map((state) => ({
      driver: state.driver.name,
      totalTime: state.totalTime,
      retired: state.retired,
    }));
  }
}
