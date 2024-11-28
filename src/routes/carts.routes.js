import express from "express";
import {
    getPoductsFromCart,
    deleteProductFromCart,
    addOrUpdateCart
    // addProductToCart,
    // updateCartQuantity
} from "../controllers/cart.controller.js";
import checkIsValidObjId from "../middlewares/mongoDbIdValidation.js";
import requireAuth from "../middlewares/auth/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getPoductsFromCart);
router.patch("/", addOrUpdateCart);
// router.post("/", addProductToCart);
// router.patch("/", updateCartQuantity);
router.delete("/:id", checkIsValidObjId, deleteProductFromCart);

export default router;
