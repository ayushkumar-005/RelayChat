import { useChatStore } from "../store/useChatStore";
import AnimatedBorderContainer from "../components/AnimatedBorderContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import ConversationPlaceholder from "../components/ConversationPlaceholder";

const ChatPage = () => {
    const { activeTab, selectedUser } = useChatStore();

    return (
        <div className="relative w-full max-w-6xl h-[calc(100vh-4rem)] md:h-150">
            <AnimatedBorderContainer>
                <div
                    className={`
                        w-full md:w-80 
                        bg-slate-800/50 backdrop-blur-sm 
                        flex flex-col border-r border-slate-700/50
                        ${selectedUser ? "hidden md:flex" : "flex"} 
                    `}
                >
                    <ProfileHeader />
                    <div className="px-4 pt-2">
                        <ActiveTabSwitch />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {activeTab === "chats" ? (
                            <ChatsList />
                        ) : (
                            <ContactList />
                        )}
                    </div>
                </div>

                <div
                    className={`
                        flex-1 flex flex-col 
                        bg-slate-900/50 backdrop-blur-sm 
                        ${!selectedUser ? "hidden md:flex" : "flex"}
                    `}
                >
                    {selectedUser ? (
                        <ChatContainer />
                    ) : (
                        <ConversationPlaceholder />
                    )}
                </div>
            </AnimatedBorderContainer>
        </div>
    );
};

export default ChatPage;
