import Sidebar from "./sidebar";
import { ReactNode } from "react";

import DashboardHeader from "@/components/DashboardHeader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10">
        <DashboardHeader />
      </div>

      {/* Desktop sidebar (left rail) */}
      <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 border-r border-black/20">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 min-w-0 flex flex-col pt-14 md:pt-0">
        <main className="flex-1 p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
