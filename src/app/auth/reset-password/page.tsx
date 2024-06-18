"use client";
import { useCallback, useContext } from "react";
import { Button } from "@/components/common/button/Button";
import { Form, Formik } from "formik";
import { IResetPassword } from "@/models/AuthModel";
import * as yup from "yup";
import { resetPassword } from "@/services/AuthService";
import { signOut, useSession } from "next-auth/react";
import { SnackbarContext } from "@/components/common/snackbar/SnackbarContext";
import Image from "next/image";

export default function ResetPassword() {
  const { data } = useSession();
  const snackbarCtx = useContext(SnackbarContext);

  const initialValues: IResetPassword = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = yup.object<IResetPassword>().shape({
    oldPassword: yup.string().required("Old password is required"),
    newPassword: yup
      .string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()_\-+={}[\]:;'",<.>/?]).*$/,
        "Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character"
      ),
    confirmPassword: yup
      .string()
      .required("Confirm password is required ")
      .oneOf([yup.ref("newPassword"), ""], "Passwords must match"),
  });

  const handleResetPassword = useCallback(
    async (values: IResetPassword) => {
      const { newPassword, oldPassword } = values;
      try {
        const response = await resetPassword({
          newPassword,
          oldPassword,
        });
        snackbarCtx.showSnackbar({
          type: "success",
          message: response.message,
        });
        await signOut({ callbackUrl: "/" });
      } catch (error: any) {
        console.log(error);
        snackbarCtx.showSnackbar({
          type: "error",
          message: error?.messagge,
        });
      }
    },
    [snackbarCtx]
  );

  return (
    <div
      className="loginContainer h-screen w-screen"
      style={{
        background: `url(${
          process.env.NEXT_PUBLIC_ASSETS_URL + "images/loginBackground.svg"
        }) no-repeat`,
      }}
    >
      <div className="grid lg:grid-cols-2 h-full">
        <div className="relative hidden lg:block">
          <div className="absolute top-[10%] left-[10%]">
            <Image
              src={process.env.NEXT_PUBLIC_ASSETS_URL + "images/Logo.svg"}
              height={150}
              width={150}
              alt="HelloCondo"
            />
          </div>
        </div>
        <div className="loginRight">
          <div className="w-full max-w-96">
            <Formik
              initialValues={initialValues}
              onSubmit={handleResetPassword}
              validationSchema={validationSchema}
            >
              {({
                values,
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="flex justify-center">
                    <div className="text-4xl font-poppins font-semibold mb-8 text-p text-[#0075A1]">
                      Reset Password
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="text-lg font-poppins text-white">Old Password</label>
                    <input
                      id="oldPassword"
                      type="password"
                      value={values.oldPassword}
                      onChange={handleChange}
                      className="text-black border rounded w-full h-12 my-1 px-3 focus:outline-none focus:shadow-outline"
                    />
                    {errors.oldPassword && (
                      <div className="text-sm text-warning ml-1">
                        {errors.oldPassword}
                      </div>
                    )}
                  </div>
                  <div className="mb-8">
                    <label className="text-lg font-poppins text-white mb-2">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={values.newPassword}
                      onChange={handleChange}
                      className=" text-black border rounded w-full h-12 my-1 px-3 focus:outline-none focus:shadow-outline"
                    />
                    {errors.newPassword && (
                      <div className="text-sm text-warning ml-1">
                        {errors.newPassword}
                      </div>
                    )}
                  </div>
                  <div className="mb-10">
                    <label className="text-lg font-poppins text-white mb-2">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      className=" text-black border rounded w-full h-12 my-1 px-3 focus:outline-none focus:shadow-outline"
                    />
                    {errors.confirmPassword && (
                      <div className="text-sm text-warning ml-1">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="text-base !font-roboto font-bold w-full !bg-[#0075A1] h-12"
                    title="Reset Password"
                    isLoading={isSubmitting}
                  />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
