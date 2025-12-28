import { Route, Routes } from "react-router";
import { useAuthStore } from "./store/useAuthStore";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";

const App = () => {
    const { authUser, login, isLoggedIn } = useAuthStore();

    return (
        <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
            {/* DECORATORS - Warm oranges and deep purples clashing against each other */}
            <div className="absolute inset-0 bg-[#0f0518] overflow-hidden">
                <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-violet-700/20 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
            </div>
            {/* Routes */}
            <div className="relative z-10">
                <Routes>
                    <Route path="/" element={<ChatPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
