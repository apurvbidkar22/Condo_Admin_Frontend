"use client";
import React, { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Sidebar } from "./Sidebar";

export const Navbar: React.FC = () => {
  const { data: session }: any = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCollapseSidebar = useCallback(() => {
    setIsSidebarOpen((isOpen) => !isOpen);
  }, []);

  return (
    <section
      id="navbar"
      className="bg-gray-900 min-h-16 px-4 border-b border-[#E6E6E6] sticky inset-x-0 top-0 z-30 bg-white w-full"
    >
      <div className="flex justify-between items-center h-full">
        <div>
          <Image
            src={process.env.NEXT_PUBLIC_ASSETS_URL + "icons/HamburgurIcon.svg"}
            height={7}
            width={7}
            alt="navHamburgurIcon"
            className="cursor-pointer lg:hidden"
            onClick={handleCollapseSidebar}
          />
        </div>
        <div className="flex justify-end items-center gap-2">
          <div>
            <div className="text-base font-inter font-semibold text-end">
              {session?.user?.name}
            </div>
            <div className="text-xs text-[#6B7280] font-inter text-end">
              {session?.user?.email}
            </div>
          </div>
          <Image
            className="inline-block  rounded-full ring-2 ring-white cursor-pointer"
            src={process.env.NEXT_PUBLIC_ASSETS_URL + "images/Avatar.svg"}
            height={40}
            width={40}
            alt=""
          />
        </div>
      </div>
      <Sidebar
        collapsed={false}
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } lg:hidden absolute -left-3`}
      />
    </section>
  );
};
