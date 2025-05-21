import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const ratelimit = {
  room: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    prefix: '@bg/room',
  }),
  message: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '10 s'),
    prefix: '@bg/message',
  }),
  move: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    prefix: '@bg/move',
  }),
};
