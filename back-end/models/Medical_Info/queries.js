import { GraphQLString, GraphQLList } from 'graphql';

import CommentType from '../medical_info/type';
import { UnauthorizedError, ValidationError } from '../../errors';

// eslint-disable-next-line
const CommentQuery = ({ Comments_Info }) => ({
    getCommentInfo: {
        type: CommentType,
        args: {
            comment_id: {
                description: 'The ID of the comment',
                type: GraphQLString,
            },
        },
        // eslint-disable-next-line
        resolve: async (root, { comment_id }, context, info) => {
            // eslint-disable-next-line camelcase
            if (!comment_id && !root.comment_id) {
                throw new ValidationError([
                    {
                        key: 'IFE003',
                        message:
                            'Insufficient arguments, must have a comment_id argument',
                    },
                ]);
            }
            // eslint-disable-next-line no-return-await
            return await context.commentsById.load(
                // eslint-disable-next-line camelcase
                comment_id || root.comment_id,
            );
        },
    },
    getAllCommentsInfoByUser: {
        type: new GraphQLList(CommentType),
        args: {
            email: {
                type: GraphQLString,
                description:
                    'The email id of the user who has made the comment',
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
            return await context.commentsByUser.load(email);
        },
    },
});

module.exports = CommentQuery;
