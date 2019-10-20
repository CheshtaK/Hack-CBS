import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
} from 'graphql';

module.exports = new GraphQLObjectType({
    name: 'Answer',
    description: 'A answer object',
    fields: () => {
        // eslint-disable-next-line global-require
        const db = require('../');
        return {
            id: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The id of the user who has posted this answer',
            },
            post_id: {
                type: new GraphQLNonNull(GraphQLString),
                description:
                    'The id of the post to which the answer has been made',
            },
            answer_id: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The unique answer id assigned by the system',
            },
            answer_text: {
                type: new GraphQLNonNull(GraphQLString),
                description:
                    'The text contained in the answer, in the correct format as indicated by the user',
            },
            num_upvotes: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'The number of upvotes received for this answer',
            },
            num_downvotes: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'The number of downvotes received for this answer',
            },
            createdAt: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The date on which the answer was posted',
            },
            updatedAt: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The date on which the answer was updated',
            },
            text_type: {
                type: new GraphQLNonNull(GraphQLInt),
                description:
                    'The numeric code indicating what format the answer text is in',
            },
            // eslint-disable-next-line global-require
            ...require('../Surgery_Hospitalization/queries')(db),
            // eslint-disable-next-line global-require
            ...require('../Medical_Info/mutations')(db),
            // eslint-disable-next-line global-require
            ...require('../MediaFiles/mutations')(db),
            // eslint-disable-next-line global-require
            ...require('../MediaFiles/queries')(db),
        };
    },
});
