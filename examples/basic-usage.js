import { F1Client, Race, Track } from '../src/index.js';

async function simulateRace() {
  try {
    const sessionKey = await F1Client.getSessionKey('Sakhir', 2023, 'Qualifying');
    const driversData = await F1Client.getDrivers(sessionKey);
    
    const track = new Track('Bahrain', 90, 110);
    const race = new Race({
      track,
      drivers: driversData,
      sessionKey,
      laps: 57
    });
    
    await race.initialize();
    const results = race.simulate();
    
    console.log('Race Results:');
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.driver} - ${result.time.toFixed(3)}s`);
    });
    
  } catch (error) {
    console.error('Simulation error:', error.message);
  }
}

simulateRace();