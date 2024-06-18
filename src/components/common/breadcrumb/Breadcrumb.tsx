import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

export const PATH: Record<string, string> = {
  "create-user": "Create User",
  "edit-user": "Edit User",
  "manage-users": "Manage Users",
  "manage-buildings": "Manage Buildings",
  "manage-media": "Manage Media",
  "manage-data": "Manage Data",
  "manage-permission": "Manage Permission",
};

export const Breadcrumb = () => {
  const pathName = usePathname();
  const paths = pathName?.split("/").filter((path) => PATH[path]);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex gap-2 text-[#5F5F5F] bg-white text-sm font-inter px-4 py-1">
        <li className="flex gap-2 items-center">
          <Link href="/">
            <Image
              src={
                process.env.NEXT_PUBLIC_ASSETS_URL + "icons/HomeIcon.svg"
              }
              height={12}
              width={12}
              alt="HomeIcon"
            />
          </Link>
          {paths && paths.length > 0 && <div>{"/"}</div>}
        </li>
        {paths.map((path, index) => {
          return (
            <li key={path} className="flex gap-2">
              {index === paths.length - 1 ? (
                <span>{PATH[path]}</span>
              ) : (
                <>
                  <Link href={`/${paths?.slice(0, index + 1).join("/")}`}>
                    {PATH[path]}
                  </Link>
                  {index < paths.length - 1 && <div>{"/"}</div>}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
