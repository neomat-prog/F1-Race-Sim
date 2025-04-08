import fetch from 'node-fetch';
import { cache } from './cache.js';

export class F1Client {
  static async getSessionKey(circuit, year, session) {
    const url = `https://api.openf1.org/v1/sessions?circuit_short_name=${circuit}&year=${year}&session_name=${session}`;
    
    if (cache.has(url)) return cache.get(url);
    
    const response = await fetch(url);
    const data = await response.json();
    const sessionKey = data[0]?.session_key;
    
    if (sessionKey) {
      cache.set(url, sessionKey);
      return sessionKey;
    }
    
    throw new Error('Session not found');
  }

  static async getDrivers(sessionKey) {
    const url = `https://api.openf1.org/v1/drivers?session_key=${sessionKey}`;
    
    if (cache.has(url)) return cache.get(url);
    
    const response = await fetch(url);
    const data = await response.json();
    const drivers = data.map(d => ({
      name: d.full_name,
      number: d.driver_number,
      team: d.team_name
    }));
    
    cache.set(url, drivers);
    return drivers;
  }
}