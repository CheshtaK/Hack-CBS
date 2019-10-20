import { ForbiddenError, ValidationError } from '../../errors';
// eslint-disable-next-line
import { Insurer_Info } from '../../models';
import logger from '../../helpers/logger';
import redisClient from '../../helpers/redis-helper';

const { INSURER_INFO_REDIS } = process.env;

const getInsurerInfo = async insurer_id => {
    if (!insurer_id) {
        throw new ValidationError([
            {
                key: 'IFE003',
                message:
                    'Insufficient arguments, must have insurer_id as an argument',
            },
        ]);
    }

    let insurerObj = {};

    await Insurer_Info.findAll({
        where: {
            insurer_id,
        },
    })
        .then(result => {
            if (result) {
                insurerObj = result.dataValues;
            } else {
                throw new ValidationError([
                    {
                        key: 'IFE001',
                        message: 'No insurer exist for this user',
                    },
                ]);
            }
        })
        .catch(err => {
            logger.error(err);
            throw new ForbiddenError();
        });

    await redisClient
        .selectAsync(INSURER_INFO_REDIS)
        .then(result => {
            if (result) {
                logger.info('Insurer info redis database selected', result);
            }
        })
        .catch(err => {
            logger.error(err);
        });

    for (let i = 0; i < Object.keys(insurerObj).length; i += 1) {
        if (Array.isArray(insurerObj[Object.keys(insurerObj)[i]])) {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                insurerObj.insurer_id,
                Object.keys(insurerObj)[i],
                JSON.stringify(insurerObj[Object.keys(insurerObj)[i]]),
            );
        } else {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                insurerObj.insurer_id,
                Object.keys(insurerObj)[i],
                insurerObj[Object.keys(insurerObj)[i]],
            );
        }
    }

    return insurerObj;
};

export default getInsurerInfo;
