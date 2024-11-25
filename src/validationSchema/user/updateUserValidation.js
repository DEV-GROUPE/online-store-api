import {
    validateEmail,
    validatePassword,
    validateRole,
    validateUsername,
} from "./sharedUserValidation";

const updateUserValidation = [
    validateUsername().optional(),
    validateEmail().optional(),
    validatePassword().optional(),
    validateRole().optional(),
];

export default updateUserValidation;
