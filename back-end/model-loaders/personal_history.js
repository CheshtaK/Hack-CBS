import logger from '../helpers/logger';
// eslint-disable-next-line import/named
import getPersonalHistory from './model-helpers/personal_history';

const getFetchedPostsLoader = async keys =>
    new Promise(async (resolve, reject) => {
        const postArray = [];
        for (let j = 0; j < keys.length; j += 1) {
            // eslint-disable-next-line no-await-in-loop
            postArray.push(getPersonalHistory(keys[j]));
        }
        resolve(postArray);
    }).catch(error => {
        if (error) {
            logger.error(error);
            reject(error);
        }
    });

export default getFetchedPostsLoader;
