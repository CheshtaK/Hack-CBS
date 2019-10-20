import getPatientInfo from './model-helpers/patient_info';

const getPatientInfoLoader = async keys =>
    new Promise(async (resolve, reject) => {
        const patientInfo = [];
        for (let i = 0; i < keys.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            patientInfo.push(await getPatientInfo(keys[i]));
        }
        resolve(patientInfo);
    });

export default getPatientInfoLoader;
