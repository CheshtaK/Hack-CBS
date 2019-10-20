import bodyParser from 'body-parser';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import express from 'express';
import { v4 } from 'uuid';
import session from 'express-session';
import passport from 'passport';
import jwt from 'express-jwt';
import cors from 'cors';
import { graphqlUploadExpress } from 'graphql-upload';

import Context from './loaders';
import errors from './errors';
import logger from './helpers/logger';
import schema from './schema';
// eslint-disable-next-line import/named
import { checkBlacklist } from './helpers/token-util';

require('dotenv').config();

const { NODE_ENV, APP_SECRET, FRONT_END_URL } = process.env;

const app = express();
const PORT = 3000;

process.env.UV_THREADPOOL_SIZE = process.env.POOL_SIZE;

const isRevokedCallback = async (req, payload, done) => {
    const tokenId = payload.jti;
    if (!tokenId) {
        return done(null, false);
    }
    const blacklisted = await checkBlacklist(tokenId);
    if (typeof blacklisted !== 'undefined') {
        return done(null, blacklisted);
    }
    return done(null, true);
};

const auth = jwt({
    secret: process.env.APP_SECRET,
    credentialsRequired: false,
    isRevoked: isRevokedCallback,
});

const corsOptions = {
    origin: FRONT_END_URL,
    credentials: true,
};

app.use(
    session({
        // eslint-disable-next-line no-unused-vars
        genid: req => v4(),
        secret: APP_SECRET,
    }),
);

app.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
    }),
);

app.use(
    '/graphql',
    cors(corsOptions),
    bodyParser.json(),
    [
        auth,
        graphqlUploadExpress({
            maxFileSize: 10000000,
            maxFiles: 10,
        }),
    ],
    (req, res, next) =>
        graphqlExpress({
            schema,
            context: new Context(req),
            formatError(err) {
                errors.report(err, req); // <-- log the error
                return {
                    message: err.message,
                    code: err.originalError && err.originalError.code,
                    locations: err.locations,
                    path: err.path,
                    state: err.originalError && err.originalError.state,
                };
            },
        })(req, res, next),
);

if (NODE_ENV === 'development') {
    app.get(
        '/graphiql',
        graphiqlExpress({
            endpointURL: '/graphql',
        }),
        // eslint-disable-next-line no-unused-vars
        (req, res) => {
            logger.info(`Running a GraphQL API server at /graphql`);
        },
    );
}

const server = app.listen(PORT, () => {
    logger.info(`GraphQL server listening on port ${PORT}`);
});

server.timeout = 0;
