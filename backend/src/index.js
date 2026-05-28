import express from "express" //type is module in package.json rather than common.js
import dotenv from "dotenv"

//importing it for frontend and backend interaction
import cors from "cors"
//as frontend works in different local host and backend too thus cors helps
// in establishing the interaction between the two

// remember at last for deploying we ignore the node modules of both frontend and backend and .env file , thus gitignore is required
// but we have build and start in the external package.json file and we have included the npm install commands for both frontend and backend
import path from "path"

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js";

// from socket.js file import 
import {app,server} from "./lib/socket.js"

dotenv.config();

// const app = express();  //we have delete this line as it is already in socket.js file
//and for real time application or implementation we have done it



const PORT = process.env.PORT;
// app.use(express.json());

const __dirname = path.resolve();

//we have increase the limit , so that the image with larger size can be uploaded
app.use(express.json({ limit: '50mb' })); // For JSON requests
app.use(express.urlencoded({ limit: '50mb', extended: true }));

//for cookie-parser
app.use(cookieParser());

//for connection between frontend and backend
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

//body parser before the route part always
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    //if we visit any other route other than these above given
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
    
}

//here we replace the app from the server with the help of socket.js file for real time implementation
server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    connectDB();
})