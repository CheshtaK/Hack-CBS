import {
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLString,
} from 'graphql';
import { resolver } from 'graphql-sequelize';
import UserType from '../user/type';
import logger from '../../helpers/logger';
// eslint-disable-next-line import/named
import { tokenDecryptor, tokenMaker } from '../../helpers/token-util';
import {
    ForbiddenError,
    UnauthorizedError,
    UserExistsError,
    ValidationError,
} from '../../errors';
import { validateUser } from './validate';
import { unavailUsername } from '../helpers';
import redisClient from '../../helpers/redis-helper';

const UserInfoObj = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: () => ({
        firstname: {
            description: "User's first name",
            type: GraphQLString,
        },
        lastname: {
            description: "User's last name",
            type: GraphQLString,
        },
        dob: {
            description: 'User Date of Birth',
            type: GraphQLString,
        },
        username: {
            description: 'The Username of the user',
            type: GraphQLString,
        },
    }),
});

// eslint-disable-next-line camelcase
const UserMutation = ({ User, Unavailable_Usernames }) => ({
    signUp: {
        type: UserType,
        args: {
            email: {
                description: 'Unique Email ID',
                type: new GraphQLNonNull(GraphQLString),
            },
            password: {
                description: 'Password',
                type: new GraphQLNonNull(GraphQLString),
            },
            client: {
                description: 'Mode of sign up',
                type: new GraphQLNonNull(GraphQLInt),
            },
            username: {
                description: 'Username chosen by the user',
                type: new GraphQLNonNull(GraphQLString),
            },
        },
        resolve: async (
            root,
            { email, password, client, username },
            context,
            info,
        ) => {
            let userObj = null;
            const validationOutput = await validateUser(
                {
                    username,
                    email,
                    client,
                    password,
                },
                { User, Unavailable_Usernames },
            );
            if (validationOutput.errors) {
                throw new ValidationError([
                    {
                        key: 'IFE003',
                        message: validationOutput.errors,
                    },
                ]);
            }
            await User.findOrCreate({
                where: {
                    email,
                    username,
                },
                defaults: {
                    firstname: '',
                    confirmed: false,
                    email,
                    username,
                    client,
                    password,
                },
            })
                .spread(async (user, created) => {
                    if (!created || !user) {
                        throw new UserExistsError();
                    } else {
                        userObj = await resolver(User)(
                            root,
                            { email: user.email },
                            context,
                            info,
                        );
                    }
                })
                .catch(async error => {
                    logger.error(error);
                    const errorArray = [];
                    if (error.keys == null || !error.keys.contains('errors')) {
                        throw new UserExistsError();
                    } else {
                        error.errors.forEach(errorObj => {
                            errorArray.push({
                                key: errorObj.validatorKey,
                                message: errorObj.message,
                            });
                        });
                        throw new ValidationError(errorArray);
                    }
                });
            return userObj;
        },
    },
    addInfo: {
        type: UserType,
        args: {
            email: {
                description: 'Unique Email ID',
                type: GraphQLString,
            },
            userDetails: {
                description: 'User details object',
                type: UserInfoObj,
            },
        },
        resolve: async (root, { email, userDetails }, context, info) => {
            if (!context.user) {
                throw new UnauthorizedError();
            }
            if (!context.user.email && !email) {
                if (root && !root.email) {
                    throw new ValidationError([
                        {
                            key: 'IFE003',
                            message:
                                'Email argument must be present, implicit or explicitly',
                        },
                    ]);
                }
            }
            let userObj = null;
            await context.userById.clear(
                email || context.user.email || root.email,
            );
            // eslint-disable-next-line no-param-reassign
            email = email || context.user.email || root.email || null;
            await User.find({ where: { email } })
                .then(async user => {
                    if (user) {
                        // validateUser user details
                        const {
                            firstname,
                            lastname,
                            dob,
                            username,
                        } = userDetails;
                        if (username === user.username) {
                            throw new ValidationError([
                                {
                                    key: 'IFE003',
                                    message:
                                        "Old and new username can't be the same",
                                },
                            ]);
                        }
                        const validationOutput = await validateUser(
                            {
                                firstname,
                                lastname,
                                dob,
                                username,
                            },
                            { User, Unavailable_Usernames },
                        );
                        if (validationOutput.errors) {
                            throw new ValidationError([
                                {
                                    key: 'IFE003',
                                    message: validationOutput.errors,
                                },
                            ]);
                        }
                        if (validationOutput.username) {
                            const retval = {};
                            // eslint-disable-next-line camelcase
                            await unavailUsername(
                                Unavailable_Usernames,
                                user.username,
                                retval,
                            );
                        }
                        await User.update(validationOutput, {
                            where: { email },
                        })
                            // eslint-disable-next-line no-shadow
                            .then(async user => {
                                userObj = await resolver(User)(
                                    root,
                                    { email: user.email },
                                    context,
                                    info,
                                );
                            });
                    } else {
                        throw new ValidationError([
                            {
                                key: 'IU001',
                                message: "User doesn't exist",
                            },
                        ]);
                    }
                })
                .catch(async err => {
                    logger.error(err);
                    throw new ForbiddenError();
                });
            return userObj;
        },
    },
    updateStatus: {
        type: UserType,
        args: {
            id: {
                description:
                    'The identification id of the user whose status is to be updated',
                type: new GraphQLNonNull(GraphQLString),
            },
            accessToken: {
                description:
                    'The unique token to be used for email confirmation',
                type: new GraphQLNonNull(GraphQLString),
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { id, accessToken }, context, info) => {
            const decodedData = await tokenDecryptor(accessToken);
            let userObj = null;
            if (!decodedData) {
                throw new ValidationError([
                    {
                        key: 'IT001',
                        message: 'The token does not exist',
                    },
                ]);
            }
            if (decodedData.email === id) {
                await User.findOne({ where: { email: id } }).then(
                    async user => {
                        if (user.emailtoken === accessToken) {
                            await user
                                .updateAttributes({
                                    confirmed: true,
                                })
                                // eslint-disable-next-line no-shadow
                                .then(async user => {
                                    userObj = user;
                                })
                                .catch(err => {
                                    logger.error(err);
                                    throw new ForbiddenError();
                                });
                        } else {
                            throw new ValidationError([
                                {
                                    key: 'IT001',
                                    message: 'The token does not exist',
                                },
                            ]);
                        }
                    },
                );
            } else {
                throw new ValidationError([
                    {
                        key: 'IT001',
                        message: 'Invalid Token',
                    },
                ]);
            }
            return userObj;
        },
    },
    getNewConfirmationToken: {
        type: GraphQLString,
        args: {
            id: {
                description:
                    'The identification id of the user who requires new token',
                type: new GraphQLNonNull(GraphQLString),
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { id }, context, info) => {
            const { user } = context;
            if (!user || user.email !== id) {
                throw new UnauthorizedError();
            }
            let emailtoken = null;
            await User.findOne({ where: { email: id } }).then(
                async foundUser => {
                    const emailTokenData = foundUser.dataValues;
                    emailTokenData.confirmationToken = true;
                    emailtoken = await tokenMaker(emailTokenData);
                    await User.update(
                        {
                            emailtoken,
                        },
                        { where: { email: id } },
                    ).catch(err => {
                        logger.error(err);
                        throw new ForbiddenError();
                    });
                },
            );
            if (emailtoken) {
                return 'Token refreshed';
            }
            return 'Error Encountered';
        },
    },
    resetToken: {
        type: GraphQLString,
        args: {
            email: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Email address for which password has to be reset',
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { email }, context, info) => {
            let userObj = null;
            await User.findOne({ where: { email } })
                .then(async user => {
                    if (!user) {
                        throw new ValidationError([
                            {
                                key: 'II001',
                                message: 'Invalid email address',
                            },
                        ]);
                    }
                    userObj = user;
                })
                // eslint-disable-next-line no-unused-vars
                .catch(async err => {
                    throw new ValidationError([
                        {
                            key: 'II001',
                            message: 'Invalid email address',
                        },
                    ]);
                });
            userObj.dataValues.resetPassword = true;
            let accessToken = null;
            await tokenMaker(userObj)
                .then(res => {
                    accessToken = res;
                })
                .catch(err => {
                    throw new ForbiddenError(err.message);
                });
            return accessToken;
        },
    },
    resetPassword: {
        type: UserType,
        args: {
            resetToken: {
                type: new GraphQLNonNull(GraphQLString),
                description:
                    'The token received to validateUser reset password request',
            },
            newPassword: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The new password for the user',
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { resetToken, newPassword }, context, info) => {
            let decodedData = null;
            await tokenDecryptor(resetToken)
                .then(res => {
                    decodedData = res;
                })
                .catch(err => {
                    throw new ForbiddenError(err.message);
                });
            let userObj = null;
            if (decodedData) {
                if (decodedData.resetPassword) {
                    await User.findOne({
                        where: { email: decodedData.email },
                    }).then(async user => {
                        userObj = await user.updatePassword(newPassword);
                    });
                }
            }
            return userObj;
        },
    },
});

module.exports = UserMutation;
