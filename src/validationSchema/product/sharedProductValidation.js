import { body } from "express-validator";
import mongoose from "mongoose";

export const validateTitle = () =>
    body("title")
        .trim()
        .notEmpty()
        .withMessage("The product title is required.")
        .bail()
        .isString()
        .withMessage("The title must be a valid string.")
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage("The title must be between 3 and 100 characters.");

export const validateDescription = () =>
    body("description")
        .trim()
        .notEmpty()
        .withMessage("The product description is required.")
        .bail()
        .isLength({ min: 5, max: 500 })
        .withMessage("The description must be between 5 and 500 characters.");

export const validateImageUrl = () =>
    body("imageUrl")
        .trim()
        .notEmpty()
        .withMessage("The image URL is required.")
        .bail()
        .isURL()
        .withMessage("The image URL must be a valid URL.");

export const validateBrand = () =>
    body("brand")
        .trim()
        .notEmpty()
        .withMessage("The brand name is required.")
        .bail()
        .isString()
        .withMessage("The brand name must be a valid string.")
        .bail()
        .isLength({ min: 2, max: 50 })
        .withMessage("The brand name must be between 2 and 50 characters.");

export const validatePrice = () =>
    body("price")
        .trim()
        .notEmpty()
        .withMessage("The price is required.")
        .bail()
        .isNumeric()
        .withMessage("The price must be a valid number.")
        .bail()
        .isFloat({ min: 0 })
        .withMessage("The price must be at least 0.");

export const validateTotalStock = () =>
    body("totalStock")
        .trim()
        .notEmpty()
        .withMessage("The total stock is required.")
        .bail()
        .isInt({ min: 0 })
        .withMessage("The total stock must be a non-negative integer.");

export const validateCategory = () =>
    body("category")
        .trim()
        .notEmpty()
        .withMessage("The category ID is required.")
        .bail()
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("The category ID must be a valid ObjectId.")
        .bail()
        .custom(async (value) => {
            const categoryExists = await Category.findById(value);
            if (!categoryExists) {
                throw new Error("The category ID does not exist.");
            }
            return true;
        });
