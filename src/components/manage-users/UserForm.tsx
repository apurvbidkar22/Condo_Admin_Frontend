"use client";
import { Button } from "@/components/common/button/Button";
import { Dropdown } from "@/components/common/dropdown/Dropdown";
import { Input } from "@/components/common/input/Input";
import { TextArea } from "@/components/common/text-area/TextArea";
import { PermissionsForm } from "@/components/manage-users/PermissionsForm";
import { User, Permission } from "@/models/ManageUsersModel";
import { Form, Formik } from "formik";
import React, { useCallback, useMemo } from "react";
import * as yup from "yup";
import { Option } from "@/models/Common";
import { useAsyncCall } from "@/hooks/useAsyncCall";
import { getRolePermissions, validateEmail } from "@/services/UserService";

interface Props {
  isEdit?: boolean;
  user?: User;
  onSubmit: (values: User) => Promise<void>;
}

export const UserForm: React.FC<Props> = ({ isEdit, user, onSubmit }) => {
  const rolePermissionLoader = useAsyncCall(async () => {
    const result = await getRolePermissions();
    return result.data ?? [];
  }, []);

  const roleOptions = useMemo(() => {
    return rolePermissionLoader?.result?.map((role) => ({
      value: role.id ?? "",
      label: role.roleName ?? "",
    }));
  }, [rolePermissionLoader?.result]);

  const initialValues: User = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    phoneNumber: user?.phoneNumber ?? "",
    roleId: user?.roleId ?? "",
    description: user?.description ?? "",
    permissions: user?.permissions ?? undefined,
  };

  const validationSchema = yup.object<User>().shape({
    name: yup.string().required("User name is required"),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number is not valid"),
    email: yup
      .string()
      .email("Email must be a valid email")
      .required("Email is required")
      .test(
        "isEmailUnique",
        "Email Id already exists",
        async (email?: string) => {
          try {
            if (email === user?.email) {
              return true;
            } else if (email) {
              await validateEmail(email);
              return true;
            } else {
              return true;
            }
          } catch (err) {
            return false;
          }
        }
      ),
    roleId: yup.string().required("Role is required"),
  });

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

  const handleRoleChange = useCallback(
    async (val: Option, setFieldValue: any) => {
      return rolePermissionLoader?.result?.map((role) => {
        if (role.id === val.value) {
          setFieldValue("permissions", role.permissions);
        }
      });
    },
    [rolePermissionLoader?.result]
  );

  return (
    <div className="w-full flex justify-center mt-16">
      <div className="w-full lg:w-3/4 bg-white font-inter flex justify-center rounded-md">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          validateOnChange={false}
        >
          {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
            <Form
              onSubmit={handleSubmit}
              className="w-full lg:w-3/4 my-3 px-3 lg:py-0"
            >
              <Input name="name" label="User Name" required />
              <div className="flex gap-5">
                <Input name="email" label="Email" required disabled={isEdit} />
                <Input name="phoneNumber" label="Phone Number" />
              </div>
              <Dropdown
                name="roleId"
                label="Role"
                options={roleOptions ?? []}
                required
                onChange={(val: Option) => handleRoleChange(val, setFieldValue)}
              />
              <TextArea name="description" label="Description" />
              {values?.permissions && <PermissionsForm />}
              <Button
                className="mt-4"
                type="submit"
                title={isEdit ? "Edit User" : "Create User"}
                isLoading={isSubmitting}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
