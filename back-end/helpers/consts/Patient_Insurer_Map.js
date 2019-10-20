// eslint-disable-next-line camelcase
const getPatientInsurerMap = Patient_Insurer =>
    new Promise(async (resolve, reject) => {
        await Patient_Insurer.findAll()
            .then(result => {
                const resultList = {};

                for (let i = 0; i < result.length; i += 1) {
                    resultList[result[i].dataValues.patient_id] =
                        result[i].dataValues.insurer_id;
                }
                resolve(resultList);
            })
            .catch(err => {
                reject(err);
            });
    });

module.exports = getPatientInsurerMap;
