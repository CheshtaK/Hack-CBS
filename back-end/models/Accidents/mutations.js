import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import CommentPostsType from '../accidents/type';
import logger from '../../helpers/logger';
import { ForbiddenError, ValidationError } from '../../errors';
import redisClient from '../../helpers/redis-helper';

const CommentPostsInputType = new GraphQLInputObjectType({
    name: 'CommentPostsInputType',
    fields: {
        post_id: {
            type: GraphQLString,
            description: 'The id of the post to which the comment belongs',
        },
        comment_id: {
            type: GraphQLString,
            description: 'The comment id used to extract the comment info',
        },
    },
});

// eslint-disable-next-line camelcase
const CommentPostMutation = ({ Comments_Posts }) => ({
    addCommentToPost: {
        type: CommentPostsType,
        args: {
            comment: {
                type: CommentPostsInputType,
                description: 'The comment object to be added',
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { comment }, context, info) => {
            let commentObj = {};
            if (!comment.post_id && root.post_id) {
                // eslint-disable-next-line no-param-reassign
                comment.post_id = root.post_id;
            }
            if (!comment.comment_id && root.comment_id) {
                // eslint-disable-next-line no-param-reassign
                comment.comment_id = root.comment_id;
            }
            if (!comment.comment_id || !comment.post_id) {
                throw new ValidationError([
                    {
                        key: 'IFE003',
                        message:
                            'Insufficient Arguments, must have post_id and comment_id as arguments',
                    },
                ]);
            }

            await redisClient
                .selectAsync(process.env.POSTS_REDIS)
                .then(async selected => {
                    if (selected) {
                        await redisClient.delAsync(
                            comment.post_id + process.env.COMMENTS_IDENTIFIER,
                        );
                    }
                })
                .catch(err => {
                    logger.error(err);
                    throw new ForbiddenError();
                });

            await Comments_Posts.create(comment)
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

module.exports = CommentPostMutation;
