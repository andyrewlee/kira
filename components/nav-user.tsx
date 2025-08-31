"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"

export function NavUser() {
  const { user } = useUser()
  const name = user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || ""
  const email = user?.primaryEmailAddress?.emailAddress || ""

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-3 p-2">
          <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: 'h-8 w-8 rounded-lg' } }} />
          <div className="grid flex-1 text-left text-sm leading-tight">
            {name ? <span className="truncate font-medium">{name}</span> : null}
            {email ? <span className="text-muted-foreground truncate text-xs">{email}</span> : null}
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
