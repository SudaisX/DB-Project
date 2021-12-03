import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
    },
    {
        name: 'Nuna',
        email: 'nuna@example.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        name: 'Joji',
        email: 'joji@example.com',
        password: bcrypt.hashSync('123456', 10),
    },
];

export default users;
