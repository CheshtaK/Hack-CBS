import {
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLString,
} from 'graphql';
import CommentType from '../medical_info/type';
import logger from '../../helpers/logger';
import {
    ForbiddenError,
    UnauthorizedError,
    ValidationError,
} from '../../errors';
import redisClient from '../../helpers/redis-helper';

const CommentInputType = new GraphQLInputObjectType({
    name: 'CommentInputType',
    fields: {
        id: {
            type: GraphQLString,
            description: 'The id of the user who has made the comment',
        },
        comment_text: {
            type: new GraphQLNonNull(GraphQLString),
            description:
                'The text written in the comment inclusive of the format chosen by the user',
        },
        text_type: {
            type: GraphQLInt,
            description:
                'The formatting used by the client to make the comment',
        },
    },
});

// eslint-disable-next-line camelcase
const CommentMutation = ({ Comments_Info }) => ({
    addCommentInfo: {
        type: CommentType,
        args: {
            comment: {
                type: CommentInputType,
                description: 'The comment to be added',
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { comment }, context, info) => {
            if (!comment.id && root.email) {
                // eslint-disable-next-line no-param-reassign
                comment.id = root.email;
            }
            if (!comment.id) {
                throw new ValidationError([
                    {
                        key: 'IFE003',
                        message:
                            'Insufficient Arguments, must have an id argument for comment',
                    },
                ]);
            }

            const { user } = context;
            if (!user || user.email !== comment.id) {
                throw new UnauthorizedError();
            }

            await redisClient
                .selectAsync(process.env.USER_REDIS)
                .then(async selected => {
                    if (selected) {
                        await redisClient.delAsync(
                            comment.id + process.env.COMMENTS_IDENTIFIER,
                        );
                    }
                })
                .catch(err => {
                    logger.error(err);
                    throw new ForbiddenError();
                });

            let commentObj = {};
            await Comments_Info.create(comment)
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
    // TODO : make an edit comment mutation
});

module.exports = CommentMutation;
