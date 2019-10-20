// eslint-disable-next-line camelcase
const getInsurerPatientMap = Patient_Insurer =>
    new Promise(async (resolve, reject) => {
        await Patient_Insurer.findAll()
            .then(result => {
                const resultList = {};

                for (let i = 0; i < result.length; i += 1) {
                    if (
                        // eslint-disable-next-line
                        !resultList.hasOwnProperty(result[i].dataValues.insurer_id)){
                        resultList[result[i].dataValues.insurer_id] = [];
                    }
                    resultList[result[i].dataValues.insurer_id].push(
                        result[i].dataValues.insurer_id,
                    );
                }
                resolve(resultList);
            })
            .catch(err => {
                reject(err);
            });
    });

module.exports = getInsurerPatientMap;
