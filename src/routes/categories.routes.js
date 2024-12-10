import express from "express";
import requireAuth from "../middlewares/auth/requireAuth.js";
import authorization from "../middlewares/auth/authorization.js";

import {
    getAllCategories,
    getCategory,
    createCategory,
    deleteCategory,
    updateCategory,
} from "../controllers/category.controller.js";
import checkIsValidObjId from "../middlewares/mongoDbIdValidation.js";
import validateRequest from "../middlewares/error/validateRequest.js";
import createCategoryValidation from "../validationSchema/category/createCategoryValidation.js";
import { USER_ROLES } from "../utils/userRoles.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", checkIsValidObjId, getCategory);

router.use(requireAuth);
router.use(authorization(USER_ROLES.ADMIN));

router.post("/", validateRequest(createCategoryValidation), createCategory);
router.delete("/:id", checkIsValidObjId, deleteCategory);
router.put("/:id", checkIsValidObjId, updateCategory);

export default router;
