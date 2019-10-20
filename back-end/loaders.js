import DataLoader from 'dataloader';
import type { request as Request } from 'express';
import {
    getFetchedPostsLoader,
    getSearchedPostsLoader,
} from './model-loaders/fetched_posts';
import {
    // eslint-disable-next-line import/named
    getAnswersByUserLoader,
    // eslint-disable-next-line import/named
    getAnswerByIdLoader,
    // eslint-disable-next-line import/named
    getAnswerForPostsLoader,
} from './model-loaders/answers';
// eslint-disable-next-line import/named
import { getUserLoader, getPostsByUserLoader } from './model-loaders/user';
import getPostByIdLoader from './model-loaders/posts';
import getPreferenceByIdLoader from './model-loaders/preference';
import {
    // eslint-disable-next-line import/named
    getCommentsByIdLoader,
    // eslint-disable-next-line import/named
    getCommentsByUserLoader,
} from './model-loaders/comments_info';
import getCommentsForPostLoader from './model-loaders/comments_posts';
import getCommentsForAnswerLoader from './model-loaders/comments_answer';

/* @flow */
class Context {
    request: Request;

    user: any;

    constructor(request: Request) {
        this.request = request;
        this.user = request.user;
    }

    get user(): any {
        return this.request.user;
    }

    set user(user) {
        // eslint-disable-next-line no-underscore-dangle
        this._user = user;
    }

    answersByUser = new DataLoader(
        keys =>
            new Promise(async (resolve, reject) => {
                await getAnswersByUserLoader(keys)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }),
    );

    userById = new DataLoader(
        keys =>
            new Promise(async (resolve, reject) => {
                await getUserLoader(keys)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }),
    );

    answerById = new DataLoader(
        keys =>
            new Promise(async (resolve, reject) => {
                await getAnswerByIdLoader(keys)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }),
    );

    preferenceById = new DataLoader(
        keys =>
            new Promise(async (resolve, reject) => {
                await getPreferenceByIdLoader(keys)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }),
    );

    getSearchedPosts = new DataLoader(
        keys =>
            new Promise(async (resolve, reject) => {
                await getSearchedPostsLoader(keys)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }),
    );

    postById = new DataLoader(
        keys =>
            new Promise(async (resolve, reject) => {
                await getPostByIdLoader(keys)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }),
    );

    fetchedPostById = new DataLoader(
        keys =>
            new Promise(async (resolve, reject) => {
                await getFetchedPostsLoader(keys)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }),
    );

    commentsById = new DataLoader(
        keys =>
            new Promise(async (resolve, reject) => {
                await getCommentsByIdLoader(keys)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }),
    );

    commentsByUser = new DataLoader(
        keys =>
            new Promise(async (resolve, reject) => {
                await getCommentsByUserLoader(keys)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }),
    );

    commentsForPosts = new DataLoader(
        keys =>
            new Promise(async (resolve, reject) => {
                await getCommentsForPostLoader(keys)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }),
    );

    commentsForAnswer = new DataLoader(
        keys =>
            new Promise(async (resolve, reject) => {
                await getCommentsForAnswerLoader(keys)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }),
    );

    postsByUser = new DataLoader(
        keys =>
            new Promise(async (resolve, reject) => {
                await getPostsByUserLoader(keys)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }),
    );

    answersForPosts = new DataLoader(
        keys =>
            new Promise(async (resolve, reject) => {
                await getAnswerForPostsLoader(keys)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }),
    );
}

export default Context;
