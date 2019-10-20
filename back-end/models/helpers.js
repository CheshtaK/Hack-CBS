import { ForbiddenError } from '../errors';
import logger from '../helpers/logger';

export const unavailUsername = async (
    // eslint-disable-next-line camelcase
    Unavailable_Usernames,
    username,
    retval,
) => {
    await Unavailable_Usernames.create({
        username,
    })
        .then(usernamePushed => {
            // eslint-disable-next-line no-param-reassign
            retval.username = usernamePushed.dataValues.username;
            // eslint-disable-next-line no-param-reassign
            retval.available = false;
        })
        .catch(err => {
            logger.error(err);
            throw new ForbiddenError();
        });
};

export const checkDBUsername = async (
    User,
    username,
    // eslint-disable-next-line camelcase
    Unavailable_Usernames,
) => {
    const retval = {
        username,
        valid: true,
    };
    await User.findOne({
        where: {
            username,
        },
    })
        .then(async userResult => {
            if (userResult && userResult.dataValues) {
                retval.username = userResult.dataValues.username;
                retval.available = false;
            } else {
                await Unavailable_Usernames.findOne({
                    where: {
                        username,
                    },
                }).then(result => {
                    if (result && result.dataValues) {
                        retval.username = result.dataValues.username;
                        retval.available = false;
                    }
                });
            }
        })
        .catch(err => {
            logger.error(err);
            throw new ForbiddenError();
        });
    return retval;
};
