import {
    GraphQLNonNull,
    GraphQLString,
    GraphQLObjectType,
    GraphQLInt,
} from 'graphql';

module.exports = new GraphQLObjectType({
    name: 'Comments_Info',
    description: 'A comment info description object',
    fields: () => {
        // eslint-disable-next-line global-require
        const db = require('../');
        return {
            id: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The id of the user who has made the comment',
            },
            comment_id: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The id of the comment assigned by the system',
            },
            comment_text: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The text contained within the comment',
            },
            num_upvotes: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'The number of upvotes received on this comment',
            },
            num_downvotes: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'The number of downvotes received on this comment',
            },
            createdAt: {
                type: new GraphQLNonNull(GraphQLString),
                description:
                    'The timestamp of the time on which this comment was made',
            },
            updatedAt: {
                type: new GraphQLNonNull(GraphQLString),
                description:
                    'The timestamp of the time on which this comment was last updated',
            },
            // eslint-disable-next-line global-require
            ...require('../Surgery_Hospitalization/mutations')(db),
            // eslint-disable-next-line global-require
            ...require('../Accidents/mutations')(db),
            // eslint-disable-next-line global-require
            ...require('../MediaFiles/mutations')(db),
            // eslint-disable-next-line global-require
            ...require('../MediaFiles/queries')(db),
        };
    },
});
