const { readFile } = require('fs');
const { join } = require('path');

module.exports = (file, db) => ({
    up() {
        return new Promise((res, rej) => {
            readFile(
                join(__dirname, '../migrations', file),
                'utf8',
                // eslint-disable-next-line consistent-return
                (err, sql) => {
                    if (err) return rej(err);
                    db.sequelize
                        .query(sql, { raw: true })
                        .then(res)
                        .catch(rej);
                },
            );
        });
    },
    down: () => db.sequelize.dropAllSchemas(),
});
