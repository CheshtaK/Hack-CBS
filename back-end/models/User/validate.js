import validator from 'validator';
import passwordValidator from 'password-validator';
// eslint-disable-next-line import/named
import { checkDBUsername } from '../helpers';
import { ForbiddenError } from '../../errors';
import logger from '../../helpers/logger';

const checkDate = input => {
    const date = new Date(input);
    if (Object.prototype.toString.call(date) === '[object Date]') {
        // eslint-disable-next-line no-restricted-globals
        return !isNaN(date.getTime());
    }
    return false;
};

// eslint-disable-next-line camelcase
export async function checkUsername(input, User, Unavailable_Usernames) {
    const username = input;
    let valid = true;
    let errorResponse = null;
    if (username && typeof username !== 'string') {
        valid = false;
        errorResponse = 'Username must be string';
    } else if (!username || username.trim() === '') {
        valid = false;
        errorResponse = "Username can't be null or empty";
    } else if (!validator.isLength(username, { min: 5, max: 30 })) {
        valid = false;
        errorResponse = 'Username must have between 5 to 30 characters';
    } else if (!validator.matches(username, '^[a-z]{1}[a-z0-9_-]{4,29}$')) {
        valid = false;
        errorResponse =
            'Username must have 5 to 30 characters, must start with an alphabet' +
            'and can only have alphabets, numbers or any of the special ' +
            'characters of underscore(_) or hyphen(-)';
    } else {
        await checkDBUsername(User, username, Unavailable_Usernames)
            .then(result => {
                // eslint-disable-next-line prefer-destructuring
                valid = result.valid;
                if (!valid) {
                    errorResponse = 'This username is not available';
                }
            })
            .catch(err => {
                logger.error(err);
                throw new ForbiddenError();
            });
    }
    return {
        username,
        valid,
        errorResponse,
    };
}

export async function validateUser(input, Models) {
    let data = null;

    const { firstname, lastname, dob, username, password, email } = input;

    if (
        firstname &&
        validator.isLength(firstname, { min: 2, max: 50 }) &&
        validator.isAlpha(firstname, 'en-US')
    ) {
        if (!data) {
            data = {
                firstname,
            };
        } else {
            data.firstname = firstname;
        }
    } else if (firstname) {
        const error =
            'Firstname must have 2 to 50 characters and must be alphabetic';
        if (!data) {
            data = {
                errors: error,
            };
        } else {
            data.errors = error;
        }
    }

    if (dob && checkDate(dob)) {
        if (!data) {
            data = {
                dob,
            };
        } else {
            data.dob = dob;
        }
    } else if (dob) {
        const error = 'Date of birth must be in valid date format';
        if (!data) {
            data = {
                errors: error,
            };
        } else {
            data.errors = error;
        }
    }

    if (email && validator.isEmail(email)) {
        if (!data) {
            data = {
                email,
            };
        } else {
            data.email = email;
        }
    } else if (email) {
        const error = 'Email must be in a valid format';
        if (!data) {
            data = {
                errors: error,
            };
        } else {
            data.errors = error;
        }
    }

    if (password) {
        const passwordSchema = new passwordValidator()
            .is()
            .min(8)
            .is()
            .max(70)
            .has()
            .uppercase()
            .has()
            .lowercase()
            .has()
            .digits();
        if (passwordSchema.validate(password)) {
            if (!data) {
                data = {
                    password,
                };
            } else {
                data.password = password;
            }
        } else {
            const error =
                'Password must be between 8 to 70 characters, ' +
                'consist of uppercase and lowercase alphabets,' +
                'must have at least one digit';
            if (!data) {
                data = {
                    errors: error,
                };
            } else {
                data.errors = error;
            }
        }
    }

    if (
        lastname &&
        validator.isLength(lastname, { min: 2, max: 50 }) &&
        validator.isAlpha(lastname, 'en-US')
    ) {
        if (!data) {
            data = {
                lastname,
            };
        } else {
            data.lastname = lastname;
        }
    } else if (lastname) {
        const error =
            'Lastname must have 2 to 50 characters and must be alphabetic';
        if (!data) {
            data = {
                errors: error,
            };
        } else {
            data.errors = error;
        }
    }

    if (username) {
        const usernameResponse = await checkUsername(
            username,
            Models.User,
            Models.Unavailable_Usernames,
        );
        if (usernameResponse.valid) {
            if (!data) {
                data = {
                    username,
                };
            } else {
                data.username = username;
            }
        } else if (!data) {
            data = {
                errors: usernameResponse.errorResponse,
            };
        } else {
            data.errors = usernameResponse.errorResponse;
        }
    }

    if (lastname && validator.isAlpha(lastname, 'en-US')) {
        if (!data) {
            data = {
                lastname,
            };
        } else {
            data.lastname = lastname;
        }
    }

    return data;
}
