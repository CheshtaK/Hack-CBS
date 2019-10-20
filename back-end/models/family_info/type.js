import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
} from 'graphql';

module.exports = new GraphQLObjectType({
    name: 'Post',
    description: 'A Post object',
    fields: () => {
        // eslint-disable-next-line global-require
        const db = require('../');
        return {
            id: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The id of the user who has made the post',
            },
            post_id: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The unique id of the post assigned by the system',
            },
            post_text: {
                type: new GraphQLNonNull(GraphQLString),
                description:
                    'The text written in the post inclusive of the format chosen by the user',
            },
            text_type: {
                type: new GraphQLNonNull(GraphQLInt),
                description:
                    'The formatting used by the client to make the post',
            },
            num_comments: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'The number of comments received on this post',
            },
            createdAt: {
                type: new GraphQLNonNull(GraphQLString),
                description:
                    'The timestamp of the time when this post was created',
            },
            updatedAt: {
                type: new GraphQLNonNull(GraphQLString),
                description:
                    'The timestamp of the time when this post was last updated',
            },
            category: {
                type: new GraphQLNonNull(new GraphQLList(GraphQLInt)),
                description: 'The list of category/ies this post belongs to',
            },
            viewed: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'The number of times this post has been viewed',
            },
            last_activity: {
                type: new GraphQLNonNull(GraphQLString),
                description:
                    'The timestamp of the last time when this post last received some activity',
            },
            post_title: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The title of the post assigned by the user',
            },
            num_upvotes: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'The number of upvotes received for this answer',
            },
            num_downvotes: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'The number of downvotes received for this answer',
            },
            // eslint-disable-next-line global-require
            ...require('../Patient_Info/queries')(db),
            // eslint-disable-next-line global-require
            ...require('../Accidents/queries')(db),
            // eslint-disable-next-line global-require
            ...require('../Medical_Info/mutations')(db),
            // eslint-disable-next-line global-require
            ...require('../Medical_Info/queries')(db),
            // eslint-disable-next-line global-require
            ...require('../MediaFiles/mutations')(db),
            // eslint-disable-next-line global-require
            ...require('../MediaFiles/queries')(db),
        };
    },
});
