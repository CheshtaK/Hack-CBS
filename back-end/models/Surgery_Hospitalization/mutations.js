import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import CommentAnswerType from '../surgery_hospitalization/type';
import logger from '../../helpers/logger';
import { ForbiddenError, ValidationError } from '../../errors';
import redisClient from '../../helpers/redis-helper';

const CommentAnswerInputType = new GraphQLInputObjectType({
    name: 'CommentAnswerInputType',
    fields: {
        answer_id: {
            type: GraphQLString,
            description: 'The id of the answer to which the comment belongs',
        },
        comment_id: {
            type: GraphQLString,
            description: 'The comment id used to extract the comment info',
        },
    },
});

// eslint-disable-next-line camelcase
const CommentAnswerMutation = ({ Comments_Answers }) => ({
    addCommentToAnswer: {
        type: CommentAnswerType,
        args: {
            comment: {
                type: CommentAnswerInputType,
                description: 'The comment object to be added',
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { comment }, context, info) => {
            let commentObj = {};
            if (!comment.answer_id && root.answer_id) {
                // eslint-disable-next-line no-param-reassign
                comment.answer_id = root.answer_id;
            }
            if (!comment.comment_id && root.comment_id) {
                // eslint-disable-next-line no-param-reassign
                comment.comment_id = root.comment_id;
            }
            if (!comment.comment_id || !comment.answer_id) {
                throw new ValidationError([
                    {
                        key: 'IFE003',
                        message:
                            'Insufficient arguments, must have comment_id and answer_id arguments',
                    },
                ]);
            }

            await redisClient
                .selectAsync(process.env.ANSWER_REDIS)
                .then(async selected => {
                    if (selected) {
                        await redisClient.delAsync(
                            comment.answer_id + process.env.COMMENTS_IDENTIFIER,
                        );
                    }
                })
                .catch(err => {
                    logger.error(err);
                    throw new ForbiddenError();
                });

            await Comments_Answers.create(comment)
                .then(newComment => {
                    if (newComment) {
                        commentObj = newComment.dataValues;
                    } else {
                        throw new ValidationError([
                            {
                                key: 'IFE002',
                                message: 'Invalid Input',
                            },
                        ]);
                    }
                })
                .catch(err => {
                    logger.error(err);
                    throw new ForbiddenError();
                });
            return commentObj;
        },
    },
});

module.exports = CommentAnswerMutation;
