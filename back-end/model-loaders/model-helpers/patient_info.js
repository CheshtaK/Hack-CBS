import { ForbiddenError, ValidationError } from '../../errors';
// eslint-disable-next-line
import { Patient_Info } from '../../models';
import logger from '../../helpers/logger';
import redisClient from '../../helpers/redis-helper';

const { PATIENT_INFO_REDIS } = process.env;
// const { PATIENT_INFO_IDENTIFIER } = process.env;

// eslint-disable-next-line camelcase
const getPatientInfo = async patient_id => {
    // eslint-disable-next-line camelcase
    if (!patient_id) {
        throw new ValidationError([
            {
                key: 'IFE003',
                message:
                    'Insufficient arguments, must have patient_id as an argument',
            },
        ]);
    }

    let patientObj = {};

    await Patient_Info.find({
        where: {
            patient_id,
        },
    })
        .then(result => {
            if (result) {
                patientObj = result.dataValues;
            } else {
                throw new ValidationError([
                    {
                        key: 'IFE001',
                        message: 'No preferences exist for this user',
                    },
                ]);
            }
        })
        .catch(err => {
            logger.error(err);
            throw new ForbiddenError();
        });

    await redisClient
        .selectAsync(PATIENT_INFO_REDIS)
        .then(result => {
            if (result) {
                logger.info('Patient_Info redis database selected', result);
            }
        })
        .catch(err => {
            logger.error(err);
        });

    for (let i = 0; i < Object.keys(patientObj).length; i += 1) {
        if (Array.isArray(patientObj[Object.keys(patientObj)[i]])) {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                patientObj.patient_id,
                Object.keys(patientObj)[i],
                JSON.stringify(patientObj[Object.keys(patientObj)[i]]),
            );
        } else {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                patientObj.patient_id,
                Object.keys(patientObj)[i],
                patientObj[Object.keys(patientObj)[i]],
            );
        }
    }

    return Object.keys(patientObj).length === 0 ? null : patientObj;
};

export default getPatientInfo;
