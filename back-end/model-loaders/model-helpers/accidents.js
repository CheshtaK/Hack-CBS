import { ForbiddenError, ValidationError } from '../../errors';
// eslint-disable-next-line import/named
import { Accidents } from '../../models';
import logger from '../../helpers/logger';
import redisClient from '../../helpers/redis-helper';

const { ACCIDENTS_REDIS } = process.env;

const getAccidentHistory = async patient_id => {
    if (!patient_id) {
        throw new ValidationError([
            {
                key: 'IFE003',
                message:
                    'Insufficient arguments, must have patient_id as an argument',
            },
        ]);
    }

    let accidentObj = [];

    await Accidents.findAll({
        where: {
            patient_id,
        },
    })
        .then(result => {
            if (result) {
                accidentObj = result.dataValues;
            } else {
                throw new ValidationError([
                    {
                        key: 'IFE001',
                        message: 'No med and sups exist for this user',
                    },
                ]);
            }
        })
        .catch(err => {
            logger.error(err);
            throw new ForbiddenError();
        });

    await redisClient
        .selectAsync(ACCIDENTS_REDIS)
        .then(result => {
            if (result) {
                logger.info('Med and sups redis database selected', result);
            }
        })
        .catch(err => {
            logger.error(err);
        });
    for (let j = 0; j < accidentObj.length; j += 1) {
        for (let i = 0; i < Object.keys(accidentObj[j]).length; i += 1) {
            if (Array.isArray(accidentObj[j][Object.keys(accidentObj[j])[i]])) {
                // eslint-disable-next-line no-await-in-loop
                await redisClient.hsetAsync(
                    accidentObj[j].patient_id,
                    Object.keys(accidentObj[j]),
                    JSON.stringify(
                        accidentObj[j][Object.keys(accidentObj[j])[i]],
                    ),
                );
            } else {
                // eslint-disable-next-line no-await-in-loop
                await redisClient.hsetAsync(
                    accidentObj[j].patient_id,
                    Object.keys(accidentObj[j])[i],
                    accidentObj[j][Object.keys(accidentObj[j])[i]],
                );
            }
        }
    }

    return accidentObj;
};

export default getAccidentHistory;
