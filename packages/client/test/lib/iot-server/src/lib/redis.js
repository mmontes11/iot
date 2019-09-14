import redis from "redis";
import Promise from "bluebird";
import config from "../config/index";

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient(config.redisUrl);

export default redisClient;
