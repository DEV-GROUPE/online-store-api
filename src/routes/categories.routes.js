import express from "express";
import {
    getAllcategories,
    getcategory,
    createCategory,
    deleteCotegory,
    updateCotegory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.route("/").post(createCategory).get(getAllcategories);
router
    .route("/:id")
    .get(getcategory)
    .delete(deleteCotegory)
    .put(updateCotegory);
export default router;
