const { writeFile } = require('fs');
const models = require('../models');
const logger = require('./logger');

// eslint-disable-next-line consistent-return
async function createTables() {
    const sqlLines = [];
    const { NODE_ENV } = process.env;
    if (!['development', 'test'].includes(NODE_ENV)) {
        return Promise.reject();
    }
    const modelKeys = [
        'Patient_Info',
        'Relation_Info',
        'Family_Info',
        'Personal_History',
        'Medications_Supplements',
        'Accidents',
        'Surgery_Hospitalization',
        'Roles',
        'Login_Info',
        'Mediclaim_Info',
    ];
    // eslint-disable-next-line no-restricted-syntax
    for (const modelKey of modelKeys) {
        // eslint-disable-next-line no-await-in-loop
        await models[modelKey].sync({
            force: true,
            logging: message => {
                let line = message.replace('Executing (default): ', '').trim();
                if (line.substr(-1) !== ';') {
                    line += ';';
                }
                sqlLines.push(line);
            },
        });
    }

    const sql = sqlLines.join('\n');
    writeFile('./migrations/initial-state.sql', sql, err => {
        if (err) logger.error(err);
        models.sequelize.close();
    });
}

createTables();
