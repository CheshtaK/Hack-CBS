import getAccidentHistory from './model-helpers/accidents';

const getAccidentsForPatients = async keys =>
    new Promise(async (resolve, reject) => {
        const accidentsForPatients = [];
        for (let i = 0; i < keys.length; i += 1) {
            accidentsForPatients.push(await getAccidentHistory(keys[i]));
        }
        resolve(accidentsForPatients);
    });

export default getAccidentsForPatients;
