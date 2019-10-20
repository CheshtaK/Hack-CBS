import { GraphQLString, GraphQLNonNull, GraphQLObjectType } from 'graphql';

module.exports = new GraphQLObjectType({
    name: 'CommentAnswerType',
    description: 'Object representing comment to answer type',
    fields: () => ({
        answer_id: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The answer id to which this comment belongs to',
        },
        comment_id: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The comment id used to extract the comment info',
        },
        // eslint-disable-next-line global-require
        ...require('../Medical_Info/queries'),

        // required for editing a comment
        // eslint-disable-next-line global-require
        ...require('../Medical_Info/mutations'),
    }),
});
