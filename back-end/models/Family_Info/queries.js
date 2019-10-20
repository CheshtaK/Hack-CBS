import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import PostType from '../family_info/type';
import { UnauthorizedError, ValidationError } from '../../errors';

// eslint-disable-next-line no-unused-vars
const PostQuery = ({ Posts }) => ({
    getPost: {
        type: PostType,
        args: {
            post_id: {
                description: 'The ID of the post',
                type: new GraphQLNonNull(GraphQLString),
            },
        },
        // eslint-disable-next-line
        resolve: async (root, { post_id }, context, info) =>
            // eslint-disable-next-line
            await context.postById.load(post_id || root.post_id),
    },
    getAllPostsByUser: {
        type: new GraphQLList(PostType),
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
            return await context.postsByUser.load(email);
        },
    },
});

module.exports = PostQuery;
