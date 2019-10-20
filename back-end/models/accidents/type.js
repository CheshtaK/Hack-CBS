import { GraphQLString, GraphQLNonNull, GraphQLObjectType } from 'graphql';

module.exports = new GraphQLObjectType({
    name: 'CommentPostType',
    description: 'Object representing comment to post type',
    fields: () => ({
        post_id: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The post id to which this comment belongs to',
        },
        comment_id: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The comment id used to extract the comment info',
        },
        // eslint-disable-next-line global-require
        ...require('../Medical_Info/queries'),

        // required for edit comment mutation
        // eslint-disable-next-line global-require
        ...require('../Medical_Info/mutations'),
    }),
});
