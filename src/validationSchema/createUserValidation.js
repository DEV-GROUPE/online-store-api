import { body } from "express-validator";

// Validation Rules
const createUserValidation = [
    // Username validation
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required.")
        .isAlphanumeric()
        .withMessage("Username must contain only letters and numbers.")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters."),

    // Email validation
    body("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Email must be a valid email address.")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long."),
];

export default createUserValidation;
