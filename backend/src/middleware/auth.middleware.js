import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; //as the name of cookie we have assigned as "jwt"
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token provided" });
        }

        //now verfiy the token obtained
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized  - Invalid Token" })
        }
        const user = await User.findById(decoded.userId).select("-password");

        //if user not found
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        //if everything ok then go to the next method specified within the routes
        next();
    } catch (error) {
        console.log("Error in protect Route middleware: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}