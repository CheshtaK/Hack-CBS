import winston, { format } from 'winston';

const { combine } = format;

const { NODE_ENV } = process.env;
let level;
let transports;
const colors = {
    verbose: 'yellow',
    error: 'red',
    info: 'cyan',
};

// eslint-disable-next-line default-case
switch (NODE_ENV) {
    case 'development':
        level = 'verbose';
        transports = [
            new winston.transports.Console({
                colorize: true,
            }),
        ];
        break;
    case 'production':
        level = 'verbose';
        transports = [
            new winston.transports.File({
                filename: 'error.log',
                level: 'error',
            }),
            new winston.transports.File({
                filename: 'combined.log',
                level: 'verbose',
            }),
        ];
        break;
}

const enumerateErrorFormat = format(info => {
    if (info.message instanceof Error) {
        // eslint-disable-next-line no-param-reassign
        info.message = Object.assign(
            {
                message: info.message.message,
                stack: info.message.stack,
            },
            info.message,
        );
    }

    if (info instanceof Error) {
        return Object.assign(
            {
                message: info.message,
                stack: info.stack,
            },
            info,
        );
    }

    return info;
});

winston.addColors(colors);
module.exports = winston.createLogger({
    level,
    transports,
    format: combine(
        winston.format.json(),
        winston.format.colorize(),
        enumerateErrorFormat(),
    ),
});
