import getSurgHos from './model-helpers/surgery_hospitalization';

const getSurgHosLoader = async keys =>
    new Promise(async (resolve, reject) => {
        const commentsForAnswers = [];
        for (let i = 0; i < keys.length; i += 1) {
            commentsForAnswers.push(await getSurgHos(keys[i]));
        }
        resolve(commentsForAnswers);
    });

export default getSurgHosLoader();
