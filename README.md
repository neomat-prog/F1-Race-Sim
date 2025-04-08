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