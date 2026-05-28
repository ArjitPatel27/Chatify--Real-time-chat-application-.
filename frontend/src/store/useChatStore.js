import { create } from "zustand"
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({ //set and get that can be obtained with the help of zustand
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessageLoading: false,

    //get users
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    //get the messages
    getMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessageLoading: false });
        }
    },

    //for sending the message
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] })
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser || !useAuthStore.getState().socket) return;

        const socket = useAuthStore.getState().socket;
        get().unsubscribeFromMessages(); // cleanup first
        console.log("Subscribing to messages for selected user:", selectedUser._id);
        socket.on("newMessage", (newMessage) => {
            console.log("New message received from", newMessage.senderId, "selected:", selectedUser._id);
            if (newMessage.senderId.toString() !== selectedUser._id.toString()) {
                // Filter out own messages (optimistic added)
                return;
            }
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            console.log("Unsubscribing from newMessage");
            socket.off("newMessage");
        }
    },

    //for selecting the user on the slider part
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))