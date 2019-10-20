import { ForbiddenError, ValidationError } from '../../errors';
// eslint-disable-next-line
import { Personal_History } from '../../models';
import logger from '../../helpers/logger';
import redisClient from '../../helpers/personal-history';

const { PERSONAL_HISTORY_REDIS } = process.env;

// eslint-disable-next-line camelcase
const getPersonalHistory = async patient_id => {
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

    let historyObj = {};

    await Personal_History.find({
        where: {
            patient_id,
        },
    })
        .then(result => {
            if (result) {
                historyObj = result.dataValues;
            } else {
                throw new ValidationError([
                    {
                        key: 'IFE001',
                        message: 'Personal history for patient does not exist',
                    },
                ]);
            }
        })
        .catch(err => {
            logger.error(err);
            throw new ForbiddenError();
        });

    await redisClient
        .selectAsync(PERSONAL_HISTORY_REDIS)
        .then(result => {
            if (result) {
                logger.info('Personal history redis database selected', result);
            }
        })
        .catch(err => {
            logger.error(err);
        });

    for (let i = 0; i < Object.keys(historyObj).length; i += 1) {
        if (Array.isArray(historyObj[Object.keys(historyObj)[i]])) {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                historyObj.patient_id,
                Object.keys(historyObj)[i],
                JSON.stringify(historyObj[Object.keys(historyObj)[i]]),
            );
        } else {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                historyObj.patient_id,
                Object.keys(historyObj)[i],
                historyObj[Object.keys(historyObj)[i]],
            );
        }
    }

    return Object.keys(historyObj).length === 0 ? null : historyObj;
};

export default getPersonalHistory;
