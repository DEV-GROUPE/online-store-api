import {
    validateEmail,
    validatePassword,
    validateUsername,
} from "./sharedUserValidation";

const updateProfileValidation = [
    validateEmail().optional(),
    validatePassword().optional(),
    validateUsername().optional(),
];

export default updateProfileValidation;
