export const TireManager = {
    compounds: {
      soft: { degradation: 0.15, lifespan: 20 },
      medium: { degradation: 0.10, lifespan: 30 },
      hard: { degradation: 0.08, lifespan: 40 }
    },
    
    getTireProperties(type) {
      return this.compounds[type] || this.compounds.medium;
    }
  };
  
  export const SafetyCarSystem = {
    checkSafetyCar(weather, crashes) {
      const probabilities = {
        dry: 0.02,
        wet: 0.15,
        crash: 0.3
      };
      
      const baseProb = probabilities[weather] || 0.02;
      return Math.random() < baseProb + (crashes * 0.1);
    }
  };
  
  export class DRSSystem {
    constructor(track) {
      this.drsZones = track.drsZones;
      this.isActive = false;
    }
  
    updateDRSStatus(lap, positions) {
      this.isActive = lap > 2 && positions.some((p, i) => 
        i > 0 && (p.totalTime - positions[i-1].totalTime) < 1
      );
    }
  }