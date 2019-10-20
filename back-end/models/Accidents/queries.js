import { GraphQLString, GraphQLList } from 'graphql';

import CommentPostType from '../accidents/type';
import { ValidationError } from '../../errors';

// eslint-disable-next-line
const CommentPostsQuery = ({ Comments_Posts }) => ({
    getAllCommentsForPosts: {
        type: new GraphQLList(CommentPostType),
        args: {
            post_id: {
                type: GraphQLString,
                description:
                    'The post_id of the post for which comments are to be found',
            },
        },
        // eslint-disable-next-line
        resolve: async (root, { post_id }, context, info) => {
            // eslint-disable-next-line camelcase
            if (!post_id && (!root || !root.post_id)) {
                throw new ValidationError([
                    {
                        key: 'IFE003',
                        message:
                            'Insufficient arguments, must have post_id as argument',
                    },
                ]);
            }
            // eslint-disable-next-line
            return await context.commentsForPosts.load(post_id || root.post_id);
        },
    },
});

module.exports = CommentPostsQuery;
