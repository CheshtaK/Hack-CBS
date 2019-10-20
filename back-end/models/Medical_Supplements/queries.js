import { GraphQLString, GraphQLList } from 'graphql';

import PreferenceType from '../medical_supplements/type';
import { ForbiddenError, ValidationError } from '../../errors';

// eslint-disable-next-line no-unused-vars
const PreferenceQuery = ({ Preference }) => ({
    getPreference: {
        type: new GraphQLList(PreferenceType),
        args: {
            email: {
                description: 'Email of User',
                type: GraphQLString,
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { email }, context, info) => {
            if (!email && !root.email) {
                throw new ValidationError([
                    {
                        key: 'IFE003',
                        message:
                            'Insufficient arguments, must hav email as an argument',
                    },
                ]);
            }
            const { user } = context;
            if (!user || user.email !== email) {
                throw new ForbiddenError();
            }
            // eslint-disable-next-line no-return-await
            return await context.preferenceById.load(email || root.email);
        },
    },
});

module.exports = PreferenceQuery;
