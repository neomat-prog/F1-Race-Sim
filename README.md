🏎️ F1 Simulator Package
A complete Formula 1 racing simulation package with real-world data integration, dynamic race features, and realistic race results.

📦 Installation
bash
Copy
Edit
npm install f1-simulator
🚀 Quick Start
import { F1Client, Race, Track } from 'f1-simulator';
```
async function runSimulation() {
  try {
    const sessionKey = await F1Client.getSessionKey('Monza', 2023, 'Qualifying');
    const driversData = await F1Client.getDrivers(sessionKey);

    const track = new Track('Monza', 75, 95, 3); // name, minLapTime, maxLapTime, DRS zones

    const race = new Race({
      track,
      drivers: driversData,
      sessionKey,
      laps: 53,
      weather: 'dry' // Options: 'dry', 'wet', or 'dynamic'
    });

    await race.initialize();
    const results = race.simulate();

    console.log('\nRace Results:');
    results.forEach((driver, index) => {
      const status = driver.retired ? 'DNF' : `${driver.time.toFixed(3)}s`;
      console.log(`${index + 1}. ${driver.driver.padEnd(15)} ${status}`);
    });
  } catch (error) {
    console.error('Simulation error:', error.message);
  }
}

runSimulation();
```
🧰 Features
✅ Real F1 data integration

🛞 Tire degradation modeling

🚨 Safety car deployment probabilities

🌀 DRS system simulation

💥 Crash and mechanical failure mechanics

⏱️ Realistic lap time performance calculations

🌦️ Dynamic weather changes

🧠 Pit strategy planning

🛠️ Custom Simulation
Custom Drivers and Teams
```javascript
const redBull = new Team('Red Bull', 97);
const mercedes = new Team('Mercedes', 95);

const customDrivers = [
  new Driver('Max Verstappen', redBull, 95, 1),
  new Driver('Lewis Hamilton', mercedes, 93, 44)
];
```
Custom Track
```
const customTrack = new Track('Custom Circuit', 80, 110, 2);
Run a Custom Race

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
```
⚙️ Advanced Configuration
🌦️ Weather Simulation
```
const race = new Race({
  // ... other config
  weather: 'dynamic',
  weatherChanges: [
    { lap: 10, newWeather: 'wet' },
    { lap: 20, newWeather: 'dry' }
  ]
});
```
🛠️ Pit Strategy
```
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
```
```
const race = new Race({
  // ... other config
  pitStrategies: strategies
});
```
🚓 Safety Car Configuration
```
import { SafetyCarSystem } from 'f1-simulator';

SafetyCarSystem.probabilities = {
  normal: 0.03,
  wet: 0.20,
  crash: 0.35
};
```
🧾 Output Example
```
Race Results:
1. Max Verstappen    3089.452s
2. Lewis Hamilton    3092.781s
3. Charles Leclerc   3095.112s
4. Sergio Pérez      DNF
5. Carlos Sainz      3101.334s
```
📚 API Documentation
For full API reference and advanced usage, see the API Docs.
