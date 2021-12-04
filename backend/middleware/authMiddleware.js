import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import sql from '../config/sqldb.js';

const protect = expressAsyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const [userFound] = await sql('User').where('_id', decoded.id);
            const { password, ...user } = userFound;

            req.user = user;

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not Authorized, token failed.');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized.. No token found.');
    }
});

const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorised as an Admin');
    }
};

export { protect, isAdmin };
