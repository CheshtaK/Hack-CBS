/* eslint-disable */
const _express = require('express');

const _express2 = _interopRequireDefault(_express);

const logger = require('../helpers/logger');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

const app = (0, _express2.default)();

app.listen(3000, () => {
    logger.info('TalkIt Out started on port 3030');
});
