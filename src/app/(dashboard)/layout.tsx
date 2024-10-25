"use client";

import { RedirectToSignIn } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import {
  SidebarProvider,
  Sidebar,
  SidebarFooter,
  SidebarGroupAction,
  SidebarContent,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar";
import { User2Icon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Authenticated><SidebarProvider><DashboardSidebar/>{children}</SidebarProvider></Authenticated>
      <Unauthenticated>
        <RedirectToSignIn/>
      </Unauthenticated>
    </>
  );
}

function DashboardSidebar() {
    const user = useQuery(api.functions.user.get)

    if(!user) {
        return null
    }

    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/friends">
                      <User2Icon />
                      Friends
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroup>
              <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
              <SidebarGroupAction>
                <PlusIcon />
                <span className="sr-only">New Direct Message</span>
              </SidebarGroupAction>
            </SidebarGroup>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <SidebarMenuButton className="flex items-center">
                        <Avatar className="size-6">
                          <AvatarImage src={user.image} />
                          <AvatarFallback>{user.username[0]}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{user.username}</p>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    );
}