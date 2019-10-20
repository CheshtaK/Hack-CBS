import { describe, before, after } from 'mocha';
import { up } from '../../helpers/db';
import { start, stop } from '../../helpers/server';
import testDir from '../helpers/test-dir';
import runMigration from '../helpers/migration';

let db;
let migrate;
describe('integration tests', () => {
    before(async () => {
        db = up();
        migrate = runMigration(db);
        await migrate.down();
        await migrate.up();
        await start({ db });
    });

    ['db', 'graphql'].forEach(dir => testDir(`integration/${dir}`));
    after(async () => {
        await migrate.down();
        await stop();
    });
});

module.exports = () => db;