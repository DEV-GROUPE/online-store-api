import { body } from "express-validator";
import  Product  from "../../models/product.model.js";
import mongoose from "mongoose";

export const validateProductId = () =>
    body("product")
        .notEmpty()
        .withMessage("Product ID is required.")
        .custom(async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Product ID must be a valid ObjectId.");
            }
            const product = await Product.findOne({ _id: value, isDeleted: false });
            console.log(value,product);
            
            if (!product) {
                throw new Error("Product not found");
            }
            return true;
        });

export const validateQuantity = () =>
    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required.")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer.");
