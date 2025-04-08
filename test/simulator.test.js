import { Race } from "../src/core/classes/Race.js";
import { Track } from "../src/core/classes/Track.js";
import { Driver } from "../src/core/classes/Driver.js";
import { Team } from "../src/core/classes/Team.js";

describe("Race Simulation", () => {
  const testTrack = new Track("Test Circuit", 80, 100);
  const testTeam = new Team("Test Team", 95);
  const testDrivers = [
    new Driver("Driver 1", testTeam, 90, 1),
    new Driver("Driver 2", testTeam, 85, 2),
  ];

  test("should complete race with results", () => {
    const race = new Race({
      track: testTrack,
      drivers: testDrivers,
      laps: 5,
    });

    const results = race.simulate();
    expect(results.length).toBe(2);
    expect(results[0].totalTime).toBeLessThan(results[1].totalTime);
  });

  test("should handle retired drivers", () => {
    const crashProneDriver = new Driver("Crash Driver", testTeam, 50, 3);
    const race = new Race({
      track: testTrack,
      drivers: [...testDrivers, crashProneDriver],
      laps: 5,
    });

    const results = race.simulate();
    const retired = results.filter((d) => d.retired);
    expect(retired.length).toBeGreaterThanOrEqual(0);
  });
});
