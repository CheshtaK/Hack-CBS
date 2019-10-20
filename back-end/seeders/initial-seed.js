module.exports = {
    up: async migration => {
        const now = new Date();
        await migration.bulkInsert(
            'Users',
            [
                {
                    id: 'b54b9280-9cd1-514a-fd80-3bffe4468e4f',
                    firstname: 'Tom',
                    password: 'secretHashedPassword',
                    lastname: 'Hanks',
                    createdAt: now,
                    updatedAt: now,
                    email: 'tomhanks@tom.com',
                },
            ],
            {},
        );
    },
    down: async migration => {
        await migration.bulkDelete('Users', null, {});
    },
};
