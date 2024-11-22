import express from "express";
import requireAuth from "../middlewares/auth/requireAuth.js";
import authorization from "../middlewares/auth/authorization.js";

import {
    loginUser,
    signupUser,
    getMyProfile,
    deleteMyProfile,
    updateMyProfile,
    getUsers,
    getUser,
    addUser,
    deleteUser,
    updateUser,
} from "../controllers/user.controller.js";
import checkIsValidObjId from "../middlewares/mongoDbIdValidation.js";
import validateRequest from "../middlewares/error/validateRequest.js";
import createUserValidation from "../validationSchema/createUserValidation.js";

const router = express.Router();

/* 
    -no role
    -auth
*/

//login
router.post("/login", loginUser);
//signup
router.post("/signup", signupUser);

/* 
    -user role
    -profile crud
*/

router.use(requireAuth);

// get profile
router.get("/profile", getMyProfile);
// update profile
router.patch("/profile", updateMyProfile);
// delete profile
router.delete("/profile", deleteMyProfile);

/* 
    -admin role
    -user crud
*/

router.use(authorization("admin"));

// get all users
router.get("/", getUsers);
// get user
router.get("/:id", checkIsValidObjId, getUser);
// add user
router.post("/", validateRequest(createUserValidation), addUser);
// update user
router.patch("/:id", checkIsValidObjId, updateUser);
// delete user
router.delete("/:id", checkIsValidObjId, deleteUser);

export default router;
