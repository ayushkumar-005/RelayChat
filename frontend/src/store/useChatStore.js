import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    unreadMessages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    setActiveTab: (tab) => set({ activeTab: tab }),

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
        if (selectedUser) {
            set((state) => ({
                unreadMessages: state.unreadMessages.filter(
                    (id) => id !== selectedUser._id
                ),
            }));
        }
    },

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

    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            const { selectedUser, chats, unreadMessages } = get();

            const isCurrentChat = selectedUser?._id === newMessage.senderId;

            if (isCurrentChat) {
                set({ messages: [...get().messages, newMessage] });
                get().markMessagesAsRead();
            } else {
                if (!unreadMessages.includes(newMessage.senderId)) {
                    set({
                        unreadMessages: [
                            ...unreadMessages,
                            newMessage.senderId,
                        ],
                    });
                }
                const senderName =
                    chats.find((c) => c._id === newMessage.senderId)
                        ?.fullName || "Someone";
                toast(`New message from ${senderName}`, { icon: "💬" });
            }

            const isSenderInChats = chats.some(
                (c) => c._id === newMessage.senderId
            );
            const isMe =
                newMessage.senderId === useAuthStore.getState().authUser._id;

            if (!isSenderInChats && !isMe) {
                axiosInstance
                    .get("/messages/chats")
                    .then((res) => {
                        set({ chats: res.data });
                    })
                    .catch(console.error);
            }
        });

        socket.on("messagesRead", ({ conversationId }) => {
            const { selectedUser, messages } = get();
            if (selectedUser && selectedUser._id === conversationId) {
                set({
                    messages: messages.map((msg) => ({ ...msg, read: true })),
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
}));
