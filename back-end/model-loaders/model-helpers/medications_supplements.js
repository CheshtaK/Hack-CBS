import { ForbiddenError, ValidationError } from '../../errors';
// eslint-disable-next-line import/named
import { Medications_Supplements } from '../../models';
import logger from '../../helpers/logger';
import redisClient from '../../helpers/redis-helper';

const { MEDICATIONS_SUPPLEMENTS_REDIS } = process.env;

const getMedSup = async patient_id => {
    if (!patient_id) {
        throw new ValidationError([
            {
                key: 'IFE003',
                message:
                    'Insufficient arguments, must have patient_id as an argument',
            },
        ]);
    }

    let medSupObj = {};

    await Medications_Supplements.findAll({
        where: {
            patient_id,
        },
    })
        .then(result => {
            if (result) {
                medSupObj = result.dataValues;
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
        .selectAsync(MEDICATIONS_SUPPLEMENTS_REDIS)
        .then(result => {
            if (result) {
                logger.info('Med and sups redis database selected', result);
            }
        })
        .catch(err => {
            logger.error(err);
        });

    for (let i = 0; i < Object.keys(medSupObj).length; i += 1) {
        if (Array.isArray(medSupObj[Object.keys(medSupObj)[i]])) {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                medSupObj.patient_id,
                Object.keys(medSupObj)[i],
                JSON.stringify(medSupObj[Object.keys(medSupObj)[i]]),
            );
        } else {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                medSupObj.patient_id,
                Object.keys(medSupObj)[i],
                medSupObj[Object.keys(medSupObj)[i]],
            );
        }
    }

    return medSupObj;
};

export default getMedSup;
