import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
} from 'graphql';
import PostType from '../family_info/type';
import logger from '../../helpers/logger';
import {
    ForbiddenError,
    UnauthorizedError,
    ValidationError,
} from '../../errors';
import redisClient from '../../helpers/redis-helper';

const PostInputType = new GraphQLInputObjectType({
    name: 'PostInputType',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The id of the user who has made the post',
        },
        post_text: {
            type: new GraphQLNonNull(GraphQLString),
            description:
                'The text written in the post inclusive of the format chosen by the user',
        },
        text_type: {
            type: GraphQLInt,
            description: 'The formatting used by the client to make the post',
        },
        category: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLInt)),
            description: 'The list of category/ies this post belongs to',
        },
        post_title: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The title of the post given by the user',
        },
    },
});

const PostMutation = ({ Posts }) => ({
    addPost: {
        type: PostType,
        args: {
            post: {
                type: PostInputType,
                description: 'The post to be added',
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { post }, context, info) => {
            if (!post.id && root.email) {
                // eslint-disable-next-line no-param-reassign
                post.id = root.email;
            }
            if (!post.id) {
                throw new ValidationError([
                    {
                        key: 'IFE003',
                        message:
                            'Insufficient arguments, must have an id argument',
                    },
                ]);
            }
            const { user } = context;
            if (!user || user.email !== post.id) {
                throw new UnauthorizedError();
            }
            await redisClient
                .selectAsync(process.env.USER_REDIS)
                .then(async selected => {
                    if (selected) {
                        await redisClient.delAsync(
                            post.id + process.env.POSTS_IDENTIFIER,
                        );
                    }
                })
                .catch(err => {
                    logger.error(err);
                    throw new ForbiddenError();
                });
            let postObj = {};
            await Posts.create(post)
                .then(newPost => {
                    if (newPost) {
                        postObj = newPost.dataValues;
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
            return postObj;
        },
    },
    // TODO : add edit post mutation
});

module.exports = PostMutation;
