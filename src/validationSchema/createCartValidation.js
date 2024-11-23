import { body } from "express-validator";
import mongoose from "mongoose";

const createCartValidation = [
    body("userId")
        .isMongoId()
        .withMessage("Invalid user ID")
        .notEmpty()
        .withMessage("User ID is required"),

    body("items")
        .isArray()
        .withMessage("Items must be an array")
        .notEmpty()
        .withMessage("Items cannot be empty")
        .custom((value) => {
            value.forEach((item) => {
                if (
                    !item.productId ||
                    !mongoose.Types.ObjectId.isValid(item.productId)
                ) {
                    throw new Error("Invalid product ID");
                }
                if (typeof item.quantity !== "number" || item.quantity < 1) {
                    throw new Error(
                        "Quantity must be a number greater than or equal to 1"
                    );
                }
            });
            return true;
        }),
];
export default createCartValidation;
