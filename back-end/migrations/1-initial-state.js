const { readFile } = require('fs');

module.exports = {
    up(migration) {
        return new Promise((res, rej) => {
            readFile('sql/initial-state.sql', 'utf8', (err, sql) => {
                if (err) return rej(err);
                migration.sequelize
                    .query(sql, { raw: true })
                    .then(res)
                    .catch(rej);
            });
        });
    },
    down: migration => migration.dropAllTables(),
};
