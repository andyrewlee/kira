"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as Collapsible from "@radix-ui/react-collapsible"
import { IconChevronDown } from "@tabler/icons-react"
import { type Icon } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: Array<{
    title: string
    url: string
    icon?: Icon
    items?: Array<{ title: string; url: string }>
  }>
}) {
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const activeBase = item.url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.url)
            const hasChildren = !!item.items?.length
            if (!hasChildren) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={activeBase} tooltip={item.title}>
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }
            const firstUrl = item.items![0].url
            return (
              <Collapsible.Root key={item.title} className="group/collapsible" defaultOpen={activeBase}>
                <SidebarMenuItem>
                  <Collapsible.Trigger asChild>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link href={firstUrl}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <IconChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </Link>
                    </SidebarMenuButton>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <SidebarMenuSub>
                      {item.items!.map((sub) => {
                        const subActive = pathname === sub.url || pathname.startsWith(sub.url + "/")
                        return (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={subActive}
                              className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:ring-2 data-[active=true]:ring-sidebar-ring font-medium"
                            >
                              <Link href={sub.url}>{sub.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </Collapsible.Content>
                </SidebarMenuItem>
              </Collapsible.Root>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
