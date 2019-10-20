import redisClient from '../helpers/redis-helper';
import logger from '../helpers/logger';
import getUser from './model-helpers/user';
// eslint-disable-next-line import/named
import { getPost, getPostsByUser } from './model-helpers/posts';

const { USER_REDIS, POSTS_REDIS } = process.env;
const { POSTS_IDENTIFIER } = process.env;

const getUserLoader = keys =>
    new Promise(async (resolve, reject) => {
        const userArray = [];
        await redisClient
            .selectAsync(USER_REDIS)
            .then(result => {
                if (result) {
                    logger.info('User redis database selected', result);
                }
            })
            .catch(err => {
                logger.error(err);
                reject(err);
            });
        for (let j = 0; j < keys.length; j += 1) {
            // eslint-disable-next-line no-await-in-loop
            await redisClient
                .hgetallAsync(keys[j])
                // eslint-disable-next-line no-loop-func
                .then(results => {
                    if (results) {
                        // eslint-disable-next-line no-param-reassign
                        results.confirmed = Boolean(results.confirmed);
                        userArray.push(results);
                    } else {
                        userArray.push(getUser(keys[j]));
                    }
                })
                .catch(error => {
                    if (error) {
                        logger.error(error);
                        reject(error);
                    }
                });
        }
        resolve(userArray);
    });

const getPostsByUserLoader = async keys =>
    new Promise(async (resolve, reject) => {
        const postsForUser = [];
        for (let i = 0; i < keys.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await redisClient
                .selectAsync(USER_REDIS)
                .then(result => {
                    if (result) {
                        logger.info('User redis database selected', result);
                    }
                })
                .catch(err => {
                    logger.error(err);
                    reject(err);
                });
            let postArray = [];
            // eslint-disable-next-line no-await-in-loop
            await redisClient
                .existsAsync(keys[i] + POSTS_IDENTIFIER)
                .then(async result => {
                    if (result) {
                        logger.info(`User ${keys[i]} has made some posts`);
                        await redisClient
                            .smembersAsync(keys[i] + POSTS_IDENTIFIER)
                            // eslint-disable-next-line camelcase
                            .then(async post_ids => {
                                await redisClient
                                    .selectAsync(POSTS_REDIS)
                                    .then(selectResult => {
                                        if (result) {
                                            logger.info(
                                                'Posts redis database selected',
                                                selectResult,
                                            );
                                        }
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                                for (let j = 0; j < post_ids.length; j += 1) {
                                    // eslint-disable-next-line no-await-in-loop
                                    await redisClient
                                        .hgetallAsync(post_ids[j])
                                        // eslint-disable-next-line no-loop-func
                                        .then(async results => {
                                            if (results) {
                                                for (
                                                    let k = 0;
                                                    k <
                                                    Object.keys(results).length;
                                                    k += 1
                                                ) {
                                                    try {
                                                        // eslint-disable-next-line no-param-reassign
                                                        results[
                                                            Object.keys(
                                                                results,
                                                            )[k]
                                                        ] = JSON.parse(
                                                            results[
                                                                Object.keys(
                                                                    results,
                                                                )[k]
                                                            ],
                                                        );
                                                    } catch (err) {
                                                        logger.error(err);
                                                    }
                                                }
                                                postArray.push(results);
                                            } else {
                                                postArray.push(
                                                    await getPost(post_ids[j]),
                                                );
                                            }
                                        })
                                        .catch(error => {
                                            if (error) {
                                                logger.error(error);
                                                reject(error);
                                            }
                                        });
                                }
                            });
                    } else {
                        postArray = await getPostsByUser(keys[i]);
                    }
                });
            postsForUser.push(postArray);
        }
        resolve(postsForUser);
    });

export { getUserLoader, getPostsByUserLoader };
