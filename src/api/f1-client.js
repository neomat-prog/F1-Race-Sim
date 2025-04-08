import fetch from "node-fetch";
import Team from "../core/classes/Team.js";
import Driver from "../core/classes/Driver.js";

export class F1Client {
  static async getSessionKey(circuit, year, session) {
    const response = await fetch(
      `https://api.openf1.org/v1/sessions?circuit_short_name=${circuit}&year=${year}&session_name=${session}`
    );
    const data = await response.json();
    return data[0]?.session_key;
  }

  static async getDrivers(sessionKey) {
    const response = await fetch(
      `https://api.openf1.org/v1/drivers?session_key=${sessionKey}`
    );
    const data = await response.json();

    // Create teams map with default performance
    const teams = new Map();

    return data.map((driverData) => {
      const teamName = driverData.team_name || "Unknown";

      if (!teams.has(teamName)) {
        teams.set(
          teamName,
          new Team(
            teamName,
            this.getDefaultPerformance(teamName) // Default car performance
          )
        );
      }

      return new Driver(
        driverData.full_name,
        teams.get(teamName),
        85, // Default consistency
        driverData.driver_number
      );
    });
  }

  static getDefaultPerformance(teamName) {
    const performanceMap = {
      "Red Bull": 95,
      Mercedes: 93,
      Ferrari: 92,
      McLaren: 90,
      "Aston Martin": 88,
      Alpine: 87,
      Williams: 85,
      AlphaTauri: 84,
      "Alfa Romeo": 83,
      Haas: 82,
    };

    return performanceMap[teamName] || 85;
  }
}
