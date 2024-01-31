const log = console.log;
const redis = require('redis');
const { parse } = require('url');
const REDISURI = process.env['REDIS_CLOUD_URI'];

const redisUrl = parse(REDISURI);
log(redisUrl.href);

//log(redisUrl);
module.exports.setToRedis = async function(key, data, expiry) {
	  // Establish connection
	  const redisClient = redis.createClient({
	    url: redisUrl.href
	  });

	  redisClient.on('error', err => console.log('Redis Client Error', err));
	  await redisClient.connect();
	  log(redisClient.isReady);
	  log(redisClient.isOpen);

	  // Set data to redis
	   await redisClient.set(key, data);
	   await redisClient.expire(key, expiry);
}

module.exports.getFromRedis = async function(key) {
	  const redisClient = redis.createClient({
	    url: redisUrl.href
	  });
	  redisClient.on('error', err => console.log('Redis Client Error', err));
	  await redisClient.connect();
	  log(redisClient.isReady);
	  log(redisClient.isOpen);

	  // Get data from redis
	   const getCache = await redisClient.get(key);
	   log("from redis");
	   log(getCache);
	   return getCache;
}
