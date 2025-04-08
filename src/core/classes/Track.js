export class Track {
    constructor(name, minLapTime, maxLapTime, drsZones = 3) {
      this.name = name;
      this.minLapTime = minLapTime;
      this.maxLapTime = maxLapTime;
      this.drsZones = drsZones;
    }
  }