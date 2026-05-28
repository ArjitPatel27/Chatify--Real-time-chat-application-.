import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

//for the other users on the sidebar in chat application
router.get("/users",protectRoute,getUsersForSidebar)

//for the chat history or fetching messages on chat screen
router.get("/:id",protectRoute,getMessages)

//message that is sent can be a text or an image
router.post("/send/:id",protectRoute,sendMessage);

export default router;