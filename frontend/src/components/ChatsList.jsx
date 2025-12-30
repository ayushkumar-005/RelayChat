import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import UsersLoadingSkeleton from "../components/UsersLoadingSkeleton";
import NoChatsFound from "../components/NoChatsFound";

const ChatsList = () => {
    const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } =
        useChatStore();
    const { onlineUsers } = useAuthStore();

    useEffect(() => {
        getMyChatPartners();
    }, [getMyChatPartners]);

    if (isUsersLoading) return <UsersLoadingSkeleton />;
    if (chats.length === 0) return <NoChatsFound />;

    return (
        <div className="overflow-y-auto pb-2">
            {chats.map((chat) => (
                <div
                    key={chat._id}
                    onClick={() => setSelectedUser(chat)}
                    className="w-full p-3 flex items-center gap-3 hover:bg-slate-800/50 transition-all cursor-pointer rounded-lg border border-transparent"
                >
                    <div
                        className={`avatar ${
                            onlineUsers.includes(chat._id) ? "online" : ""
                        }`}
                    >
                        <div className="size-10 rounded-full">
                            <img
                                src={chat.profilePic || "/avatar.png"}
                                alt={chat.fullName}
                            />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-medium truncate text-slate-200">
                                {chat.fullName}
                            </h3>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatsList;
