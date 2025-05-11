"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Eye, Video } from "lucide-react";

export function Sidebar() {
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
      icon: Eye,
      label: "Xem trước",
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
    <div className="w-64 border-r border-gray-200 bg-white h-full">
      <div className="p-4">
        <h1 className="text-xl font-bold text-purple-600 flex items-center">
          <Video className="mr-2" /> VideoAI
        </h1>
      </div>
      <nav className="mt-6">
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
    </div>
  );
}
