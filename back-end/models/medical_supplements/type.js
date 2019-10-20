import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
} from 'graphql';

module.exports = new GraphQLObjectType({
    name: 'Preferences',
    description: 'A Preference object',
    fields: () => ({
        email: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The email id of the user',
        },
        preference_id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Preference IDs of the user preferences',
        },
    }),
});
