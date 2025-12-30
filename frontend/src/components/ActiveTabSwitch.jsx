import { useChatStore } from "../store/useChatStore";

const ActiveTabSwitch = () => {
    const { activeTab, setActiveTab } = useChatStore();

    return (
        <div className="w-full flex bg-slate-800/40 p-1 rounded-xl mb-4">
            {/* Tab 1: Chats */}
            <button
                onClick={() => setActiveTab("chats")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "chats"
                        ? "bg-orange-500/80 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                }`}
            >
                Chats
            </button>

            {/* Tab 2: Contacts */}
            <button
                onClick={() => setActiveTab("contacts")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "contacts"
                        ? "bg-orange-500/80 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                }`}
            >
                Contacts
            </button>
        </div>
    );
};

export default ActiveTabSwitch;
