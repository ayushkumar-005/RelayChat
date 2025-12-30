import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { X, ArrowLeft } from "lucide-react";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const isOnline = onlineUsers.includes(selectedUser._id);

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === "Escape") setSelectedUser(null);
        };

        window.addEventListener("keydown", handleEscKey);

        return () => window.removeEventListener("keydown", handleEscKey);
    }, [setSelectedUser]);

    return (
        <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 px-6 py-3">
            <div className="flex items-center gap-3">
                <button
                    className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-slate-700/50 transition-colors"
                    onClick={() => setSelectedUser(null)}
                >
                    <ArrowLeft className="size-5 text-slate-400 hover:text-slate-200" />
                </button>

                {/* Avatar */}
                <div className={`avatar ${isOnline ? "online" : ""}`}>
                    <div className="size-10 rounded-full relative">
                        <img
                            src={selectedUser.profilePic || "/avatar.png"}
                            alt={selectedUser.fullName}
                        />
                    </div>
                </div>

                {/* User Info */}
                <div>
                    <h3 className="text-slate-200 font-medium">
                        {selectedUser.fullName}
                    </h3>
                    <p className="text-slate-400 text-sm">
                        {isOnline ? "Online" : "Offline"}
                    </p>
                </div>
            </div>

            {/* Close Button (Desktop) */}
            <button onClick={() => setSelectedUser(null)}>
                <X className="size-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
            </button>
        </div>
    );
};

export default ChatHeader;
