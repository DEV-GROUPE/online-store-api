import {
    validateEmail,
    validatePassword,
    validateRole,
    validateUsername,
} from "./sharedUserValidation";

const createUserValidation = [
    validateUsername(),
    validateEmail(),
    validatePassword(),
    validateRole(),
];

export default createUserValidation;
