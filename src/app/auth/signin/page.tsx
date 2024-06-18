"use client";
import { useCallback, useContext, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/common/button/Button";
import { Form, Formik } from "formik";
import { SignInUser } from "@/models/AuthModel";
import * as yup from "yup";
import { SnackbarContext } from "@/components/common/snackbar/SnackbarContext";
import { usePopup } from "@/hooks/usePopup";
import { EmailVerificationPopup } from "@/components/authentication/EmailVerificationPopup";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

export default function Signin() {
  const { data, status } = useSession();
  const router = useRouter();
  const snackbarCtx = useContext(SnackbarContext);
  const [verifyEmail, viewVerifyEmail, hideVerifyEmail] = usePopup();
  const [showPassword, setShowPassword] = React.useState(false);

  const initialValues: SignInUser = {
    username: "",
    password: "",
  };

  const handleViewPassword = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = yup.object<SignInUser>().shape({
    username: yup.string().trim().required("Please enter user Id"),
    password: yup.string().required("Please enter password"),
  });

  const handleLogin = useCallback(
    async (values: SignInUser) => {
      try {
        const res = await signIn("credentials", {
          username: values.username,
          password: values.password,
          redirect: false,
        });

        if (res?.error) {
          snackbarCtx.showSnackbar({
            type: "error",
            message: "Please enter valid user id and password",
          });
          return;
        }
      } catch (error) {
        snackbarCtx.showSnackbar({
          type: "error",
          message: "Please enter valid user id and password",
        });
        console.log(error);
      }
    },
    [snackbarCtx]
  );

  useEffect(() => {
    if (status === "authenticated") {
      if (data?.user.isPasswordReset === false) {
        snackbarCtx.showSnackbar({
          type: "success",
          message: "Signin successfully, please reset your password",
        });
        router.replace("/auth/reset-password");
      } else if (data?.user.isPasswordReset) {
        snackbarCtx.showSnackbar({
          type: "success",
          message: "Signin successfully, Welcome to admin",
        });
        router.replace("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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
              onSubmit={handleLogin}
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
                      Login to System
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="text-lg font-poppins text-white">Admin User ID</label>
                    <input
                      id="username"
                      type="username"
                      value={values.username}
                      onChange={handleChange}
                      className="text-black border rounded w-full h-12 my-1 px-3 focus:outline-none focus:shadow-outline"
                    />
                    {errors.username && (
                      <div className="text-sm text-warning ml-1">
                        {errors.username}
                      </div>
                    )}
                  </div>
                  <div className="mb-8 relative">
                    <label className="text-lg font-poppins text-white mb-2">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={handleChange}
                        className="text-black border rounded w-full h-12 my-1 pl-3 pr-12 focus:outline-none focus:shadow-outline"
                      />
                      <button
                        type="button"
                        onClick={handleViewPassword}
                        className="absolute inset-y-0 right-0 flex items-center justify-center p-3 pt-4 h-12 focus:outline-none"
                      >
                        <Image
                          src= {process.env.NEXT_PUBLIC_ASSETS_URL + "icons/EyeIcon.svg"}
                          alt="EyeIcon"
                          width={20}
                          height={20}
                        />
                      </button>
                    </div>
                    {errors.password && (
                      <div className="text-sm text-warning ml-1">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-end mb-8">
                    <div
                      className="text-white text-base font-poppins cursor-pointer"
                      onClick={viewVerifyEmail}
                    >
                      Forgot Password?
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="text-base font-bold w-full !bg-[#0075A1] !font-roboto h-12"
                    title="Login"
                    isLoading={isSubmitting}
                  />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <EmailVerificationPopup open={verifyEmail} onClose={hideVerifyEmail} />
    </div>
  );
}
