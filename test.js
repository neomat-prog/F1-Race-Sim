const { Track, Team, Driver, Race, defaultDrivers, defaultTracks } = require('./index.js');

(async () => {
  const race = new Race({
    track: defaultTracks[0], // Monaco
    drivers: defaultDrivers,
    sessionKey: 9159, // Replace with a valid session key
  });

  // Initialize with API data
  await race.initialize();

  // Run simulation
  const results = race.simulate();
  console.log(JSON.stringify(results, null, 2));
})();