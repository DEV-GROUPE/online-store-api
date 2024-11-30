import {
    validateEmail,
    validatePassword,
    validateUsername,
} from "./sharedUserValidation.js";

const updateProfileValidation = [
    validateEmail().optional(),
    validatePassword().optional(),
    validateUsername().optional(),
];

export default updateProfileValidation;
