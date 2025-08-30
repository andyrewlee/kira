import { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <SiteHeader />
      {children}
    </div>
  );
}

