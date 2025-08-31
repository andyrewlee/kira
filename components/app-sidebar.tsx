"use client"

import * as React from "react"
import Link from "next/link"
import { IconDashboard, IconFileDescription, IconFileWord, IconFolder, IconListDetails, IconSettings } from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    { title: "Home", url: "/dashboard", icon: IconDashboard },
    { title: "Pickup Board", url: "/dashboard/pickup", icon: IconListDetails },
    { title: "Printers", url: "/dashboard/printers", icon: IconFolder },
    { title: "Layouts", url: "/dashboard/layouts", icon: IconFileWord },
    { title: "Templates", url: "/dashboard/templates", icon: IconFileDescription },
    { title: "Settings", url: "/dashboard/settings", icon: IconSettings },
  ],
  
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <span className="text-base font-semibold tracking-widest">KIRA</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
