import {
    validateEmail,
    validatePassword,
    validateRole,
    validateUsername,
} from "./sharedUserValidation.js"; 

const createUserValidation = [
    validateUsername(),
    validateEmail(),
    validatePassword(),
    validateRole(),
];

export default createUserValidation;
