import { ForbiddenError, ValidationError } from '../../errors';
// eslint-disable-next-line
import { Surgery_Hospitalization } from '../../models';
import logger from '../../helpers/logger';
import redisClient from '../../helpers/redis-helper';

const { SURGERY_HOSPITALIZATION_REDIS } = process.env;

const getSurgHos = async patient_id => {
    if (!patient_id) {
        throw new ValidationError([
            {
                key: 'IFE003',
                message:
                    'Insufficient arguments, must have patient_id as an argument',
            },
        ]);
    }

    let surgHosObj = {};

    await Surgery_Hospitalization.findAll({
        where: {
            patient_id,
        },
    })
        .then(result => {
            if (result) {
                surgHosObj = result.dataValues;
            } else {
                throw new ValidationError([
                    {
                        key: 'IFE001',
                        message: 'No surg and hosps exist for this user',
                    },
                ]);
            }
        })
        .catch(err => {
            logger.error(err);
            throw new ForbiddenError();
        });

    await redisClient
        .selectAsync(SURGERY_HOSPITALIZATION_REDIS)
        .then(result => {
            if (result) {
                logger.info('surg and hosps redis database selected', result);
            }
        })
        .catch(err => {
            logger.error(err);
        });

    for (let i = 0; i < Object.keys(surgHosObj).length; i += 1) {
        if (Array.isArray(surgHosObj[Object.keys(surgHosObj)[i]])) {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                surgHosObj.patient_id,
                Object.keys(surgHosObj)[i],
                JSON.stringify(surgHosObj[Object.keys(surgHosObj)[i]]),
            );
        } else {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                surgHosObj.patient_id,
                Object.keys(surgHosObj)[i],
                surgHosObj[Object.keys(surgHosObj)[i]],
            );
        }
    }

    return surgHosObj;
};

export default getSurgHos;
