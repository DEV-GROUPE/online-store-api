import mongoose from "mongoose";
import { PasswordHash, createToken } from "../helpers/functions.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import appError from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";
import User from "../models/userModel.js";

/* 
    auth
*/
const loginUser = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.login(email, password);

    // Create a token
    const token = createToken(user._id);

    res.status(200).json({ username: user.username, email, token });
});

const signupUser = asyncWrapper(async (req, res) => {
    const { username, email, password } = req.body;

    const user = await User.signup(username, email, password);

    // Create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
});

/* 
    profile
*/
const getMyProfile = asyncWrapper(async (req, res) => {
    const user_id = req.user.id;
    const users = await User.findById(user_id);
    res.status(200).json({ users });
});

const deleteMyProfile = asyncWrapper(async (req, res) => {
    const id = req.user._id;

    const user = await User.findOneAndDelete({ _id: id });

    if (!user) {
        const error = appError.create("No such user", 404, httpStatusText.FAIL);
        return next(error);
    }

    res.status(200).json(user);
});

const updateMyProfile = asyncWrapper(async (req, res) => {
    const id = req.user._id;

    const password = req.body.password;
    if (password) {
        req.body.password = await PasswordHash(password);
    }

    const user = await User.findOneAndUpdate(
        { _id: id },
        {
            ...req.body,
        }
    );

    if (!user) {
        const error = appError.create("No such user", 404, httpStatusText.FAIL);
        return next(error);
    }

    res.status(200).json(user);
});

/* 
    admin
*/
const getUsers = asyncWrapper(async (req, res) => {
    const users = await User.find();
    res.status(200).json({ users });
});

const getUser = asyncWrapper(async (req, res) => {
    const user_id = req.params.id;
    const users = await User.findById(user_id);
    res.status(200).json({ users });
});

const addUser = asyncWrapper(async (req, res) => {
    const { username, email, password, role } = req.body;
    const user = await User.createUser(username, email, password, role);

    const token = createToken(user._id);

    res.status(200).json({ username, email, token });
});

const deleteUser = asyncWrapper(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = appError.create("Not valid id", 404, httpStatusText.FAIL);
        return next(error);
    }

    const user = await User.findOneAndDelete({ _id: id });

    if (!user) {
        const error = appError.create("No such user", 404, httpStatusText.FAIL);
        return next(error);
    }

    res.status(200).json(user);
});

const updateUser = asyncWrapper(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = appError.create("No such user", 404, httpStatusText.FAIL);
        return next(error);
    }

    const password = req.body.password;
    if (password) {
        req.body.password = await PasswordHash(password);
    }

    const user = await User.findOneAndUpdate(
        { _id: id },
        {
            ...req.body,
        }
    );

    if (!user) {
        const error = appError.create("No such user", 404, httpStatusText.FAIL);
        return next(error);
    }

    res.status(200).json(user);
});

export {
    loginUser,
    signupUser,
    getMyProfile,
    deleteMyProfile,
    updateMyProfile,
    getUsers,
    getUser,
    addUser,
    deleteUser,
    updateUser,
};
