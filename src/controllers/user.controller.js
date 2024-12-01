import { PasswordHash, createToken } from "../helpers/functions.js";
import asyncWrapper from "../middlewares//error/asyncWrapper.js";
import appError from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";
import User from "../models/user.model.js";
import { matchedData } from "express-validator";
/* 
    auth
*/
const loginUser = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.login(email, password);

    // Create a token
    const token = createToken(user._id);

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {
            username: user.username,
            email,
            token,
        },
    });
});

const signupUser = asyncWrapper(async (req, res) => {
    const validatedData = matchedData(req, { locations: ["body"] });
    const { username, email, password } = validatedData;

    const user = await User.signup(username, email, password);

    // Create a token
    const token = createToken(user._id);

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {
            email,
            token,
        },
    });
});

/* 
    profile
*/
const getMyProfile = asyncWrapper(async (req, res) => {
    const user_id = req.user.id;
    const user = await User.findById(user_id);
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { user },
    });
});

const deleteMyProfile = asyncWrapper(async (req, res, next) => {
    const id = req.user._id;

    const user = await User.findOneAndDelete({ _id: id });

    if (!user) {
        const error = appError.create("No such user", 404, httpStatusText.FAIL);
        return next(error);
    }

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {user},
    });
});

const updateMyProfile = asyncWrapper(async (req, res, next) => {
    const id = req.user._id;
    const validatedData = matchedData(req, { locations: ["body"] });

    const password = validatedData.password;
    if (password) {
        validatedData.password = await PasswordHash(password);
    }

    const user = await User.findOneAndUpdate({ _id: id }, validatedData);

    if (!user) {
        const error = appError.create("No such user", 404, httpStatusText.FAIL);
        return next(error);
    }

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: user,
    });
});

/* 
    admin
*/
const getUsers = asyncWrapper(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "asc",
    } = req.query;
    // Pagination options
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { [sortBy]: order === "desc" ? -1 : 1 },
    };

    // Paginate all users without filters
    const users = await User.paginate({}, options);

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { users },
    });
});

const getUser = asyncWrapper(async (req, res) => {
    const user_id = req.params.id;
    const users = await User.findById(user_id);
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { users },
    });
});

const addUser = asyncWrapper(async (req, res) => {
    const validatedData = matchedData(req, { locations: ["body"] });
    const { username, email, password, role } = validatedData;
    const user = await User.createUser(username, email, password, role);

    const token = createToken(user._id);

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: {
            username,
            email,
            token,
            role: user.role,
        },
    });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findOneAndDelete({ _id: id });

    if (!user) {
        const error = appError.create("No such user", 404, httpStatusText.FAIL);
        return next(error);
    }

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {user},
    });
});

const updateUser = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const validatedData = matchedData(req, { locations: ["body"] });
    
    if (validatedData.password) {
        validatedData.password = await PasswordHash(validatedData.password);
    }

    const user = await User.findOneAndUpdate({ _id: id }, validatedData);

    if (!user) {
        const error = appError.create("No such user", 404, httpStatusText.FAIL);
        return next(error);
    }

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {user},
    });
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
