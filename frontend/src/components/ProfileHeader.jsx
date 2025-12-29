import { useState, useRef } from "react";
import { LogOutIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ProfileHeader = () => {
    const { logout, authUser, updateProfile } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null);

    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            await updateProfile({ profilePic: base64Image });
        };
    };

    return (
        <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar online">
                        <div
                            role="button"
                            tabIndex={0}
                            className="size-14 rounded-full overflow-hidden relative group cursor-pointer ring-offset-2 ring-offset-base-100 focus:ring-2 focus:ring-green-500 transition-all"
                            onClick={() => fileInputRef.current.click()}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    fileInputRef.current.click();
                                }
                            }}
                        >
                            <img
                                src={
                                    selectedImg ||
                                    authUser.profilePic ||
                                    "/avatar.png"
                                }
                                alt="User image"
                                className="size-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs">
                                    Change
                                </span>
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>

                    {/* Username & Online Text */}
                    <div>
                        <h3 className="text-slate-200 font-medium text-base max-w-45 truncate">
                            {authUser.fullName}
                        </h3>
                        <p className="text-slate-400 text-xs">Online</p>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="flex gap-4 items-center">
                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        onClick={logout}
                    >
                        <LogOutIcon className="size-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
