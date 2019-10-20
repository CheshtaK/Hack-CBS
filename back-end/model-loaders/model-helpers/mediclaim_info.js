import { ForbiddenError, ValidationError } from '../../errors';
// eslint-disable-next-line
import { Comments_Info } from '../../models';
import logger from '../../helpers/logger';
import redisClient from '../../helpers/redis-helper';

const { COMMENTS_INFO_REDIS, USER_REDIS } = process.env;
const { COMMENTS_IDENTIFIER } = process.env;

// eslint-disable-next-line camelcase
const getCommentInfo = async comment_id => {
    // eslint-disable-next-line camelcase
    if (!comment_id) {
        throw new ValidationError([
            {
                key: 'IFE003',
                message:
                    'Insufficient arguments, must have comment_id as an argument',
            },
        ]);
    }

    let commentObj = {};

    await Comments_Info.find({
        where: {
            comment_id,
        },
    })
        .then(result => {
            if (result) {
                commentObj = result.dataValues;
            } else {
                throw new ValidationError([
                    {
                        key: 'IFE001',
                        message: 'No such post exists',
                    },
                ]);
            }
        })
        .catch(err => {
            logger.error(err);
            throw new ForbiddenError();
        });

    await redisClient
        .selectAsync(COMMENTS_INFO_REDIS)
        .then(result => {
            if (result) {
                logger.info('Comment Info redis database selected', result);
            }
        })
        .catch(err => {
            logger.error(err);
        });

    for (let i = 0; i < Object.keys(commentObj).length; i += 1) {
        if (Array.isArray(commentObj[Object.keys(commentObj)[i]])) {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                commentObj.comment_id,
                Object.keys(commentObj)[i],
                JSON.stringify(commentObj[Object.keys(commentObj)[i]]),
            );
        } else {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                commentObj.comment_id,
                Object.keys(commentObj)[i],
                commentObj[Object.keys(commentObj)[i]],
            );
        }
    }

    return Object.keys(commentObj).length === 0 ? null : commentObj;
};

const getCommentsByUser = async email => {
    const comments = [];
    await Comments_Info.findAll({
        where: {
            id: email,
        },
    })
        .then(allComments => {
            if (allComments) {
                for (let i = 0; i < allComments.length; i += 1) {
                    comments.push(allComments[i].dataValues);
                }
            } else {
                throw new ValidationError([
                    {
                        key: 'IFE001',
                        message: 'No such user exists',
                    },
                ]);
            }
        })
        .catch(err => {
            logger.error(err);
            throw new ForbiddenError();
        });
    await redisClient
        .selectAsync(USER_REDIS)
        .then(result => {
            if (result) {
                logger.info('User redis database selected', result);
            }
        })
        .catch(err => {
            logger.error(err);
            throw new ForbiddenError();
        });

    for (let i = 0; i < comments.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await redisClient.saddAsync(
            email + COMMENTS_IDENTIFIER,
            comments[i].comment_id,
        );
    }
    return comments;
};

export { getCommentInfo, getCommentsByUser };
