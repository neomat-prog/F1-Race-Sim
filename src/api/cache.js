import { LRUCache } from 'lru-cache';

export const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 15 // 15 minutes
});