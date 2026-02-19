"use client";

import { Home, Music } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export default function SidebarMenuItems() {
  const path = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Create",
      url: "/create",
      icon: Music,
    },
  ];

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={mounted && path === item.url}>
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}