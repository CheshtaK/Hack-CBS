import redisClient from '../helpers/redis-helper';
import logger from '../helpers/logger';
// eslint-disable-next-line import/named
import getFamilyInfo from './model-helpers/family_info';

const getFamilyInfoLoader = async keys =>
    new Promise(async (resolve, reject) => {
        const familyInfoArray = [];
        for (let j = 0; j < keys.length; j += 1) {
            familyInfoArray.push(getFamilyInfo(keys[j]));
        }
        resolve(familyInfoArray);
    }).catch(error => {
        if (error) {
            logger.error(error);
            reject(error);
        }
    });

export default getFamilyInfoLoader;
