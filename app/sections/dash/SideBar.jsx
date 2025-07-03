"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Home, Inbox, LogOutIcon, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Manage Tasks",
    url: "/tasks",
    icon: Inbox,
  },
  {
    title: "Create Tasks",
    url: "/createTask",
    icon: Calendar,
  },
  {
    title: "Insights",
    url: "/dashboard/insights",
    icon: Search,
  },
  {
    title: "Back to Visualize",
    url: "/visualize",
    icon: LogOutIcon,
  },
];

const SideBar = () => {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <div className="p-4">Loading...</div>;

  const displayName =
    user.username || user.firstName || user.fullName || "User";
  const email =
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress ||
    "No email";

  return (
    <SidebarProvider>
      <div className="h-screen">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                {/* User Profile Section */}
                <div className="px-4 pt-20 text-center ">
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-20 h-20 mb-4 mx-auto rounded-full border"
                  />
                  <div className="mt-2 font-semibold text-lg">{displayName}</div>
                  <div className="text-sm text-gray-500">{email}</div>
                  
                </div>

                {/* Navigation Menu */}
                <SidebarMenu className="mt-6 ">
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                        >
                          <item.icon size={18} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
};

export default SideBar;
