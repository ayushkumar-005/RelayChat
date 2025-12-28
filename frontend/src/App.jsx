import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import { useAuthStore } from "./store/useAuthStore";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";

const App = () => {
    const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    console.log({ authUser });

    if (isCheckingAuth) return <PageLoader />;

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
                    <Route
                        path="/"
                        element={
                            authUser ? <ChatPage /> : <Navigate to={"/login"} />
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            !authUser ? <LoginPage /> : <Navigate to={"/"} />
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            !authUser ? <SignupPage /> : <Navigate to={"/"} />
                        }
                    />
                </Routes>
            </div>
            <Toaster />
        </div>
    );
};

export default App;
