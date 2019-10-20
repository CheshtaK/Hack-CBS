// eslint-disable-next-line import/named
import { Login_Info } from '../../models';
import { ForbiddenError, ValidationError } from '../../errors';
import logger from '../../helpers/logger';
import redisClient from '../../helpers/redis-helper';

const { LOGIN_INFO_REDIS } = process.env;

const getLoginInfo = async login_id => {
    let userObj = {};
    await Login_Info.find({
        where: {
            login_id,
        },
    })
        .then(user => {
            if (user) {
                userObj = user.dataValues;
            } else {
                throw new ValidationError([
                    {
                        key: 'IFE002',
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
        .selectAsync(LOGIN_INFO_REDIS)
        .then(result => {
            if (result) {
                logger.info('Login_Info redis database selected', result);
            }
        })
        .catch(err => {
            logger.error(err);
            throw new ForbiddenError();
        });

    for (let i = 0; i < Object.keys(userObj).length; i += 1) {
        if (Array.isArray(userObj[Object.keys(userObj)[i]])) {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                userObj.email,
                Object.keys(userObj)[i],
                JSON.stringify(userObj[Object.keys(userObj)[i]]),
            );
        } else {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                userObj.email,
                Object.keys(userObj)[i],
                userObj[Object.keys(userObj)[i]],
            );
        }
    }
    return Object.keys(userObj).length === 0 ? null : userObj;
};

export default getLoginInfo;
