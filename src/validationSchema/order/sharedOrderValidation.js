import { body } from "express-validator";

export const validateAddress = () =>
    body("address")
        .notEmpty()
        .withMessage("Address is required.")
        .bail()
        .isString()
        .withMessage("Address must be a valid string.")
        .bail()
        .isLength({ min: 5, max: 255 })
        .withMessage("Address must be between 5 and 255 characters long.");

export const validateCity = () =>
    body("city")
        .notEmpty()
        .withMessage("City is required.")
        .bail()
        .isString()
        .withMessage("City must be a valid string.")
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage("City must be between 3 and 100 characters long.");

export const validatePincode = () =>
    body("pincode")
        .notEmpty()
        .withMessage("Pincode is required.")
        .bail()
        .matches(/^\d{5}$/)
        .withMessage("Pincode must be exactly 5 numeric digits.");
export const validatePhone = () =>
    body("phone")
        .notEmpty()
        .withMessage("Phone number is required.")
        .bail()
        .isNumeric()
        .withMessage("Phone number must be a valid numeric value.")
        .bail()
        .isLength({ min: 10, max: 15 })
        .withMessage("Phone number must be between 10 and 15 digits long.");

export const validateNotes = () =>
    body("notes")
        .isAlphanumeric()
        .withMessage("Notes must be a valid alphanumeric string.")
        .bail()
        .isLength({ min: 5, max: 500 })
        .withMessage("Notes must be between 5 and 500 characters long.");

export const validateOrderStatus = () =>
    body("status") 
        .notEmpty()
        .withMessage("Order status is required.")
        .bail()
        .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
        .withMessage(
            "Order status must be one of: pending, processing, shipped, delivered, cancelled."
        );
