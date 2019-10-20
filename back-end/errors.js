/* @flow */

import Rollbar from 'rollbar';
import type { ValidationErrorEntry } from './types';

const rollbar = new Rollbar({
    accessToken: 'e4fb7d06a2ff40f884d8f0997448017c',
    captureUncaught: true,
    captureUnhandledRejections: true,
});

const report = (error: Error) => {
    rollbar.error(error);
};

export class ValidationError extends Error {
    code = 400;

    state: any;

    constructor(errors: Array<ValidationErrorEntry>) {
        super('The request is invalid.');
        this.state = errors.reduce((result, error) => {
            if (Object.prototype.hasOwnProperty.call(result, error.key)) {
                result[error.key].push(error.message);
            } else {
                Object.defineProperty(result, error.key, {
                    value: [error.message],
                    enumerable: true,
                });
            }
            return result;
        }, {});
    }
}

export class UnauthorizedError extends Error {
    code = 401;

    message = this.message || 'Anonymous access is denied.';
}

export class ForbiddenError extends Error {
    code = 403;

    message = this.message || 'Access is denied.';
}

export class UserExistsError extends Error {
    code = 400;

    message = this.message || 'User email exists';
}

export class AdminError extends Error {
    code = 401;

    message = this.message || 'Admin privileges required for this action';
}

export default { report };
