import {redis} from "../infra/redis";

/**
 * Increment key with TTL using a Lua script and return whether it exceeded 'limit'
 * @returns true if limit exceeded
 */
export async function rateLimitHit(key: string, limit: number, windowSec: number) {
    const script = `
    local c = redis.call("INCR", KEYS[1])
    if c == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]) end
    return c
  `;
    const count = await (redis as any).eval(script, 1, key, windowSec);
    return Number(count) > limit;
}