/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { request } from 'graphql-request';

const { TEST_USER: user, TEST_PASSWORD: password, SERVER_URL } = process.env;

describe('Creation of a New User Account', () => {
    it('Can be used to log a User in', async () => {
        const loginQuery = `{
            signIn(email: "${user}", password:"${password}") {
                accessToken
            }
        }`;
        const { data } = await request(SERVER_URL, loginQuery);
        expect(data).to.not.be.undefined;
        expect(data).to.be.an('object');
        const { accessToken } = data.signIn;
        expect(accessToken).to.not.be.undefined;
        expect(accessToken).to.be.a('string');
        const userQuery = `{
              getUser(email:"${user}"){
                id
                firstname
                username
                lastname
                dob
                createdAt
                confirmed
                emailtoken
                email
            }
        }`;
        const { data: userData } = await request(SERVER_URL, userQuery);
        expect(userData).to.not.be.undefined;
        expect(userData).to.be.an('object');
        const { getUser } = userData;
        expect(getUser).to.not.be.undefined;
        expect(getUser).to.be.an('object');
        const {
            id,
            firstname,
            username,
            lastname,
            dob,
            createdAt,
            confirmed,
            emailtoken,
            email,
        } = getUser;
        expect(id).to.not.be.undefined;
        expect(id).to.be.a('string');
        if (lastname) {
            expect(lastname).to.be.a('string');
        }
        if (dob) {
            expect(dob).to.be.a('date');
        }
        expect(firstname).to.not.be.undefined;
        expect(firstname).to.be.a('string');
        expect(username).to.not.be.undefined;
        expect(username).to.be.a('string');
        expect(email).to.not.be.undefined;
        expect(email).to.be.a('string');
        expect(createdAt).to.not.be.undefined;
        expect(createdAt).to.be.a('date');
        expect(confirmed).to.not.be.undefined;
        expect(confirmed).to.be.a('boolean');
        expect(emailtoken).to.not.be.undefined;
        expect(emailtoken).to.be.a('string');
        expect(email).to.equal(user);
    });

    it('Rejects Invalid Password', async () => {
        const signInUser = `{
            signIn(email: "${user}", password:"abcd") {
                accessToken
            }
        }`;
        const { data } = await request(SERVER_URL, signInUser);
        expect(data).to.not.be.undefined;
        expect(data).to.be.an('object');
        const { accessToken } = data;
        expect(accessToken).to.be.null;
    });

    it('Rejects Invalid Username', async () => {
        const signInUser = `{
            signIn(email: "12jbxa", password:"${password}") {
                accessToken
            }
        }`;
        const { data } = await request(SERVER_URL, signInUser);
        expect(data).to.not.be.undefined;
        expect(data).to.be.an('object');
        const { accessToken } = data.signIn;
        expect(accessToken).to.be.null;
    });

    it('Can Log a User Out from Session', async () => {
        const loginQuery = `{
            signIn(email: "${user}", password:"${password}") {
                accessToken
            }
        }`;
        const { data } = await request(SERVER_URL, loginQuery);
        expect(data).to.not.be.undefined;
        expect(data).to.be.an('object');
        const { accessToken } = data.signIn;
        expect(accessToken).to.not.be.undefined;
        expect(accessToken).to.be.a('string');
        const revokeQuery = `{
            revokeToken(accessToken: "${accessToken}")
        }`;
        const { data: revokeData } = await request(SERVER_URL, revokeQuery);
        expect(revokeData).to.not.be.undefined;
        expect(revokeData).to.be.an('object');
        const { ifRevoked } = revokeData.revokeToken;
        expect(ifRevoked).to.not.be.undefined;
        expect(ifRevoked).to.be.a('boolean');
        expect(ifRevoked).to.equal(true);
    });
});
