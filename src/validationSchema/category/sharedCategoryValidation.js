import { body } from "express-validator";

export const validateCategory = () =>
    body("name")
        .trim()
        .required()
        .min(3)
        .max(50)
        .messages({
            "string.empty": "Category name is required.",
            "string.min": "Category name must be at least 3 characters long.",
            "string.max": "Category name must not exceed 50 characters.",
        });
