//we have given name with .route just for our convention , it doesn't mean anything
//the file still have .js extension .route is not an extention
import express from "express"
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

//but before updating the progile, authenticate by the middleware "protectRoute"
router.put("/update-profile", protectRoute, updateProfile)


//used whenever we refresh the page , we need to check whether the user is authenticated or not
router.get("/check",protectRoute,checkAuth);

export default router;