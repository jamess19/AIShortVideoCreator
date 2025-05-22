import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <AppSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
