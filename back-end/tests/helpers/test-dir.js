import { readdirSync } from 'fs';
import { join, resolve } from 'path';

const root = resolve(join(__dirname, '../'));

module.exports = dir => {
    const files = readdirSync(`${root}/${dir}`);
    files.forEach(file =>
        // eslint-disable-next-line
        require(join(root, dir, file))
    );
};
