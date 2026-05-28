import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from 'react-hot-toast';
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ?"http://localhost:5000":"/";

export const useAuthStore = create((set, get) => ({ //set and get can be used due to the help of zustand
    authUser: null,

    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    socket: null,

    isCheckingAuth: true, // when we refresh we check whether the user is authenticated or not

    //online user container
    onlineUsers: [],

    //check authentication
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            //we haven't given the full local host... like this
            //as in the axios file we have already given the baseUrl for this
            set({ authUser: res.data });

            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    //signup functionality
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");

            get().connectSocket();

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false })
        }
    },

    //logout functionality
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    //login functionality
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            //install the npm i socket.io-client for this and for backend simple npm i socket.io
            get().connectSocket();



        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    //update profile functionality
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in update profile: ", error);
            console.log("Data:", data);
            toast.error("Internal Server Error");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser, socket: oldSocket } = get();
        if (!authUser) return;

        // Cleanup old socket
        if (oldSocket) {
            oldSocket.off("getOnlineUsers");
            oldSocket.disconnect();
        }

        const socket = io(BASE_URL, {
            query: { userId: authUser._id },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ['websocket', 'polling']
        });

        // set immediately
        set({ socket });

        socket.on("getOnlineUsers", (userIds) => {
            console.log("Frontend got online users:", userIds);
            set({ onlineUsers: userIds });
        });

        socket.on("disconnect", (reason) => {
            console.log("Frontend socket disconnected:", reason);
        });

        socket.on("connect_error", (err) => {
            console.log("Frontend socket connect error:", err.message);
        });

        console.log("Frontend socket connected:", socket.id);
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },




}))