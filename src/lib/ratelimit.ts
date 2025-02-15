import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const ratelimit = {
  room: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    prefix: '@bg/room',
  }),
  message: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(20, '10 s'),
    prefix: '@bg/message',
  }),
  move: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    prefix: '@bg/move',
  }),
}; 