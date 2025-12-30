import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    chats: [],
    allContacts: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    activeTab: "chats",

    setActiveTab: (tab) => set({ activeTab: tab }),

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
            set({ messages: [...messages, res.data] });

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

    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage");
        socket.off("messagesRead");

        socket.on("newMessage", (newMessage) => {
            const { selectedUser } = get();
            if (!selectedUser) return;

            const isCurrentChat = selectedUser._id === newMessage.senderId;
            if (isCurrentChat) {
                set({ messages: [...get().messages, newMessage] });

                // Auto-mark as read since user is viewing the chat
                get().markMessagesAsRead();
            }
        });

        socket.on("messagesRead", ({ conversationId }) => {
            const { selectedUser } = get();
            if (!selectedUser) return;

            if (selectedUser._id === conversationId) {
                set({
                    messages: get().messages.map((message) => ({
                        ...message,
                        read: true,
                    })),
                });
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage");
        socket.off("messagesRead");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    markMessagesAsRead: async () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        try {
            await axiosInstance.put(`/messages/read/${selectedUser._id}`);
            set({
                messages: get().messages.map((msg) => ({ ...msg, read: true })),
            });
        } catch (error) {
            console.log("Error marking messages as read", error);
        }
    },
}));
