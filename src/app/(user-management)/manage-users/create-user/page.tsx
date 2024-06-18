"use client";
import { SnackbarContext } from "@/components/common/snackbar/SnackbarContext";
import { User, Permission } from "@/models/ManageUsersModel";
import { createUser } from "@/services/UserService";
import React, { useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/common/breadcrumb/Breadcrumb";
import { UserForm } from "@/components/manage-users/UserForm";

const CreateUser = () => {
  const router = useRouter();
  const snackbarCtx = useContext(SnackbarContext);

  const formatPermissions = useCallback((permissions?: Permission[]) => {
    let flattenedPermissions: Permission[] = [];
    permissions?.forEach((permission) => {
      const { subPermissions, ...rest } = permission;
      flattenedPermissions.push(rest);
      if (subPermissions && subPermissions?.length > 0) {
        const subFlattenedPermissions = formatPermissions(subPermissions);
        flattenedPermissions = flattenedPermissions?.concat(
          subFlattenedPermissions
        );
      }
    });
    return flattenedPermissions;
  }, []);

  const handleSubmit = useCallback(
    async (values: User) => {
      try {
        const formattedPermissions = formatPermissions(values?.permissions);
        const response = await createUser({
          ...values,
          permissions: formattedPermissions,
        });
        snackbarCtx.showSnackbar({
          type: "success",
          message: response?.message 
        });
        router.push("/manage-users");
      } catch (error: any) {
        console.log("error", error);
        snackbarCtx.showSnackbar({
          type: "error",
          message: error?.message ?? "Something went wrong",
        });
      }
    },
    [formatPermissions, router, snackbarCtx]
  );

  return (
    <>
      <div className="text-xl font-semibold font-inter mb-1">Create User</div>
      <UserForm onSubmit={handleSubmit} />
    </>
  );
};

export default CreateUser;
