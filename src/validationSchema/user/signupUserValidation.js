import {
    validateEmail,
    validatePassword,
    validateUsername,
} from "./sharedUserValidation";

const signupUserValidation = [
    validateEmail(),
    validatePassword(),
    validateUsername(),
];

export default signupUserValidation;
