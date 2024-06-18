import React from "react";
import { SidebarMenu } from "./SidebarMenu";
import { ISidebarMenu } from "@/models/LayoutModel";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { hasPermissionForAction } from "@/helpers/AuthHelper";

interface Props {
  collapsed: boolean;
  className?: string;
}

const sideBarItemList: ISidebarMenu[] = [
  {
    id: "user_management",
    label: "User Management",
    path: "/manage-users",
    icon: "UserManagementIcon",
  },
  {
    id: "manage_buildings",
    label: "Manage Buildings",
    icon: "ManageBuildingIcon",
    subMenu: [
      {
        id: "manage_building_media",
        label: "Manage Media",
        path: "/manage-media",
      },
      {
        id: "manage_building_data",
        label: "Manage Data",
        path: "/manage-data",
      },
    ],
  },
  {
    id: "setting",
    label: "Settings",
    path: "/settings",
    icon: "SettingIcon",
  },
];

export const Sidebar: React.FC<Props> = ({ collapsed, className }) => {
  const permissions = useSession().data?.user.permissions;

  return (
    <section
      id="sidebar"
      className={`bg-white border-r border-[#E2E2E2] ${
        collapsed ? "w-20" : "w-64"
      } flex-1 fixed overflow-hidden transition-all duration-200 ${className}`}
    >
      <div className="relative h-full">
        <div className="flex w-full py-6">
          <Image
            src={process.env.NEXT_PUBLIC_ASSETS_URL + "images/Logo.svg"}
            height={130}
            width={130}
            alt="HelloCondo"
            className={`py-[6px] ${collapsed ? "p-2" : "pl-7"}`}
          />
        </div>
        <div className="flex flex-col w-full font-poppins">
          {sideBarItemList.map(
            (menu, index) =>
              hasPermissionForAction(menu.id, permissions) && (
                <SidebarMenu key={index} menu={menu} collapsed={collapsed} />
              )
          )}
        </div>
        <div
          className={`flex py-3 hover:bg-hover w-full cursor-pointer lg:absolute bottom-5  ${
            collapsed ? " justify-center" : "pl-4"
          }`}
          onClick={() => signOut()}
        >
          <Image
            src={process.env.NEXT_PUBLIC_ASSETS_URL + "icons/LogoutIcon.svg"}
            height={18}
            width={18}
            alt="logoutIcon"
            className="py-[6px]"
          />
          <div className={`pl-2 ${collapsed ? "hidden" : "block"} font-inter`}>
            Log out
          </div>
        </div>
      </div>
    </section>
  );
};
