"use client";
import { Breadcrumb } from "@/components/common/breadcrumb/Breadcrumb";
import { Loader } from "@/components/common/loader/Loader";
import { SnackbarContext } from "@/components/common/snackbar/SnackbarContext";
import AssignBuildings from "@/components/manage-users/AssignBuildings";
import AssignLocation from "@/components/manage-users/AssignLocation";
import { ManagePermission } from "@/components/manage-users/ManagePermission";
import { useAsyncCall } from "@/hooks/useAsyncCall";
import { Permission } from "@/models/ManageUsersModel";
import { editUser, getUser } from "@/services/UserService";
import { Form, Formik } from "formik";
import React, { useCallback, useContext } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const snackbarCtx = useContext(SnackbarContext);

  const userLoader = useAsyncCall(async () => {
    const user = await getUser(params.id);
    return user.data;
  }, []);

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
    async (values: { permissions: Permission[] }) => {
      try {
        const formattedPermissions = formatPermissions(values?.permissions);
        const response = await editUser({
          ...userLoader.result,
          id: userLoader?.result?.id,
          isActive: undefined,
          roleName: undefined,
          permissions: formattedPermissions,
        });
        userLoader.refetch?.();
        snackbarCtx.showSnackbar({
          type: "success",
          message: response.message,
        });
      } catch (error: any) {
        console.log("error", error);
        snackbarCtx.showSnackbar({
          type: "error",
          message: error?.message ?? "Something went wrong!",
        });
      }
    },
    [formatPermissions, userLoader, snackbarCtx]
  );

  return (
    <>
      <div className="text-xl font-semibold font-inter my-1">
        Manage Permission
      </div>
      {userLoader.loading ? (
        <Loader className="!border-black !h-12 !w-12" />
      ) : (
        <>
          <Formik
            initialValues={{
              permissions: userLoader.result?.permissions ?? [],
            }}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="w-ful my-3 lg:py-0">
                <ManagePermission />
              </Form>
            )}
          </Formik>
          <AssignBuildings userId={userLoader.result?.id} />
          <AssignLocation userId={userLoader.result?.id} />
        </>
      )}
    </>
  );
}
