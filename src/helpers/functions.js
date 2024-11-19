import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const PasswordHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

export { PasswordHash, createToken};
