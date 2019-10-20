import { GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';

import AnswerType from '../patient_info/type';
import { ValidationError } from '../../errors';

// eslint-disable-next-line no-unused-vars
const AnswerQuery = ({ Answers }) => ({
    getAnswer: {
        type: AnswerType,
        args: {
            answer_id: {
                description: 'The ID of the answer',
                type: new GraphQLNonNull(GraphQLString),
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { answerId }, context, info) =>
            context.answerById.load(answerId || root.answer_id),
    },
    getAllAnswersByUser: {
        type: new GraphQLList(AnswerType),
        args: {
            email: {
                type: GraphQLString,
                description: 'The email id of the user who has made the post',
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { email }, context, info) => {
            const { user } = context;
            if (!email) {
                // eslint-disable-next-line
                email = root ? root.email : user ? user.email : null;
            }
            if (!email) {
                throw new ValidationError([
                    {
                        key: 'IFE001',
                        message: 'No email present',
                    },
                ]);
            }
            // eslint-disable-next-line no-return-await
            return await context.answersByUser.load(email);
        },
    },
    getAllAnswersForPost: {
        type: new GraphQLList(AnswerType),
        args: {
            post_id: {
                type: GraphQLString,
                description:
                    'The post id of the post for which answers are required',
            },
        },
        // eslint-disable-next-line
        resolve: async (root, { post_id }, context, info) => {
            // eslint-disable-next-line camelcase
            if (!post_id && !root.post_id) {
                throw new ValidationError([
                    {
                        key: 'IFE003',
                        message:
                            'Insufficient arguments, must have an post_id argument',
                    },
                ]);
            }
            // eslint-disable-next-line
            return await context.answersForPosts.load(post_id || root.post_id);
        },
    },
});

module.exports = AnswerQuery;
