import { body } from "express-validator";
import mongoose from "mongoose";

export const validateTitle = () =>
    body("title")
        .notEmpty()
        .withMessage("The product title is required.")
        .isString()
        .withMessage("The title must be a valid string.")
        .isLength({ min: 3, max: 100 })
        .withMessage("The title must be between 3 and 100 characters.");

export const validateDescription = () =>
    body("description")
        .notEmpty()
        .withMessage("The product description is required.")
        .isLength({ min: 5, max: 500 })
        .withMessage("The description must be between 5 and 500 characters.");

export const validateImageUrl = () =>
    body("imageUrl")
        .notEmpty()
        .withMessage("The image URL is required.")
        .isURL()
        .withMessage("The image URL must be a valid URL.");

export const validateBrand = () =>
    body("brand")
        .notEmpty()
        .withMessage("The brand name is required.")
        .isString()
        .withMessage("The brand name must be a valid string.")
        .isLength({ min: 2, max: 50 })
        .withMessage("The brand name must be between 2 and 50 characters.");

export const validatePrice = () =>
    body("price")
        .isNumeric()
        .withMessage("The price must be a valid number.")
        .isFloat({ min: 0 })
        .withMessage("The price must be at least 0.");

export const validateTotalStock = () =>
    body("totalStock")
        .isInt({ min: 0 })
        .withMessage("The total stock must be a non-negative integer.");

export const validateCategory = () =>
    body("category")
        .notEmpty()
        .withMessage("The category ID is required.")
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("The category ID must be a valid ObjectId.")
        .bail() // Stops further checks if the ID is invalid
        .custom(async (value) => {
            const categoryExists = await Category.findById(value);
            if (!categoryExists) {
                throw new Error("The category ID does not exist.");
            }
            return true;
        });
