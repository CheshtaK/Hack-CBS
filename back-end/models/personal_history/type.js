import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
} from 'graphql';

module.exports = new GraphQLObjectType({
    name: 'FetchedPost',
    description: 'A Fetched Post object',
    fields: () => {
        // eslint-disable-next-line global-require
        const db = require('../');
        return {
            createdAt: {
                type: GraphQLString,
                description: 'The date at which the fetched post was created',
            },
            source_website: {
                type: new GraphQLNonNull(GraphQLInt),
                description:
                    'The ID of the website to which the fetched post belongs to',
            },
            popularity_index: {
                type: GraphQLString,
                description:
                    'The website indicator of the popularity of the post, if any',
            },
            excerpt: {
                type: GraphQLString,
                description:
                    'Some description text fetched from the website about the post',
            },
            post_id: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'The unique id of the post assigned by the system',
            },
            post_url: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The post id of the fetched post',
            },
            post_title: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The title of the fetched post',
            },
            num_comments: {
                type: new GraphQLNonNull(GraphQLInt),
                description:
                    'The number of comments received on this fetched post, -1 if not fetched',
            },
            num_answers: {
                type: new GraphQLNonNull(GraphQLInt),
                description:
                    'The number of answers received on this fetched post, -1 if not fetched',
            },
            category_id: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'The category ID to which the post belongs to',
            },
            subtopic_id: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'The subtopic ID to which the post belongs to',
            },
            region_code: {
                type: GraphQLInt,
                description:
                    'The Region Code in which the fetched post was made',
            },
            accepted_answer_id: {
                type: GraphQLInt,
                description: 'The Answer ID of the accepted answer if any',
            },
            tags: {
                type: new GraphQLNonNull(new GraphQLList(GraphQLInt)),
                description: 'The list of tags this fetched post has',
            },
            viewed: {
                type: new GraphQLNonNull(GraphQLInt),
                description:
                    'The number of times this fetched post has been viewed',
            },
            last_activity: {
                type: GraphQLString,
                description:
                    'The timestamp of the last time when this fetched post last received some activity',
            },
            num_upvotes: {
                type: GraphQLInt,
                description:
                    'The number of upvotes received for this fetched post, -1 if not fetched',
            },
            num_downvotes: {
                type: GraphQLInt,
                description:
                    'The number of downvotes received for fetched post, -1 if not fetched',
            },
            author_info: {
                type: GraphQLString,
                description:
                    'The author info / profile link of the person who has authored this post',
            },
            // eslint-disable-next-line global-require
            ...require('../Personal_History/queries')(db),
        };
    },
});
