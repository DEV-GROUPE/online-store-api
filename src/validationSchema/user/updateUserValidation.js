import {
    validateEmail,
    validatePassword,
    validateRole,
    validateUsername,
} from "./sharedUserValidation.js";

const updateUserValidation = [
    validateUsername().optional(),
    validateEmail().optional(),
    validatePassword().optional(),
    validateRole().optional(),
];

export default updateUserValidation;
