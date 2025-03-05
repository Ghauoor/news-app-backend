export const redisConnection = {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || "localhost",
}


export const defaultQueueConfig = {
    removeOnComplete: {
        count: 100,
        age: 60 * 60 * 24,
    },
    attempts: 3,
    backoff: {
        type: "exponential",
        delay: 1000,
    },
};