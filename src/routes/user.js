import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import authorization from "../middleware/authorization.js";

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
} from "../controllers/userController.js";

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
router.get("/", getMyProfile);
// update profile
router.patch("/", updateMyProfile);
// delete profile
router.delete("/", deleteMyProfile);

/* 
    -admin role
    -user crud
*/

router.use(authorization("admin"));

// get all users
router.get("/admin", getUsers);
// get user
router.get("/admin/:id", getUser);
// add user
router.post("/admin/:id", addUser);
// update user
router.patch("/admin/:id", updateUser);
// delete user
router.delete("/admin/:id", deleteUser);

export default router;
