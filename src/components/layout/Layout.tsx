"use client";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { SnackbarContext } from "../common/snackbar/SnackbarContext";
import Snackbar from "../common/snackbar/Snackbar";
import { Breadcrumb } from "../common/breadcrumb/Breadcrumb";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const pathName = usePathname();
  const snackbarCtx = useContext(SnackbarContext);
  const [collapsed, setIsSidebarCollapsed] = useState(false);
  const authRoutes = [
    "/auth/signin",
    "/auth/reset-password",
    "/auth/forgot-password",
  ];

  const handleCollapseSidebar = useCallback(() => {
    setIsSidebarCollapsed((prevCollapsed) => !prevCollapsed);
  }, []);

  useEffect(() => {
    if (session?.data?.error === "RefreshAccessTokenError") {
      signOut();
      console.log("session?.data", session?.data);
    }
  }, [session]);

  return (
    <div className="flex lg:block">
      {snackbarCtx.open && <Snackbar />}
      {!authRoutes.includes(pathName) ? (
        <>
          <div
            className={`bg-primary hidden lg:flex justify-center items-center fixed mt-4 z-50 h-8 w-5 rounded-e-lg cursor-pointer transition-all duration-200 ${
              collapsed ? "ml-20" : "ml-64"
            } `}
            onClick={handleCollapseSidebar}
          >
            <Image
              src={
                process.env.NEXT_PUBLIC_ASSETS_URL + "icons/CollapsedIcon.svg"
              }
              height={10}
              width={10}
              alt="collapsedIcon"
              className={`${collapsed ? "rotate-180" : ""}`}
            />
          </div>
          <Sidebar
            collapsed={collapsed}
            className="hidden lg:block h-screen "
          />
          <div
            className={`flex flex-col flex-1 h-screen relative transition-all duration-200 ${
              collapsed ? "lg:ml-20" : "lg:ml-64"
            }`}
          >
            <Navbar />
            {pathName?.length > 1 && <Breadcrumb />}
            <main className="px-4 pb-4 flex-1 ">{children}</main>
          </div>
        </>
      ) : (
        <main className="">{children}</main>
      )}
    </div>
  );
};
