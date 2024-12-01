import express from "express";
import {
    getPoductsFromCart,
    deleteProductFromCart,
    addOrUpdateCart
} from "../controllers/cart.controller.js";
import checkIsValidObjId from "../middlewares/mongoDbIdValidation.js";
import requireAuth from "../middlewares/auth/requireAuth.js";
import validateRequest from "../middlewares/error/validateRequest.js";
import {addOrUpdateCartValidation} from "../validationSchema/cart/index.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getPoductsFromCart);
router.patch("/",validateRequest(addOrUpdateCartValidation), addOrUpdateCart);
router.delete("/:id", checkIsValidObjId, deleteProductFromCart);

export default router;
