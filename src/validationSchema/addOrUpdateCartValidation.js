import { body } from "express-validator";

const addOrUpdateCartValidation = [
    body("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product ID"),
    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ gt: 0 })
        .withMessage("Quantity must be a positive integer"),
];
export default addOrUpdateCartValidation;
