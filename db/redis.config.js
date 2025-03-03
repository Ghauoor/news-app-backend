import redis from "express-redis-cache"


const redisClient = redis({
    port: process.env.REDIS_PORT,
    host: "localhost",
    prefix: "cache",
    expire: 60 * 60,
})


export default redisClient