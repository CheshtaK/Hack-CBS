import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLBoolean,
} from 'graphql';

module.exports = new GraphQLObjectType({
    name: 'User',
    description: 'A User object',
    fields: () => {
        // eslint-disable-next-line global-require
        const db = require('../');
        return {
            id: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The id of the user',
            },
            firstname: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The first name of the user',
            },
            username: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The username of the user',
            },
            lastname: {
                type: GraphQLString,
                description: 'The last name of the user',
            },
            email: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The email address of the user',
            },
            dob: {
                type: GraphQLString,
                description: 'The Date of Birth of the user',
            },
            createdAt: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The Date when the user account was created',
            },
            confirmed: {
                type: new GraphQLNonNull(GraphQLBoolean),
                description: 'Whether the email of the user is verified or not',
            },
            emailtoken: {
                type: GraphQLString,
                description:
                    'The token assigned to the user for account verification',
            },
            // eslint-disable-next-line global-require
            ...require('../Medical_Supplements/queries')(db),
            // eslint-disable-next-line global-require
            ...require('../Family_Info/queries')(db),
            // eslint-disable-next-line global-require
            ...require('../Patient_Info/queries')(db),
            // eslint-disable-next-line global-require
            ...require('../Medical_Info/queries')(db),
            // eslint-disable-next-line global-require
            ...require('../Patient_Info/mutations')(db),
            // eslint-disable-next-line global-require
            ...require('../Family_Info/mutations')(db),
        };
    },
});
