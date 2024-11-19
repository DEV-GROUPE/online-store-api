import express from "express";
import requireAuth from "../middlewares/requireAuth.js";
import authorization from "../middlewares/authorization.js";

import {
    getAllcategories,
    getcategory,
    createCategory,
    deleteCotegory,
    updateCotegory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getAllcategories);
router.get("/:id", getcategory);


router.use(requireAuth);
router.use(authorization("admin"));

router.post("/", createCategory);
router.delete("/:id", deleteCotegory);
router.put("/:id", updateCotegory);

export default router;
