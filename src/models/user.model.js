import mongoose from "mongoose";
import { PasswordHash } from "../helpers/functions.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { USER_ROLES } from "../utils/userRoles.js";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(USER_ROLES),
        default: USER_ROLES.USER,
        required: true,
    },
});

// static signup method
userSchema.statics.signup = async function (username, email, password) {
    // validation
    if (!email || !password || !username ||!password) {
        throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
        throw Error("Email not valid");
    }

    const usernameExists = await this.findOne({ username });
    if (usernameExists) {
        throw Error("Email already in use");
    }

    const emailExists = await this.findOne({ email });

    if (emailExists) {
        throw Error("Email already in use");
    }

    const hash = await PasswordHash(password);

    const user = await this.create({ username, email, password: hash });

    return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("All fields must be filled");
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error("Incorrect email");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error("Incorrect password");
    }

    return user;
};

// static signup method
userSchema.statics.createUser = async function (
    username,
    email,
    password,
    role
) {
    // validation
    if (!email || !password || !username) {
        throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
        throw Error("Email not valid");
    }
    if (!Object.values(USER_ROLES).includes(role)) {
        role = "user";
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw Error("Email already in use");
    }

    const hash = await PasswordHash(password);

    const user = await this.create({ username, email, password: hash, role });

    return user;
};

export default mongoose.model("User", userSchema);
