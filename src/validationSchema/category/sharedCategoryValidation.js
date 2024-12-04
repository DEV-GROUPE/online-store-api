import { body } from "express-validator";

export const validateCategory = () =>
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required.")
        .isLength({ min: 3 })
        .withMessage("Category name must be at least 3 characters long.")
        .isLength({ max: 50 })
        .withMessage("Category name must not exceed 50 characters.");
