import { body } from "express-validator";
import { Product } from "./../../models/product.model";
import mongoose from "mongoose";

export const validateProductId = () =>
    body("productId")
        .notEmpty()
        .withMessage("Product ID is required.")
        .custom(async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Product ID must be a valid ObjectId.");
            }
            const product = await Product.findById(value);
            if (!product) {
                throw new Error("Product does not exist.");
            }
            return true;
        });

export const validateQuantity = () =>
    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required.")
        .bail() // Stops further validation if this fails
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer.")
        .custom(async (quantity, { req }) => {
            const { productId } = req.body;
            const product = await Product.findById(productId);
            if (product && quantity > product.quantity) {
                throw new Error(
                    `Requested quantity exceeds stock. Only ${product.quantity} left.`
                );
            }
        });
