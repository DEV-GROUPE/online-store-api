import express from "express";
import {
    getAllPoducts,
    getProduct,
    createProduct,
    deleteProduct,
    updatePoduct,
} from "../controllers/product.controller.js";
import checkIsValidObjId from "../middlewares/mongoDbIdValidation.js";
import createProductValidation from "../validationSchema/createProductValidation.js";
import validateRequest from "../middlewares/error/validateRequest.js";
import requireAuth from "../middlewares/auth/requireAuth.js";
import authorization from "../middlewares/auth/authorization.js";

const router = express.Router();

// get products
router.get("/", getAllPoducts);

// get product
router.get("/:id", checkIsValidObjId, getProduct);

router.use(requireAuth);
router.use(authorization("admin"));

// create
router.post("/", validateRequest(createProductValidation), createProduct);
// delete
router.delete("/:id", checkIsValidObjId, deleteProduct);
// update
router.put("/:id", checkIsValidObjId, updatePoduct);

export default router;
