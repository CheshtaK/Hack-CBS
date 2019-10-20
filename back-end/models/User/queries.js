import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
} from 'graphql';

import UserType from '../user/type';
import { ForbiddenError, ValidationError } from '../../errors';
import {
    // eslint-disable-next-line import/named
    refreshTokenMaker,
    // eslint-disable-next-line import/named
    tokenMaker,
    // eslint-disable-next-line import/named
    blacklistToken,
    // eslint-disable-next-line import/named
    tokenDecryptor,
} from '../../helpers/token-util';
import logger from '../../helpers/logger';

const signinReturn = new GraphQLObjectType({
    name: 'SignInPayload',
    description: 'A SignIn Payload Object',
    fields: () => ({
        accessToken: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The access token of the user valid for 2 hours',
        },
        refreshToken: {
            type: new GraphQLNonNull(GraphQLString),
            description:
                'The refresh token that will be used to generate a new access token',
        },
    }),
});

const usernameCheckReturn = new GraphQLObjectType({
    name: 'UsernameCheckPayload',
    description:
        'Object that denotes if username is valid, if invalid then the reason as well',
    fields: () => ({
        valid: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description:
                'Boolean parameter that denotes if the username is valid or not',
        },
        errorResponse: {
            type: GraphQLString,
            description:
                'The reason, if any, for which the username is not valid',
        },
    }),
});

const getAccessTokenFromEmailUsername = async (
    email,
    username,
    password,
    User,
    // eslint-disable-next-line camelcase
    Token_List,
) => {
    let accessToken = null;
    let refreshToken = null;
    if ((!email && !username) || (email && username)) {
        throw new ValidationError([
            {
                key: 'IFE001',
                message:
                    'Both username and password can not be null and both must not be present',
            },
        ]);
    } else if (username) {
        // eslint-disable-next-line prefer-const
        let { user, validLogin } = await User.checkPassword(
            { username, email: null },
            password,
        );
        user = user.dataValues;
        if (user && validLogin) {
            accessToken = await tokenMaker({
                email: user.email,
                id: user.id,
            });
            await Token_List.find({
                where: {
                    id: user.email,
                },
            }).then(async token => {
                if (token) {
                    refreshToken = token.dataValues.refreshtoken;
                } else {
                    refreshToken = await refreshTokenMaker({
                        email: user.email,
                        id: user.id,
                    });
                    await Token_List.create({
                        refreshtoken: refreshToken,
                        id: user.email,
                    });
                }
            });
        } else {
            throw new ValidationError([
                {
                    key: 'II001',
                    message: 'Invalid Username or Password',
                },
            ]);
        }
    } else {
        // eslint-disable-next-line prefer-const
        let { user, validLogin } = await User.checkPassword(
            { username: null, email },
            password,
        );
        user = user.dataValues;
        if (user && validLogin) {
            accessToken = await tokenMaker({
                email: user.email,
                id: user.id,
            });
            await Token_List.find({
                where: {
                    id: user.email,
                },
            }).then(async token => {
                if (token) {
                    refreshToken = token.dataValues.refreshtoken;
                } else {
                    refreshToken = await refreshTokenMaker({
                        email: user.email,
                        id: user.id,
                    });
                    await Token_List.create({
                        refreshtoken: refreshToken,
                        id: user.email,
                    });
                }
            });
        } else {
            throw new ValidationError([
                {
                    key: 'II001',
                    message: 'Invalid Email or Password',
                },
            ]);
        }
    }
    return { accessToken, refreshToken };
};

const getAccessTokenFromRefreshToken = async (
    refreshToken,
    // eslint-disable-next-line camelcase
    Token_List,
) => {
    let blacklisted = false;
    await Token_List.findOne({
        where: {
            refreshtoken: refreshToken,
        },
    })
        .then(result => {
            if (result) {
                // eslint-disable-next-line prefer-destructuring
                blacklisted = result.dataValues.blacklisted;
            } else {
                throw new ValidationError([
                    {
                        key: 'IFE001',
                        message: 'No such token exists for this user',
                    },
                ]);
            }
        })
        .catch(err => {
            logger.error(err);
            throw new ForbiddenError();
        });

    if (blacklisted) {
        throw new ForbiddenError();
    } else {
        const tokenData = await tokenDecryptor(refreshToken);
        const accessToken = await tokenMaker({
            email: tokenData.email,
            id: tokenData.id,
        });
        return { accessToken, refreshToken };
    }
};

// eslint-disable-next-line camelcase
const UserQuery = ({ User, Token_List }) => ({
    getUser: {
        type: UserType,
        args: {
            email: {
                description: 'Email of User',
                type: GraphQLString,
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { email }, context, info) => {
            const { user } = context;
            if (!user || (email && user.email !== email)) {
                throw new ForbiddenError();
            }
            return context.userById.load(email || user.email || root.email);
        },
    },
    signIn: {
        type: signinReturn,
        args: {
            email: {
                description: 'Email of User',
                type: GraphQLString,
            },
            username: {
                description: 'Username of user',
                type: GraphQLString,
            },
            password: {
                description: 'Password of user',
                type: GraphQLString,
            },
            refreshToken: {
                description:
                    'Refresh token to be used in case of session refresh',
                type: GraphQLString,
            },
        },
        resolve: async (
            root,
            { email, username, password, refreshToken },
            // eslint-disable-next-line no-unused-vars
            context,
            // eslint-disable-next-line no-unused-vars
            info,
        ) => {
            if (
                !refreshToken &&
                !email &&
                ((!email || !username) && !password)
            ) {
                throw new ValidationError([
                    {
                        key: 'IFE001',
                        message:
                            'Both username/email and password can not be null and ' +
                            "refreshToken can't be null",
                    },
                ]);
            } else if (
                refreshToken &&
                email &&
                ((email || username) && password)
            ) {
                throw new ValidationError([
                    {
                        key: 'IFE001',
                        message:
                            "Both refreshToken and combination of username/email and password can't be present together",
                    },
                ]);
            } else if (refreshToken) {
                return getAccessTokenFromRefreshToken(refreshToken, Token_List);
            } else {
                return getAccessTokenFromEmailUsername(
                    email,
                    username,
                    password,
                    User,
                    Token_List,
                );
            }
        },
    },
    revokeToken: {
        type: GraphQLBoolean,
        args: {
            token: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Token to be blacklisted or revoked',
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { token }, context, info) => {
            // TODO:Insert check for who should revoke token
            const payload = await tokenDecryptor(token);
            let done = false;
            await blacklistToken(payload.jwtid)
                .then(status => {
                    if (status) {
                        logger.info('Token blacklisted');
                        done = true;
                    }
                })
                .catch(err => {
                    logger.error(err);
                    throw new ForbiddenError();
                });
            return done;
        },
    },
});

module.exports = UserQuery;
