# F1 Simulator Package

A complete Formula 1 racing simulation package with real-world data integration.

## Installation
```bash
npm install f1-simulator
```

## Usage
```javascript
import { F1Client, Race, Track } from 'f1-simulator';

async function runSimulation() {
  const sessionKey = await F1Client.getSessionKey('Monza', 2023, 'Qualifying');
  const drivers = await F1Client.getDrivers(sessionKey);
  
  const race = new Race({
    track: new Track('Monza', 75, 95),
    drivers,
    laps: 53
  });
  
  const results = await race.simulate();
  console.log(results);
}
```

## Features
- Real F1 data integration
- Tire degradation modeling
- Safety car probability
- DRS system simulation
- Crash mechanics
- Performance-based lap times

## API Documentation
See [API Reference](docs/API.md) for detailed documentation.


Here's a complete usage guide for F1 simulator package:

1. Installation
bash
Copy
npm install f1-simulator
2. Basic Usage
javascript
Copy
import { F1Client, Race, Track } from 'f1-simulator';

async function runSimulation() {
  try {
    // Get real F1 data
    const sessionKey = await F1Client.getSessionKey('Monza', 2023, 'Qualifying');
    const driversData = await F1Client.getDrivers(sessionKey);

    // Create track instance
    const track = new Track('Monza', 75, 95, 3); // Name, min lap, max lap, DRS zones

     Initialize race
    const race = new Race({
      track,
      drivers: driversData,
      sessionKey,
      laps: 53,
      weather: 'dry' // or 'wet'
    });

    // Run simulation
    await race.initialize();
    const results = race.simulate();

    // Display results
    console.log('\nRace Results:');
    results.forEach((driver, index) => {
      const status = driver.retired ? 'DNF' : driver.time.toFixed(3) + 's';
      console.log(`${index + 1}. ${driver.driver.padEnd(15)} ${status}`);
    });

  } catch (error) {
    console.error('Simulation error:', error.message);
  }
}

runSimulation();
3. Custom Simulation
javascript
Copy
// Create custom drivers and teams
const redBull = new Team('Red Bull', 97);
const mercedes = new Team('Mercedes', 95);

const customDrivers = [
  new Driver('Max Verstappen', redBull, 95, 1),
  new Driver('Lewis Hamilton', mercedes, 93, 44)
];

// Create custom track
const customTrack = new Track('Custom Circuit', 80, 110, 2);

// Run custom simulation
const customRace = new Race({
  track: customTrack,
  drivers: customDrivers,
  laps: 30,
  weather: 'wet'
});

customRace.initialize().then(() => {
  const results = customRace.simulate();
  console.log('\nCustom Race Results:');
  results.forEach(r => console.log(r));
});
4. Advanced Features
Weather Simulation
javascript
Copy
const race = new Race({
  // ... other options
  weather: 'dynamic', // Auto-changing weather
  weatherChanges: [
    { lap: 10, newWeather: 'wet' },
    { lap: 20, newWeather: 'dry' }
  ]
});
Pit Strategies
javascript
Copy
const strategies = {
  'Max Verstappen': {
    15: 'hard',
    30: 'medium'
  },
  'Lewis Hamilton': {
    10: 'soft',
    25: 'medium'
  }
};

const race = new Race({
  // ... other options
  pitStrategies: strategies
});
Safety Car Configuration
javascript
Copy
import { SafetyCarSystem } from 'f1-simulator';

// Modify safety car probabilities
SafetyCarSystem.probabilities = {
  normal: 0.03,
  wet: 0.20,
  crash: 0.35
};
5. Output Example
Copy
Race Results:
1. Max Verstappen    3089.452s
2. Lewis Hamilton    3092.781s
3. Charles Leclerc   3095.112s
4. Sergio Pérez      DNF
5. Carlos Sainz      3101.334s
