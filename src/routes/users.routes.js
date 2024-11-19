import express from "express";
import requireAuth from "../middlewares/requireAuth.js";
import authorization from "../middlewares/authorization.js";

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
router.get("/:id", getUser);
// add user
router.post("/:id", addUser);
// update user
router.patch("/:id", updateUser);
// delete user
router.delete("/:id", deleteUser);

export default router;
