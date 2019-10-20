import db from '.';

const models = [
    'User',
    'Preferences',
    'Posts',
    'Answers',
    'Comments_Info',
    'MediaFiles',
];

const ignoreQueries = ['Unavailable_Usernames'];

const ignoreMutations = ['Comments_Answers', 'Comments_Posts', 'Fetched_Posts'];

let retval = models.reduce(
    ({ queries, mutations }, model) => ({
        queries: {
            // eslint-disable-next-line
            ...require(`./${model}/queries`)(db),
            ...queries,
        },
        mutations: {
            // eslint-disable-next-line
            ...require(`./${model}/mutations`)(db),
            ...mutations,
        },
    }),
    { queries: {}, mutations: {} },
);

retval = ignoreMutations.reduce(
    ({ queries, mutations }, model) => ({
        queries: {
            // eslint-disable-next-line
            ...require(`./${model}/queries`)(db),
            ...queries,
        },
        mutations: {
            ...mutations,
        },
    }),
    retval,
);

retval = ignoreQueries.reduce(
    ({ queries, mutations }, model) => ({
        queries: {
            ...queries,
        },
        mutations: {
            // eslint-disable-next-line
            ...require(`./${model}/mutations`)(db),
            ...mutations,
        },
    }),
    retval,
);

module.exports = retval;
