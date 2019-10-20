const { TEST_PASSWORD, TEST_USERNAME, TEST_USER } = process.env;
module.exports = db => ({
    up: async () => {
        const { User } = db;
        await User.sync();

        return User.bulkCreate(
            [
                {
                    firstname: 'Karan',
                    lastname: 'Aggarwal',
                    password: TEST_PASSWORD,
                    username: TEST_USERNAME,
                    email: TEST_USER,
                    dob: '03/07/1998',
                    last_login: null,
                    client: 1,
                    confirmed: true,
                },
            ],
            { individualHooks: true, ignoreDuplicates: true },
        );
    },
    down: () => db.sequelize.drop(),
});
