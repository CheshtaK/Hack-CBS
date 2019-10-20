import { request, GraphQLClient } from 'graphql-request';

const { TEST_USER: user, TEST_PASSWORD: password, SERVER_URL } = process.env;

module.exports = {
    async getAuthClient() {
        const query = `{
            signIn(email: "${user}", password:"${password}") {
                accessToken
            }
        }`;

        const { data } = await request(SERVER_URL, query);
        const { accessToken } = data.signIn;
        return {
            client: new GraphQLClient(SERVER_URL, {
                headers: {
                    authorization: `Bearer ${accessToken}`,
                },
            }),
            accessToken,
        };
    },

    async revokeAuthClient(accessToken) {
        const query = `{
            revokeToken(token: "${accessToken}")
        }`;
        return request(SERVER_URL, query);
    },

    async getGuestClient() {
        return new GraphQLClient(SERVER_URL);
    },
};
