import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const modelPath = path.join(__dirname, '../models');

const hasUpperCase = str => /[A-Z]/.test(str);

module.exports = sequelize => {
    const db = {};
    fs.readdirSync(modelPath)
        .filter(file => file.indexOf('.') === -1 && !hasUpperCase(file))
        .forEach(folder => {
            const model = sequelize.import(
                path.join(modelPath, folder, 'index.js'),
            );
            db[model.name] = model;
        });
    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    return db;
};
