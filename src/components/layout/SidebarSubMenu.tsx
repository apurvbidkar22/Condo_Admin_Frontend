"use client";
import { ISidebarSubMenu } from "@/models/LayoutModel";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo } from "react";

export const SidebarSubMenu = ({ item }: { item: ISidebarSubMenu }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = useMemo(() => item.path === pathname, [item.path, pathname]);

  return (
    <div
      className={`text-base font-normal cursor-pointer pl-[46px] p-3 transition-all ease-in duration-300 delay-[200ms] hover:bg-hover ${
        isActive ? "hover:bg-hover" : ""
      }`}
      onClick={() => router.push(item.path)}
    >
      {item.label}
    </div>
  );
};
