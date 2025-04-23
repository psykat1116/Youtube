import Mux from "@mux/mux-node";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle(process.env.DATABASE_URL!);

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10s"),
  prefix: "@upstash/ratelimit",
  analytics: true,
});

export const mux = new Mux({
  tokenId: process.env.MUX_TOKEN,
  tokenSecret: process.env.MUX_SECRET_KEY,
});
