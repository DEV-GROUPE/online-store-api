import express from "express";
import {
    getAllPoducts,
    getProdcut,
    createProdcut,
    deleteProdct,
    updatePoduct,
} from "../controllers/product.controller.js";
import checkIsValidObjId from "../middlewares/checkIsValidObjId.js";
import productvaliditionSchema from "../validations/product.validation.js";


const router = express.Router();

router.route("/").post(productvaliditionSchema(),createProdcut).get(getAllPoducts);
router.use("/:id", checkIsValidObjId);
router
    .route("/:id")
    .get(getProdcut)
    .delete(deleteProdct)
    .put(updatePoduct);
export default router;
