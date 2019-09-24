import redis from "redis";
import Promise from "bluebird";

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient(process.env.REDIS_URL);

export default redisClient;
