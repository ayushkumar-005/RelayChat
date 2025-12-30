import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { Check, CheckCheck } from "lucide-react";

const ChatContainer = () => {
    const {
        selectedUser,
        getMessagesByUserId,
        messages,
        isMessagesLoading,
        subscribeToMessages,
        unsubscribeFromMessages,
        markMessagesAsRead,
    } = useChatStore();
    const { authUser, socket } = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (!socket) return;

        subscribeToMessages();

        return () => unsubscribeFromMessages();
    }, [socket, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (!selectedUser) return;

        getMessagesByUserId(selectedUser._id);
    }, [selectedUser, getMessagesByUserId]);

    useEffect(() => {
        if (!selectedUser || messages.length === 0) return;

        const hasUnreadMessages = messages.some(
            (msg) => msg.senderId === selectedUser._id && !msg.read
        );

        if (hasUnreadMessages) {
            markMessagesAsRead();
        }
    }, [selectedUser, messages, markMessagesAsRead]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <>
            <ChatHeader />
            <div className="flex-1 px-6 overflow-y-auto py-8">
                {messages.length > 0 && !isMessagesLoading ? (
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`chat ${
                                    msg.senderId === authUser._id
                                        ? "chat-end"
                                        : "chat-start"
                                }`}
                            >
                                <div
                                    className={`chat-bubble relative flex flex-col ${
                                        msg.senderId === authUser._id
                                            ? "bg-cyan-600 text-white"
                                            : "bg-slate-800 text-slate-200"
                                    }`}
                                >
                                    {msg.image && (
                                        <img
                                            src={msg.image}
                                            alt="Shared"
                                            className="rounded-lg h-48 object-cover mb-2"
                                        />
                                    )}
                                    {msg.text && <p>{msg.text}</p>}

                                    {/* Time and Ticks Row */}
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span className="text-[10px] opacity-70">
                                            {new Date(
                                                msg.createdAt
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>

                                        {msg.senderId === authUser._id && (
                                            <span
                                                className={
                                                    msg.read
                                                        ? "text-blue-300"
                                                        : "text-slate-300"
                                                }
                                            >
                                                {msg.read ? (
                                                    <CheckCheck size={14} />
                                                ) : (
                                                    <Check size={14} />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messageEndRef} />
                    </div>
                ) : isMessagesLoading ? (
                    <MessagesLoadingSkeleton />
                ) : (
                    <NoChatHistoryPlaceholder name={selectedUser.fullName} />
                )}
            </div>
            <MessageInput />
        </>
    );
};

export default ChatContainer;
