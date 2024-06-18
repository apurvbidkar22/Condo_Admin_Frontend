"use client";
import { useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/button/Button";
import { Form, Formik } from "formik";
import { IForgotPassword } from "@/models/AuthModel";
import * as yup from "yup";
import { confirmForgotPassword } from "@/services/AuthService";
import Link from "next/link";
import { SnackbarContext } from "@/components/common/snackbar/SnackbarContext";
import Image from "next/image";

export default function ForgotPassword() {
  const snackbarCtx = useContext(SnackbarContext);
  const router = useRouter();

  const initialValues: IForgotPassword = {
    confirmationCode: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = yup.object<IForgotPassword>().shape({
    confirmationCode: yup.string().required("Confirmation code is required"),
    newPassword: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()_\-+={}[\]:;'",<.>/?]).*$/,
        "Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character"
      ),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("newPassword"), ""], "Passwords must match"),
  });

  const handleForgotPassword = useCallback(
    async (values: IForgotPassword) => {
      const { newPassword, confirmationCode } = values;
      const email = localStorage.getItem("email") ?? "";
      try {
        const response = await confirmForgotPassword({
          newPassword,
          confirmationCode,
          email,
        });
        snackbarCtx.showSnackbar({
          type: "success",
          message: response?.message,
        });
        router.push("/auth/signin");
      } catch (error: any) {
        console.log(error);
        snackbarCtx.showSnackbar({
          type: "error",
          message: error?.message,
        });
      }
    },
    [snackbarCtx, router]
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
              onSubmit={handleForgotPassword}
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
                      Forgot Password
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="text-lg font-poppins text-white">
                      Confirmation Code
                    </label>
                    <input
                      id="confirmationCode"
                      type="text"
                      value={values.confirmationCode}
                      onChange={handleChange}
                      className="text-black border rounded w-full h-12 my-1 px-3 focus:outline-none focus:shadow-outline"
                    />
                    {errors.confirmationCode && (
                      <div className="text-sm text-warning ml-1">
                        {errors.confirmationCode}
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
                  <div className="mb-8">
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
                  <div className="flex items-center justify-end mb-8">
                    <Link
                      className="text-white font-poppins text-base cursor-pointer"
                      href={"/auth/signin"}
                    >
                      Back To Login?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="text-base font-bold !font-roboto w-full !bg-[#0075A1] h-12"
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
