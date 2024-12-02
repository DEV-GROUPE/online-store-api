import mongoose from "mongoose";
import { PasswordHash } from "../helpers/functions.js";
import bcrypt from "bcrypt";
import { USER_ROLES } from "../utils/userRoles.js";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
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
        cart: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1,
                },
            },
        ],
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
    },
    { timestamps: true }
);
userSchema.pre(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});
userSchema.statics.signup = async function (username, email, password) {
    const hash = await PasswordHash(password);
    const user = await this.create({ username, email, password: hash });
    return user;
};

userSchema.statics.login = async function (email, password) {
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

userSchema.statics.createUser = async function (
    username,
    email,
    password,
    role
) {
    const hash = await PasswordHash(password);
    const user = await this.create({ username, email, password: hash, role });
    return user;
};

userSchema.plugin(mongoosePaginate);
export default mongoose.model("User", userSchema);
