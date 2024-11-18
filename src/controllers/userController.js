import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { PasswordHash } from "./../helpers/functions.js";
import User from "../models/userModel.js";

// Create a token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        // Create a token
        const token = createToken(user._id);

        res.status(200).json({ username: user.username, email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signupUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.signup(username, email, password);

        // Create a token
        const token = createToken(user._id);

        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const addUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const user = await User.createUser(username, email, password, role);

        // Create a token
        const token = createToken(user._id);

        res.status(200).json({ username, email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getMyProfile = async (req, res) => {
    
    const user_id = req.user.id;
    try {
        const users = await User.findById(user_id);
        res.status(200).json({ users });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteMyProfile = async (req, res) => {
    const id = req.user._id;

    const user = await User.findOneAndDelete({ _id: id });

    if (!user) {
        return res.status(400).json({ error: "No such user" });
    }

    res.status(200).json(user);
};

const updateMyProfile = async (req, res) => {
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
        return res.status(400).json({ error: "No such user" });
    }

    res.status(200).json(user);
};

export {
    loginUser,
    signupUser,
    getUsers,
    addUser,
    getMyProfile,
    deleteMyProfile,
    updateMyProfile,
};
