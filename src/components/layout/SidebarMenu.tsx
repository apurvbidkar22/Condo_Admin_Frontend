import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ISidebarMenu } from "@/models/LayoutModel";
import { SidebarSubMenu } from "./SidebarSubMenu";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { hasPermissionForAction } from "@/helpers/AuthHelper";

interface Props {
  menu: ISidebarMenu;
  collapsed: boolean;
}

export const SidebarMenu: React.FC<Props> = ({ menu, collapsed }) => {
  const permissions = useSession().data?.user.permissions;
  const { label, icon, subMenu, path } = menu;
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = useCallback(() => {
    if (subMenu && subMenu.length > 0) {
      setExpanded((prevState) => !prevState);
    } else if (path) {
      router.push(path);
    }
  }, [path, router, subMenu]);

  const isActive = useMemo(() => {
    if (subMenu && subMenu.length > 0) {
      return subMenu.some((subItem) => subItem.path === pathname);
    }
    return path === pathname;
  }, [subMenu, path, pathname]);

  return (
    <>
      <div
        className={`flex items-center p-3 cursor-pointer transition-all ease-in-out duration-200 delay-[200ms] hover:bg-hover ${
          isActive ? "bg-hover" : ""
        } ${collapsed ? " justify-center" : " justify-between"}`}
        onClick={handleNavigate}
      >
        <div
          className={`flex items-center justify-center  ${
            collapsed ? " " : "pl-2"
          }`}
        >
          <Image
            src={process.env.NEXT_PUBLIC_ASSETS_URL + `icons/${icon}.svg`}
            alt="userManagementIcon"
            height={18}
            width={18}
            className="py-[6px]"
          />
          <p
            className={`text-base font-poppins pl-2 pr-6 ${
              collapsed ? "hidden" : "block"
            }`}
          >
            {label}
          </p>
          {!collapsed && subMenu && subMenu.length > 0 && (
            <Image
              height={10}
              width={10}
              src={
                process.env.NEXT_PUBLIC_ASSETS_URL +
                "icons/MenuArrowIcon.svg"
              }
              alt=""
              className={`transition-transform transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>
      {expanded && subMenu && subMenu.length > 0 && (
        <div
          className={`flex flex-col space-y-2 ${
            collapsed ? "hidden" : "block"
          }`}
        >
          {subMenu.map(
            (item) =>
              hasPermissionForAction(item.id, permissions) && (
                <SidebarSubMenu key={item.path} item={item} />
              )
          )}
        </div>
      )}
    </>
  );
};
