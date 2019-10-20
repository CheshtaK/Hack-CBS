import redis from 'redis';
import Promise from 'bluebird';
import logger from './logger';
import { ForbiddenError } from '../errors';

require('dotenv').config();

Promise.promisifyAll(redis.RedisClient.prototype);

const { DB_PASSWORD: password } = process.env;
const redisClient = redis.createClient();

redisClient.auth(password, (error, result) => {
    if (error) {
        logger.error(error);
    }
    if (result) {
        logger.info('Server authenticated by password', result);
    }
});

redisClient.on('connect', () => {
    logger.info('Redis successfully connected');
});

redisClient.on('error', err => {
    logger.error('Error encountered in connecting to redis client');
    logger.error(err);
    throw new ForbiddenError();
});

export default redisClient;
