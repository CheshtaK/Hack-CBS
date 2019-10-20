import {
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInt,
} from 'graphql';

import PreferenceType from '../medical_supplements/type';
import {
    ForbiddenError,
    UnauthorizedError,
    ValidationError,
} from '../../errors';
import logger from '../../helpers/logger';
import redisClient from '../../helpers/redis-helper';

const PreferenceMutation = ({ Preference }) => ({
    editPreference: {
        type: new GraphQLList(PreferenceType),
        args: {
            email: {
                description: 'Unique User email ID',
                type: GraphQLString,
            },
            newPreferences: {
                description: 'New Preferences of the user',
                type: new GraphQLNonNull(new GraphQLList(GraphQLInt)),
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { email, newPreferences }, context, info) => {
            if (!email && !root.email) {
                throw new ValidationError([
                    {
                        key: 'IFE003',
                        message:
                            'Insufficient Arguments, must have an email as argument',
                    },
                ]);
            }
            const { user } = context;
            if (
                !user ||
                (email && user.email !== email) ||
                (root && root.email && user.email !== root.email)
            ) {
                throw new UnauthorizedError();
            }
            const updatedPreferences = [];
            await context.preferenceById.clear(email || root.email);
            await redisClient
                .selectAsync(process.env.PREFERENCE_REDIS)
                .then(async selected => {
                    if (selected) {
                        await redisClient.delAsync(email || root.email);
                    }
                })
                .catch(err => {
                    logger.error(err);
                    throw new ForbiddenError();
                });
            await Preference.destroy({
                where: {
                    email: email || root.email,
                },
            })
                .then(async numDestroyed => {
                    logger.info(
                        `For user ${email} ${numDestroyed} preferences were found and deleted`,
                    );
                    await newPreferences.sort();
                    // Avoid using forEach, need this operation to be executed synchronously

                    for (let i = 0; i < newPreferences.length; i += 1) {
                        // eslint-disable-next-line no-await-in-loop
                        await Preference.create({
                            email,
                            preference_id: newPreferences[i],
                        })
                            .then(preference => {
                                updatedPreferences.push(preference.dataValues);
                            })
                            .catch(err => {
                                logger.error(err);
                                throw new ForbiddenError();
                            });
                    }
                })
                .catch(async err => {
                    logger.error(err);
                    throw new ForbiddenError();
                });
            return updatedPreferences;
        },
    },
});

module.exports = PreferenceMutation;
