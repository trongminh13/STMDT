import Redis from "ioredis"

export interface DownloadLimitResult {
  allowed: boolean
  count: number
  max: number
  remaining: number
  is_exhausted: boolean
}

export class DownloadLimiter {
  private static instance: DownloadLimiter | null = null
  private redis: Redis | null = null
  private inMemoryStore: Map<string, { count: number; expiresAt: number }> = new Map()
  private isRedisAvailable: boolean = false
  private connectionLogged: boolean = false

  // Lua script for atomic check and increment:
  // KEYS[1]: Redis rate limit key
  // ARGV[1]: max downloads allowed (default: 5)
  // ARGV[2]: TTL in seconds (default: 15552000 = 180 days)
  private readonly LUA_SCRIPT = `
    local key = KEYS[1]
    local max_downloads = tonumber(ARGV[1])
    local ttl = tonumber(ARGV[2])

    local current = tonumber(redis.call('get', key) or '0')
    if current >= max_downloads then
      return {0, current}
    end

    local new_count = redis.call('incr', key)
    if new_count == 1 then
      redis.call('expire', key, ttl)
    end
    return {1, new_count}
  `

  private constructor() {
    this.initRedis()
  }

  public static getInstance(): DownloadLimiter {
    if (!DownloadLimiter.instance) {
      DownloadLimiter.instance = new DownloadLimiter()
    }
    return DownloadLimiter.instance
  }

  private initRedis() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"
    try {
      this.redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        retryStrategy: () => null, // Do not hang on reconnection attempts if Redis is down
        lazyConnect: true,
        enableOfflineQueue: false,
      })

      this.redis.connect()
        .then(() => {
          this.isRedisAvailable = true
          if (!this.connectionLogged) {
            console.log("[DownloadLimiter] Connected to Redis successfully.")
            this.connectionLogged = true
          }
        })
        .catch((err) => {
          this.isRedisAvailable = false
          if (!this.connectionLogged) {
            console.warn(`[DownloadLimiter] Redis connection warning: ${err.message}. Using in-memory fallback.`)
            this.connectionLogged = true
          }
        })

      this.redis.on("error", (err) => {
        this.isRedisAvailable = false
        if (!this.connectionLogged) {
          console.warn(`[DownloadLimiter] Redis error: ${err.message}. Falling back to in-memory store.`)
          this.connectionLogged = true
        }
      })
    } catch (err: any) {
      this.isRedisAvailable = false
      console.warn(`[DownloadLimiter] Failed to initialize Redis client: ${err?.message}`)
    }
  }

  public getKey(orderId: string, assetId: string): string {
    return `digital_asset:dl:${orderId}:${assetId}`
  }

  /**
   * Atomic check and increment for a download attempt.
   * If current downloads < max, increments count and returns allowed = true.
   * Otherwise returns allowed = false with remaining = 0.
   */
  public async checkAndIncrement(
    orderId: string,
    assetId: string,
    max: number = 5,
    ttl: number = 180 * 24 * 60 * 60 // 180 days in seconds
  ): Promise<DownloadLimitResult> {
    const key = this.getKey(orderId, assetId)

    if (this.isRedisAvailable && this.redis) {
      try {
        const result = (await this.redis.eval(
          this.LUA_SCRIPT,
          1,
          key,
          max.toString(),
          ttl.toString()
        )) as [number, number]

        const allowed = result[0] === 1
        const count = Number(result[1])
        const remaining = Math.max(0, max - count)

        return {
          allowed,
          count,
          max,
          remaining,
          is_exhausted: count >= max,
        }
      } catch (err: any) {
        console.warn(`[DownloadLimiter] Redis eval failed, falling back to in-memory: ${err?.message}`)
        this.isRedisAvailable = false
      }
    }

    // In-memory fallback
    const now = Date.now()
    const item = this.inMemoryStore.get(key)
    let current = 0

    if (item && item.expiresAt > now) {
      current = item.count
    }

    if (current >= max) {
      return {
        allowed: false,
        count: current,
        max,
        remaining: 0,
        is_exhausted: true,
      }
    }

    const newCount = current + 1
    this.inMemoryStore.set(key, {
      count: newCount,
      expiresAt: now + ttl * 1000,
    })

    return {
      allowed: true,
      count: newCount,
      max,
      remaining: Math.max(0, max - newCount),
      is_exhausted: newCount >= max,
    }
  }

  /**
   * Read-only stats query (Inspect Mode).
   * Does NOT increment count or consume download quotas.
   */
  public async getStats(
    orderId: string,
    assetId: string,
    max: number = 5
  ): Promise<DownloadLimitResult> {
    const key = this.getKey(orderId, assetId)

    if (this.isRedisAvailable && this.redis) {
      try {
        const currentStr = await this.redis.get(key)
        const count = currentStr ? parseInt(currentStr, 10) : 0
        const remaining = Math.max(0, max - count)

        return {
          allowed: count < max,
          count,
          max,
          remaining,
          is_exhausted: count >= max,
        }
      } catch (err: any) {
        this.isRedisAvailable = false
      }
    }

    // In-memory fallback
    const now = Date.now()
    const item = this.inMemoryStore.get(key)
    let count = 0
    if (item && item.expiresAt > now) {
      count = item.count
    }

    return {
      allowed: count < max,
      count,
      max,
      remaining: Math.max(0, max - count),
      is_exhausted: count >= max,
    }
  }

  /**
   * Reset stats for CSKH Admin or Order Cancellation/Refund.
   */
  public async resetStats(orderId: string, assetId: string = "*"): Promise<void> {
    if (assetId === "*") {
      const prefix = `digital_asset:dl:${orderId}:`
      for (const k of Array.from(this.inMemoryStore.keys())) {
        if (k.startsWith(prefix)) {
          this.inMemoryStore.delete(k)
        }
      }

      if (this.isRedisAvailable && this.redis) {
        try {
          const keys = await this.redis.keys(`${prefix}*`)
          if (keys.length > 0) {
            await this.redis.del(...keys)
          }
        } catch (err: any) {
          this.isRedisAvailable = false
        }
      }
      return
    }

    const key = this.getKey(orderId, assetId)
    this.inMemoryStore.delete(key)

    if (this.isRedisAvailable && this.redis) {
      try {
        await this.redis.del(key)
      } catch (err: any) {
        this.isRedisAvailable = false
      }
    }
  }

  /**
   * Cleanly close connection.
   */
  public async disconnect(): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.quit()
      } catch {
        // ignore
      }
      this.redis = null
      this.isRedisAvailable = false
    }
  }
}

export const downloadLimiter = DownloadLimiter.getInstance()
