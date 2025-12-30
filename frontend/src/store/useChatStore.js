import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/contacts");
            set({ allContacts: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMyChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/chats");
            set({ chats: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                messageData
            );
            set({ messages: messages.concat(res.data) });

            const { chats } = get();
            const isUserInChats = chats.some((c) => c._id === selectedUser._id);
            if (!isUserInChats) {
                set({ chats: [...chats, selectedUser] });
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    },
    markMessagesAsRead: async () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        try {
            await axiosInstance.put(`/messages/read/${selectedUser._id}`);
        } catch (error) {
            console.log("Error marking messages as read", error);
        }
    },

    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const { selectedUser, chats } = get();

            if (selectedUser && newMessage.senderId === selectedUser._id) {
                set({ messages: [...get().messages, newMessage] });
                // Mark read if applicable (from previous step)
                get().markMessagesAsRead();
            }

            const isSenderInChats = chats.some(
                (c) => c._id === newMessage.senderId
            );

            if (
                !isSenderInChats &&
                newMessage.senderId !== useAuthStore.getState().authUser._id
            ) {
                // Silent fetch to update the sidebar without showing a loading spinner
                axiosInstance
                    .get("/messages/chats")
                    .then((res) => {
                        set({ chats: res.data });
                    })
                    .catch((err) =>
                        console.log("Failed to refresh chats", err)
                    );
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("messagesRead"); // [4] Clean up
    },
}));
