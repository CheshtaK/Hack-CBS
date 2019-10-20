import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';

import redisClient from './redis-helper';
import logger from './logger';

require('dotenv').config();

const secret = process.env.APP_SECRET;
const expiresIn = 2 * 60 * 60;
const issuer = process.env.ISSUER;
const audience = process.env.AUDIENCE;
const { BLACKLIST_REDIS } = process.env;

const signer = args =>
    // eslint-disable-next-line no-unused-vars
    new Promise(async (resolve, reject) => {
        const jwtid = v4();
        const token = jwt.sign(args, secret, {
            expiresIn,
            issuer,
            audience,
            jwtid,
        });
        resolve(token);
    });

const tokenMaker = async data => {
    let jwtToken = null;
    await signer(data).then(async token => {
        jwtToken = token;
    });
    return jwtToken;
};

const blacklistToken = async tokenId =>
    new Promise(async (resolve, reject) => {
        await redisClient
            .selectAsync(BLACKLIST_REDIS)
            .then(status => {
                logger.info('Blacklist Cache Database selected', status);
            })
            .catch(err => {
                logger.error(err);
                reject(err);
            });
        await redisClient
            .hsetAsync(tokenId, 'status', true)
            .then(token => {
                logger.info(`Token ${token} blacklisted`);
                resolve(token);
            })
            .catch(err => {
                logger.error(err);
                reject(err);
            });
    });

const checkBlacklist = async tokenId =>
    new Promise(async (resolve, reject) => {
        await redisClient
            .selectAsync(BLACKLIST_REDIS)
            .then(status => {
                logger.info('Blacklist Cache Database selected', status);
            })
            .catch(err => {
                logger.error(err);
                reject(err);
            });
        await redisClient
            .existsAsync(tokenId)
            .then(async exists => {
                if (exists) {
                    await redisClient
                        .hgetAsync(tokenId, 'status')
                        .then(val => {
                            if (val) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        })
                        .catch(err => {
                            logger.error(err);
                            reject(err);
                        });
                } else {
                    resolve(false);
                }
            })
            .catch(err => {
                logger.error(err);
                reject(err);
            });
    });

const refresherSigner = args =>
    // eslint-disable-next-line no-unused-vars
    new Promise(async (resolve, reject) => {
        const jwtid = v4();
        const token = jwt.sign(args, secret, {
            issuer,
            audience,
            jwtid,
        });
        resolve(token);
    });

const refreshTokenMaker = async data => {
    let jwtToken = null;
    await refresherSigner(data).then(async token => {
        jwtToken = token;
    });
    return jwtToken;
};

const tokenDecryptor = async token => {
    let decodedData = null;
    decodedData = await jwt.verify(token, secret);
    return decodedData;
};

module.exports = {
    tokenMaker,
    tokenDecryptor,
    refreshTokenMaker,
    blacklistToken,
    checkBlacklist,
};
