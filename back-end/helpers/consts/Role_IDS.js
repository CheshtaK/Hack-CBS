// eslint-disable-next-line camelcase
const getRoleIDS = Roles =>
    new Promise(async (resolve, reject) => {
        await Roles.findAll()
            .then(result => {
                const resultList = {};

                for (let i = 0; i < result.length; i += 1) {
                    resultList[result[i].dataValues.role_description] =
                        result[i].dataValues.role_id;
                }
                resolve(resultList);
            })
            .catch(err => {
                reject(err);
            });
    });

module.exports = getRoleIDS;
