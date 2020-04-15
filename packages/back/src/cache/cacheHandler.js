import redis from "../lib/redis";
import { logInfo } from "../utils/log";

const setObjectCache = (key, objectValue, expireTimeInSeconds = process.env.DEFAULT_CACHE_IN_SECONDS) => {
  const objectString = JSON.stringify(objectValue);
  logInfo(`Redis set key '${key}': ${objectString}`);
  redis.set(key, objectString);
  logInfo(`Redis expire '${key}': ${expireTimeInSeconds}`);
  redis.expire(key, expireTimeInSeconds);
};

const getObjectCache = async key => {
  try {
    const cachedRawObject = await redis.getAsync(key);
    logInfo(`Redis get '${key}': ${cachedRawObject}`);
    return JSON.parse(cachedRawObject);
  } catch (err) {
    throw err;
  }
};

export default { setObjectCache, getObjectCache };
