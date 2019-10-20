import {
    GraphQLBoolean,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';

const obtainedQuestion = new GraphQLObjectType({
    name: 'SearchedQuestion',
    description: 'A Searched Question object',
    fields: () => {
        // eslint-disable-next-line
        const db = require('../');
        return {
            owner: {
                type: new GraphQLObjectType({
                    name: 'OwnerInfo',
                    description: 'Owner info needed for accreditation',
                    fields: () => ({
                        reputation: {
                            type: GraphQLInt,
                            description:
                                'The popularity of the user within a particular website network',
                        },
                        accept_rate: {
                            type: GraphQLInt,
                            description:
                                'Numerical indicator of the popularity of the answer',
                        },
                        link: {
                            type: GraphQLString,
                            description:
                                "The link to the user's profile who made this post",
                        },
                    }),
                }),
                description: 'The owner info object returned by the API',
            },
            is_answered: {
                type: GraphQLBoolean,
                description: 'If the question has an accepted answer or not',
            },
            view_count: {
                type: GraphQLInt,
                description: 'The number of views obtained on this answer',
            },
            accepted_answer_id: {
                type: GraphQLInt,
                description: 'The ID of the accepted answer if any',
            },
            answer_count: {
                type: GraphQLInt,
                description: 'The number of answers to this question',
            },
            last_activity_date: {
                type: GraphQLInt,
                description: 'Time when some activity was done with the post',
            },
            creation_date: {
                type: GraphQLInt,
                description: 'Time when the post was created',
            },
            link: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The post_url of this question',
            },
            title: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The title of this question',
            },
            tags: {
                type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
                description: 'The list of tags this searched post has',
            },
        };
    },
});

module.exports = new GraphQLObjectType({
    name: 'ObtainedInformation',
    description: 'The Questions as well as statistics',
    fields: () => ({
        searchResults: {
            type: new GraphQLNonNull(new GraphQLList(obtainedQuestion)),
            description: 'The obtained questions',
        },
        pagesDone: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The number of pages done',
        },
        pageSize: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Maximum number of results in a page',
        },
        resultCount: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Number of results returned up till now',
        },
        pageNo: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The current page number',
        },
        startTime: {
            description:
                'The integer value in milliseconds at which the request was made',
            type: new GraphQLNonNull(GraphQLInt),
        },
        endTime: {
            description:
                'The integer value in milliseconds at which the request was completed',
            type: new GraphQLNonNull(GraphQLInt),
        },
    }),
});
