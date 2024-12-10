import express from "express";
import { createOrder, getAllOrders, getOrder, getUserOrders, updateOrderStatus } from "../controllers/order.controller.js";
import requireAuth from "../middlewares/auth/requireAuth.js";
import authorization from "../middlewares/auth/authorization.js";
import { USER_ROLES } from "../utils/userRoles.js";
import validateRequest from "../middlewares/error/validateRequest.js";
import createOrderValidation from "../validationSchema/order/createOrderValidation.js";
import updateOrderValidation from "../validationSchema/order/updateOrderValidation.js";
import checkIsValidObjId from "../middlewares/mongoDbIdValidation.js";

const router = express.Router(); 

router.use(requireAuth);
router.post("/",validateRequest(createOrderValidation), createOrder);
router.get("/", getUserOrders);
router.get("/:id",checkIsValidObjId, getOrder);

router.use(authorization(USER_ROLES.ADMIN));

router.get("/admin/all", getAllOrders);
router.patch("/:id",checkIsValidObjId,validateRequest(updateOrderValidation), updateOrderStatus);
router.get("/:id",checkIsValidObjId, getOrder);

export default router;
