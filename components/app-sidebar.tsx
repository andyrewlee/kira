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
  SidebarSeparator,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    { title: "Home", url: "/dashboard", icon: IconDashboard },
    {
      title: "Printers",
      url: "/dashboard/printers",
      icon: IconFolder,
      items: [
        { title: "Editor", url: "/dashboard/printers/editor" },
        { title: "Templates", url: "/dashboard/printers/templates" },
        { title: "Layout", url: "/dashboard/printers/layout" },
        { title: "Register Printer", url: "/dashboard/printers/register" },
      ],
    },
    {
      title: "Custom Website",
      url: "/dashboard/website",
      icon: IconFileDescription,
      items: [
        { title: "Editor", url: "/dashboard/website/editor" },
        { title: "Templates", url: "/dashboard/website/templates" },
        { title: "Websites", url: "/dashboard/website/websites" },
      ],
    },
    {
      title: "Pickup Screen",
      url: "/dashboard/pickup",
      icon: IconListDetails,
      items: [
        { title: "Editor", url: "/dashboard/pickup/editor" },
        { title: "Templates", url: "/dashboard/pickup/templates" },
        { title: "Screens", url: "/dashboard/pickup/screens" },
      ],
    },
    {
      title: "Phone Agent",
      url: "/dashboard/phone-agent",
      icon: IconSettings,
      items: [
        { title: "Editor", url: "/dashboard/phone-agent/editor" },
        { title: "Templates", url: "/dashboard/phone-agent/templates" },
        { title: "Agents", url: "/dashboard/phone-agent/agents" },
      ],
    },
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
      <SidebarSeparator />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
