import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { gql } from 'apollo-server-express';
import fields from '../models/fields';

const { queries, mutations } = fields;

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: () => queries,
    }),
    mutation: new GraphQLObjectType({
        name: 'RootMutation',
        fields: () => mutations,
    }),
});
