import {
    validateEmail,
    validatePassword,
    validateUsername,
} from "./sharedUserValidation.js";

const signupUserValidation = [
    validateEmail(),
    validatePassword(),
    validateUsername(),
];

export default signupUserValidation;
