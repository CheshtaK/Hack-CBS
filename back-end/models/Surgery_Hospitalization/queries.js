import { GraphQLString, GraphQLList } from 'graphql';

import CommentAnswerType from '../surgery_hospitalization/type';

// eslint-disable-next-line
const CommentAnswerQuery = ({ Comments_Answers }) => ({
    getAllCommentsForAnswer: {
        type: new GraphQLList(CommentAnswerType),
        args: {
            answer_id: {
                type: GraphQLString,
                description:
                    'The answer_id of the answer for which comments are to be found',
            },
        },
        // eslint-disable-next-line
        resolve: async (root, { answer_id }, context, info) => {
            // eslint-disable-next-line no-return-await
            return await context.commentsForAnswer.load(
                // eslint-disable-next-line camelcase
                answer_id || root.answer_id,
            );
        },
    },
});

module.exports = CommentAnswerQuery;
