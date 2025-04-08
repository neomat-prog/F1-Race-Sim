import { Race, Track, Driver, Team } from '../src/core/classes/Race.js';

describe('Race Simulation', () => {
  const testTrack = new Track('Test Circuit', 80, 100);
  const testTeam = new Team('Test Team', 95);
  const testDrivers = [
    new Driver('Driver 1', testTeam, 90, 1),
    new Driver('Driver 2', testTeam, 85, 2)
  ];

  test('should complete race with results', () => {
    const race = new Race({
      track: testTrack,
      drivers: testDrivers,
      laps: 5
    });
    
    const results = race.simulate();
    expect(results.length).toBe(2);
    expect(results[0].time).toBeLessThan(results[1].time);
  });
});