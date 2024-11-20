import express from "express";
import {
    getAllPoducts,
    getProdcut,
    createProdcut,
    deleteProdct,
    updatePoduct,
} from "../controllers/product.controller.js";


const router = express.Router();

router.route("/").post(createProdcut).get(getAllPoducts);
router
    .route("/:id")
    .get(getProdcut)
    .delete(deleteProdct)
    .put(updatePoduct);
export default router;
