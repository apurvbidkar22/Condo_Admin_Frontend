"use client";
import { ActionOptions } from "@/components/common/DropdownOptions";
import { HamburgurMenu } from "@/components/common/menu/HamburgurMenu";
import { ColumnDefinitionType, Table } from "@/components/common/table/Table";
import { useAsyncCall } from "@/hooks/useAsyncCall";
import { User } from "@/models/ManageUsersModel";
import { deleteUser, getAllUsers } from "@/services/UserService";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { SnackbarContext } from "@/components/common/snackbar/SnackbarContext";
import { useSession } from "next-auth/react";
import { hasPermissionForAction } from "@/helpers/AuthHelper";
import { USER_ACTION } from "@/components/common/Constants";
import { Breadcrumb } from "@/components/common/breadcrumb/Breadcrumb";

const ManageUsers: React.FC = () => {
  const router = useRouter();
  const snackbarCtx = useContext(SnackbarContext);
  const permissions = useSession().data?.user.permissions;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { result, loading, refetch } = useAsyncCall(async () => {
    const users = await getAllUsers(page, limit);
    return users.data;
  }, [page, limit]);

  const handleRowsPerPageChange = useCallback((val: number) => {
    setLimit(val);
  }, []);

  const handlePageChange = useCallback((val: number) => {
    setPage(val);
  }, []);

  const handleUserDelete = useCallback(
    async (id?: string) => {
      try {
        const res = await deleteUser(id ?? "");
        snackbarCtx.showSnackbar({
          type: "success",
          message: res?.message,
        });
        refetch?.();
      } catch (error: any) {
        snackbarCtx.showSnackbar({
          type: "error",
          message: error?.message ?? "Something went wrong",
        });
      }
    },
    [snackbarCtx, refetch]
  );

  const actionOptions = useMemo(() => {
    return ActionOptions.filter((option) => {
      if (
        option.value === "edit" &&
        !hasPermissionForAction(
          "user_management",
          permissions,
          USER_ACTION.IS_WRITE
        )
      ) {
        return false;
      }
      if (
        option.value === "delete" &&
        !hasPermissionForAction(
          "user_management",
          permissions,
          USER_ACTION.IS_DELETE
        )
      ) {
        return false;
      }
      return true;
    });
  }, [permissions]);

  const handleActions = useCallback(
    (value: string, id?: string) => {
      if (value === "edit") {
        router.push(`/manage-users/edit-user/${id}`);
      } else {
        handleUserDelete(id);
      }
    },
    [handleUserDelete, router]
  );

  const columns: ColumnDefinitionType<User, keyof User>[] = [
    {
      key: "permissions",
      header: "",
      align: "center",
      width: 60,
      renderCell: (row: User) => {
        return (
          <div className="flex justify-center ">
            <HamburgurMenu
              options={actionOptions}
              onClick={(value) => handleActions(value, row.id)}
            >
              <Image
                src={
                  process.env.NEXT_PUBLIC_ASSETS_URL + "icons/HamburgurIcon.svg"
                }
                height={16}
                width={16}
                alt="lockIcon"
                className="iconButton"
              />
            </HamburgurMenu>
          </div>
        );
      },
    },
    {
      key: "id",
      header: "ID",
      width: 100,
    },
    {
      key: "name",
      header: "User Name",
    },
    {
      key: "roleName",
      header: "Role",
    },
    {
      key: "isActive",
      header: "Status",
      renderCell: (row: User) => {
        return <div>{row.isActive ? "Active" : "Inactive"}</div>;
      },
    },
    {
      key: "action",
      header: "Actions",
      renderCell: (row: User) => {
        return (
          <Link
            href={`/manage-users/manage-permission/${row.id}`}
            className="font-bold font-inter cursor-pointer"
          >
            Manage Permissions
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <div className="pt-2 pb-4 flex justify-between items-center">
        <div className="font-semibold font-inter text-xl">Manage User</div>
        {hasPermissionForAction(
          "user_management",
          permissions,
          USER_ACTION.IS_WRITE
        ) && (
          <Link
            href={"/manage-users/create-user"}
            className="bg-secondary flex text-xs text-white font-medium font-lato justify-center items-center h-10 w-36 rounded-md gap-2"
          >
            <Image
              src={process.env.NEXT_PUBLIC_ASSETS_URL + "icons/AddIcon.svg"}
              height={15}
              width={15}
              alt="addIcon"
            />
            Create User
          </Link>
        )}
      </div>
      <Table
        isAutoHeight
        columns={columns}
        data={result?.rows ?? []}
        loading={loading}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalRowCount={result?.count ?? 0}
      />
    </>
  );
};

export default ManageUsers;
