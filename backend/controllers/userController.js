import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import sql from '../config/sqldb.js';
import bcrypt from 'bcryptjs';

const matchPassword = async function (enteredPassword, userPassword) {
    return await bcrypt.compare(enteredPassword, userPassword);
};

// @desc    Auth User & Get Token
// @route   POST api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const [user] = await sql('User').where({ email: email });
    if (user && (await matchPassword(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid Email or Passowrd');
    }
});

// @desc    Register a New User
// @route   POST api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const [userExist] = await sql('User').where({ email: email });

    if (userExist) {
        res.status(400);
        throw new Error('User already exists'); //
    }

    const salt = await bcrypt.genSalt(10);
    const [user] = await sql('User').insert(
        {
            name: name,
            email: email,
            password: await bcrypt.hash(password, salt),
        },
        '*'
    );

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Get User Profile
// @route   GET api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const [user] = await sql('User').where('_id', req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update User Profile
// @route   PUT api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const [user] = await sql('User').where('_id', req.user._id);
    if (user) {
        const salt = await bcrypt.genSalt(10);
        const [updatedUser] = req.body.password
            ? await sql('User')
                  .update(
                      {
                          name: req.body.name || user.name,
                          email: req.body.email || user.email,
                          password: await bcrypt.hash(req.body.password, salt),
                      },
                      '*'
                  )
                  .where('_id', req.user._id)
            : await sql('User')
                  .update(
                      {
                          name: req.body.name || user.name,
                          email: req.body.email || user.email,
                      },
                      '*'
                  )
                  .where('_id', req.user._id);

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get All Users
// @route   GET api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await sql.select('*').from('User');
    res.json(users);
});

// @desc    Delete User
// @route   DELETE api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const [user] = await sql('User').where('_id', req.params.id);

    if (user) {
        await sql('User').where('_id', req.params.id).del();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get User by ID
// @route   GET api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const [user] = await sql('User').where('_id', req.params.id);
    if (user) {
        const { password, ...userFiltered } = user;
        res.json(userFiltered);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update User
// @route   PUT api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const [user] = await sql('User').where('_id', req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;

        const updatedUser = await sql('User')
            .update(
                {
                    name: req.body.name || user.name,
                    email: req.body.email || user.email,
                    isAdmin: req.body.isAdmin,
                },
                '*'
            )
            .where('_id', req.params.id);

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
};
