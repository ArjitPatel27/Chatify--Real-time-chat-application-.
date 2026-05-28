import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

//for getting the user sidebar
export const getUsersForSidebar = async (req, res) => {
    try {
        //you can get the user id as the user is already aunthenticated , then it arrives for this
        //method so we have the id present and can be fetched
        const loggedInUserId = req.user._id;

        //as we dont want to see us in the side bar so choose the id which is not equal to our id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//for chats 
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params; //as we have given in the paramaters "id"
        // means in the route of getMessages
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//message that is sent can be a text or an image
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body; //fetching text and image from request body
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        //for image part
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        console.log("Sending message from", senderId, "to", receiverId);

        //    for real time implementation
        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log("Receiver socketId:", receiverSocketId || "NOT FOUND");
        if (receiverSocketId) {
            console.log("Emitting newMessage to", receiverSocketId);
            io.to(receiverSocketId).emit("newMessage", newMessage);
        } else {
            console.log("No socket for receiver - message saved to DB only");
        }

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}