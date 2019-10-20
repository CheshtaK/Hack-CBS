import buildDb from './build-db';
import decorateDb from './decorate-db';

let db;
module.exports = {
    up: () => {
        if (!db) {
            db = decorateDb(buildDb());
        }
        return db;
    },
    down: async () => {
        await db.sequelize.close();
        db = null;
    },
};
