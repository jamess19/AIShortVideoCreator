"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Eye, Video, Plus, Layers } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  const routes = [
    {
      icon: Home,
      label: "Trang chủ",
      href: "/",
      active: pathname === "/",
    },
    {
      icon: FileText,
      label: "Soạn kịch bản",
      href: "/script",
      active: pathname === "/script",
    },
    {
      icon: Layers,
      label: "Cấu hình từng cảnh",
      href: "/scenes",
      active: pathname === "/scenes",
    },
    {
      icon: Eye,
      label: "Xem trước video",
      href: "/preview",
      active: pathname === "/preview",
    },
    {
      icon: Video,
      label: "Video của tôi",
      href: "/my-videos",
      active: pathname === "/my-videos",
    },
  ];

  return (
    <div className="w-64 fixed top-0 left-0 h-screen border-r border-gray-200 bg-white flex flex-col z-50">
      <div className="p-4">
        <h1 className="text-xl font-bold text-purple-600 flex items-center">
          <Video className="mr-2" /> VideoAI
        </h1>
      </div>
      <nav className="mt-6 flex-grow">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`flex items-center px-4 py-3 ${
              route.active
                ? "text-purple-600 bg-purple-50 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <route.icon className="w-5 h-5 mr-3" />
            <span>{route.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4">
        <Link
          href="/script"
          className="bg-purple-600 hover:bg-purple-700 text-white w-full py-3 rounded-md flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          <span>Tạo video mới</span>
        </Link>
      </div>
    </div>
  );
}
