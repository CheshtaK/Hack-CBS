import { ForbiddenError, ValidationError } from '../../errors';
// eslint-disable-next-line
import { Family_Info } from '../../models';
import logger from '../../helpers/logger';
import redisClient from '../../helpers/redis-helper';

const { FAMILY_INFO_REDIS } = process.env;
// const { FAMILY_INFO_IDENTIFIER } = process.env;
// eslint-disable-next-line camelcase
const getFamilyInfo = async patient_id => {
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

    let familyObj = {};

    await Family_Info.find({
        where: {
            patient_id,
        },
    })
        .then(result => {
            if (result) {
                familyObj = result.dataValues;
            } else {
                throw new ValidationError([
                    {
                        key: 'IFE001',
                        message: 'No such family_info exists',
                    },
                ]);
            }
        })
        .catch(err => {
            logger.error(err);
            throw new ForbiddenError();
        });

    await redisClient
        .selectAsync(FAMILY_INFO_REDIS)
        .then(result => {
            if (result) {
                logger.info('Family Info redis database selected', result);
            }
        })
        .catch(err => {
            logger.error(err);
        });

    for (let i = 0; i < Object.keys(familyObj).length; i += 1) {
        if (Array.isArray(familyObj[Object.keys(familyObj)[i]])) {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                familyObj.post_id,
                Object.keys(familyObj)[i],
                JSON.stringify(familyObj[Object.keys(familyObj)[i]]),
            );
        } else {
            // eslint-disable-next-line no-await-in-loop
            await redisClient.hsetAsync(
                familyObj.post_id,
                Object.keys(familyObj)[i],
                familyObj[Object.keys(familyObj)[i]],
            );
        }
    }

    return Object.keys(familyObj).length === 0 ? null : familyObj;
};

export default getFamilyInfo;
