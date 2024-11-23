import express from "express";
import {
    createCart,
    getAllCarts,
    getCart,
    deleteCart,
    updateCart,
} from "../controllers/cart.controller.js";
import checkIsValidObjId from "../middlewares/mongoDbIdValidation.js";
import validateRequest from "../middlewares/error/validateRequest.js";
import createCartValidation from "../validationSchema/createCartValidation.js";

const router = express.Router();

router.post("/", validateRequest(createCartValidation),createCart);
router.get("/", getAllCarts);

router.get("/:id", checkIsValidObjId, getCart);
router.put("/:id", checkIsValidObjId, updateCart);
router.delete("/:id", checkIsValidObjId, deleteCart);

export default router;
