/* eslint-disable */
import Sequelize from 'sequelize';

require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

module.exports = function() {
    return new Sequelize(
        config.database,
        config.username,
        config.password,
        config,
    );
};
