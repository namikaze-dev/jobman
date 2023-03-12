const userModel = {
    _users: [
        {
            id: 1,
            name: "test-1",
            email: "test-1@email.com",
            password_hash: Buffer.from("test-1-passord"),
            activated: false,
            created_at: "2023-02-19T10:56:15.000Z",
            version: 2
        },
        {
            id: 2,
            name: "test-2",
            email: "test-2@email.com",
            password_hash: Buffer.from("test-2-passord"),
            activated: true,
            created_at: "2023-02-18T10:56:15.000Z",
            version: 1
        },
        {
            id: 3,
            name: "test-3",
            email: "test-3@email.com",
            password_hash: Buffer.from("test-3-passord"),
            activated: false,
            created_at: "2023-02-18T10:56:15.000Z",
            version: 5
        }
    ],

    async insert(user) {
        user = {
            id: this._users.length + 1,
            name: user.name,
            email: user.email,
            password_hash: user.password_hash,
            activated: false,
            created_at: new Date(),
            version: 1,
        }
        this._users.push(user)
        return user;
    },

    async hashPassword(password) {
        return Buffer.from(password);
    }
}

export default userModel;