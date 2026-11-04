import Redis from "ioredis"

export interface DownloadLimitResult {
  allowed: boolean
  count: number
  max: number
  remaining: number
  is_exhausted: boolean
  is_resumed_session?: boolean
}

export class DownloadLimiter {
  private static instance: DownloadLimiter | null = null
  private redis: Redis | null = null
  private inMemoryStore: Map<string, { count: number; expiresAt: number }> = new Map()
  private sessionStore: Map<string, number> = new Map()
  private isRedisAvailable: boolean = false
  private connectionLogged: boolean = false

  // Lua script for atomic check and increment with Idempotent Download Window (15-minute safe window):
  // KEYS[1]: Redis rate limit key (counter)
  // KEYS[2]: Redis active download session key
  // ARGV[1]: max downloads allowed (default: 5)
  // ARGV[2]: TTL for quota in seconds (default: 15552000 = 180 days)
  // ARGV[3]: Session window in seconds (default: 900 = 15 minutes)
  // Trả về: {allowed (0|1), count, is_resumed (0|1)}
  private readonly LUA_SCRIPT = `
    local dl_key = KEYS[1]
    local session_key = KEYS[2]
    local max_downloads = tonumber(ARGV[1])
    local ttl = tonumber(ARGV[2])
    local session_ttl = tonumber(ARGV[3])

    -- 1. Nếu session tải an toàn vẫn đang hoạt động (trong vòng session_ttl = 15 phút),
    -- tuyệt đối không trừ thêm lượt tải mới! Trả về allowed = 1, current count, is_resumed = 1
    if session_ttl > 0 and redis.call('exists', session_key) == 1 then
      local current = tonumber(redis.call('get', dl_key) or '1')
      return {1, current, 1}
    end

    -- 2. Nếu session đã hết hạn hoặc lần đầu tải, kiểm tra trần quota
    local current = tonumber(redis.call('get', dl_key) or '0')
    if current >= max_downloads then
      return {0, current, 0}
    end

    -- 3. Trừ 1 lượt tải trong counter
    local new_count = redis.call('incr', dl_key)
    if new_count == 1 then
      redis.call('expire', dl_key, ttl)
    end

    -- 4. Kích hoạt Cửa sổ Tải an toàn (Session Key) nếu session_ttl > 0
    if session_ttl > 0 then
      redis.call('set', session_key, '1', 'EX', session_ttl)
    end

    return {1, new_count, 0}
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

  public getSessionKey(orderId: string, assetId: string): string {
    return `digital_asset:session:${orderId}:${assetId}`
  }

  /**
   * Atomic check and increment for a download attempt with Idempotent Download Window.
   * - Nếu khách tải lại trong cửa sổ an toàn (mặc định 15 phút), không trừ lượt mới.
   * - Nếu hết hạn hoặc lần đầu tải, trừ 1 lượt trong quota (tối đa 5).
   */
  public async checkAndIncrement(
    orderId: string,
    assetId: string,
    max: number = 5,
    ttl: number = 180 * 24 * 60 * 60, // 180 days in seconds
    sessionWindowSeconds: number = 15 * 60 // 15 minutes safe download window
  ): Promise<DownloadLimitResult> {
    const key = this.getKey(orderId, assetId)
    const sessionKey = this.getSessionKey(orderId, assetId)

    if (this.isRedisAvailable && this.redis) {
      try {
        const result = (await this.redis.eval(
          this.LUA_SCRIPT,
          2,
          key,
          sessionKey,
          max.toString(),
          ttl.toString(),
          sessionWindowSeconds.toString()
        )) as [number, number, number]

        const allowed = result[0] === 1
        const count = Number(result[1])
        const isResumed = result[2] === 1
        const remaining = Math.max(0, max - count)

        return {
          allowed,
          count,
          max,
          remaining,
          is_exhausted: count >= max,
          is_resumed_session: isResumed,
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

    // Kiểm tra session tải an toàn trong bộ nhớ nếu sessionWindowSeconds > 0
    if (sessionWindowSeconds > 0) {
      const sessionExpiresAt = this.sessionStore.get(sessionKey) || 0
      if (sessionExpiresAt > now) {
        // Trong cửa sổ 15 phút: Tuyệt đối không trừ thêm lượt tải mới!
        return {
          allowed: true,
          count: current || 1,
          max,
          remaining: Math.max(0, max - (current || 1)),
          is_exhausted: (current || 1) >= max,
          is_resumed_session: true,
        }
      }
    }

    if (current >= max) {
      return {
        allowed: false,
        count: current,
        max,
        remaining: 0,
        is_exhausted: true,
        is_resumed_session: false,
      }
    }

    const newCount = current + 1
    this.inMemoryStore.set(key, {
      count: newCount,
      expiresAt: now + ttl * 1000,
    })
    // Thiết lập session key 15 phút nếu sessionWindowSeconds > 0
    if (sessionWindowSeconds > 0) {
      this.sessionStore.set(sessionKey, now + sessionWindowSeconds * 1000)
    }

    return {
      allowed: true,
      count: newCount,
      max,
      remaining: Math.max(0, max - newCount),
      is_exhausted: newCount >= max,
      is_resumed_session: false,
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
      const sessionPrefix = `digital_asset:session:${orderId}:`

      for (const k of Array.from(this.inMemoryStore.keys())) {
        if (k.startsWith(prefix)) {
          this.inMemoryStore.delete(k)
        }
      }
      for (const k of Array.from(this.sessionStore.keys())) {
        if (k.startsWith(sessionPrefix)) {
          this.sessionStore.delete(k)
        }
      }

      if (this.isRedisAvailable && this.redis) {
        try {
          // Sử dụng scanStream không chặn (non-blocking) thay vì redis.keys để an toàn cho Redis production
          const scanAndDelete = (matchPattern: string) => {
            return new Promise<void>((resolve) => {
              if (!this.redis) return resolve()
              const stream = this.redis.scanStream({ match: matchPattern, count: 100 })
              stream.on("data", async (keys: string[]) => {
                if (keys.length > 0 && this.redis) {
                  stream.pause()
                  await this.redis.del(...keys).catch(() => {})
                  stream.resume()
                }
              })
              stream.on("end", () => resolve())
              stream.on("error", () => resolve())
            })
          }

          await Promise.all([
            scanAndDelete(`${prefix}*`),
            scanAndDelete(`${sessionPrefix}*`),
          ])
        } catch (err: any) {
          this.isRedisAvailable = false
        }
      }
      return
    }

    const key = this.getKey(orderId, assetId)
    const sessionKey = this.getSessionKey(orderId, assetId)
    this.inMemoryStore.delete(key)
    this.sessionStore.delete(sessionKey)

    if (this.isRedisAvailable && this.redis) {
      try {
        await this.redis.del(key, sessionKey)
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
