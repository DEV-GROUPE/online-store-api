import { body } from "express-validator";
import Category from "../../models/category.model";

export const validateCategory = () =>
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required.")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Category name must be at least 3 characters long.")
        .bail()
        .isLength({ max: 50 })
        .withMessage("Category name must not exceed 50 characters.")
        .bail()
        .custom(async (name) => {
            const existingUser = await Category.findOne({ name });
            if (existingUser) {
                throw new Error("Name of category is already in use");
            }
            return true;
        });
