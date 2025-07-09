"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export function UserProfile() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("youtubeToken");
    sessionStorage.removeItem("platform");
    
    router.push("/login");
  };

  // Hàm tạo avatar với chữ cái đầu của username
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
      {/* User Info */}
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
        <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-medium text-sm">
          {username ? getInitials(username) : <User size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {username || "Người dùng"}
          </p>
          <p className="text-xs text-gray-500">
            Đang hoạt động
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-full py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut size={18} />
        <span>Đăng xuất</span>
      </button>
    </div>
  );
}
