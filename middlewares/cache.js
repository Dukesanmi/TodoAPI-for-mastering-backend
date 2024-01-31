const log = console.log;
const { getFromRedis } = require('../config/redis');

exports.tasksCache = async function(req, res, next) {
	const page = parseInt(req.query.page);

	const key = `page ${page}`;
    const getCache = await getFromRedis(key);
    const parsedTasks = JSON.parse(getCache);

    if (getCache !== null) {
    	log("Fetched from cache");
    	res.status(200).json({status: 200, cache: true, tasks: parsedTasks});
    } else {
    	next();
    }
}