// eslint-disable-next-line camelcase
const getRelationIDMap = Relation_Info =>
    new Promise(async (resolve, reject) => {
        Relation_Info.findAll()
            .then(result => {
                const resultList = {};

                for (let i = 0; i < result.length; i += 1) {
                    resultList[result[i].dataValues.relation_name] =
                        result[i].dataValues.relation_id;
                }
                resolve(resultList);
            })
            .catch(err => {
                reject(err);
            });
    });

module.exports = getRelationIDMap();
