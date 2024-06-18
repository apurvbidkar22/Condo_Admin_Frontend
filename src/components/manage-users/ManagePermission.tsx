import React, { useCallback, useMemo } from "react";
import { Tabs } from "./../common/tab/Tabs";
import {
  PERMISSION_TYPES,
  PERMISSION_LABELS,
  USER_ACTION,
} from "../common/Constants";
import { FieldArray, useFormikContext } from "formik";
import { User, SubPermission } from "@/models/ManageUsersModel";
import { Checkbox } from "../common/checkbox/Checkbox";
import { Button } from "../common/button/Button";
import { hasPermissionForAction } from "@/helpers/AuthHelper";
import { useSession } from "next-auth/react";

export const ManagePermission = () => {
  const { values, isSubmitting } = useFormikContext<User>();
  const permissions = useSession().data?.user.permissions;
  const canUpdatePermission = hasPermissionForAction(
    "user_management",
    permissions,
    USER_ACTION.IS_WRITE
  );

  const subPermissionsTab = useCallback(
    (subPermission?: SubPermission[], index?: number) => {
      return subPermission?.map((permission, subIndex) => ({
        name: permission.displayName,
        content: (
          <>
            <div
              key={subIndex}
              className="text-sm lg:text-base font-semibold flex items-center gap-4 mt-6 ml-5"
            >
              {PERMISSION_TYPES.map((type, subIndex2) => (
                <div key={subIndex2} className="flex items-center gap-2">
                  <Checkbox
                    key={`${index}_${type}`}
                    name={`permissions[${index}].subPermissions[${subIndex}].${type}`}
                    disabled={!canUpdatePermission}
                  />
                  <div>{PERMISSION_LABELS[type]}</div>
                </div>
              ))}
            </div>
          </>
        ),
      }));
    },
    [canUpdatePermission]
  );

  const tabs = useMemo(() => {
    return values?.permissions?.map((permission, index) => ({
      name: permission.displayName,
      content: (
        <>
          <div
            key={index}
            className="text-sm lg:text-base font-inter font-semibold flex items-center gap-4 mt-6 ml-5 mb-3"
          >
            {PERMISSION_TYPES.map((type, index2) => (
              <div key={index2} className="flex items-center gap-2">
                <Checkbox
                  key={`${index}_${type}`}
                  name={`permissions[${index}].${type}`}
                  disabled={!canUpdatePermission}
                />
                <div>{PERMISSION_LABELS[type]}</div>
              </div>
            ))}
          </div>
          <Tabs
            tabs={subPermissionsTab(permission?.subPermissions, index) ?? []}
            className="lg:w-2/4"
          />
        </>
      ),
    }));
  }, [canUpdatePermission, subPermissionsTab, values?.permissions]);

  return (
    <>
      <FieldArray
        name="permissions"
        render={() => <Tabs tabs={tabs ?? []} />}
      />
      {canUpdatePermission && (
        <Button
          type="submit"
          title="Update Permissions"
          isLoading={isSubmitting}
          disabled={
            !values?.permissions?.length || values?.permissions?.length <= 0
          }
          className="mt-4"
        />
      )}
    </>
  );
};
