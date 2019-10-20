import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';

import FetchedPostType from '../personal_history/type';
import SearchedPostType from '../personal_history/searchType';
import insertFetchedPosts from '../../helpers/post-inserter';
import logger from '../../helpers/logger';
import shortenURL from '../../helpers/url-shortener';

// eslint-disable-next-line
const PostQuery = ({ Fetched_Posts, Tag_IDS, Source_IDS, Subtopic_Tag_Map, Source_Subtopic_Map, Source_Preference_Map }) => ({
    getFetchedPost: {
        type: FetchedPostType,
        args: {
            post_id: {
                description: 'The ID of the post',
                type: new GraphQLNonNull(GraphQLInt),
            },
        },
        // eslint-disable-next-line
        resolve: async (root, { post_id }, context, info) =>
            // eslint-disable-next-line
            await context.fetchedPostById.load(post_id || root.post_id),
    },
    getSearchedPosts: {
        type: new GraphQLNonNull(SearchedPostType),
        args: {
            query: {
                description: 'The search query',
                type: new GraphQLNonNull(GraphQLString),
            },
            pagesDone: {
                description:
                    'The number of pages done up till now, 0 by default',
                type: GraphQLInt,
                defaultValue: 0,
            },
            pageNo: {
                description: 'The current page number, 1 by default',
                type: GraphQLInt,
                defaultValue: 1,
            },
            pageSize: {
                description:
                    'The number of results to be returned per page, 50 by ' +
                    'default, value should be between 1 and 100',
                type: GraphQLInt,
                defaultValue: 50,
            },
            resultCount: {
                description:
                    'The number of results obtained till now, 0 by default',
                type: GraphQLInt,
                defaultValue: 0,
            },
        },
        // eslint-disable-next-line
        resolve: async (root, { query, pagesDone, pageNo, pageSize, resultCount }, context, info) => {
            // eslint-disable-next-line
            const returnPosts = await context.getSearchedPosts.load({query, pageNo, pagesDone, resultCount, pageSize});
            insertFetchedPosts(
                returnPosts,
                Fetched_Posts,
                Tag_IDS,
                Source_IDS,
                Subtopic_Tag_Map,
                Source_Subtopic_Map,
                Source_Preference_Map,
            )
                .then(result => {
                    logger.info(`${result.length} Posts inserted`);
                })
                .catch(err => {
                    logger.error(err);
                });
            return returnPosts;
        },
    },
});

module.exports = PostQuery;
