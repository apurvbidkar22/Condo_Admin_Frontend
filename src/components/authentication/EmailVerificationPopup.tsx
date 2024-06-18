import React, { useCallback, useContext } from "react";
import { Modal } from "../common/modal/Modal";
import { Input } from "@/components/common/input/Input";
import { Formik } from "formik";
import * as yup from "yup";
import { Button } from "../common/button/Button";
import { forgotPassword } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { SnackbarContext } from "../common/snackbar/SnackbarContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const EmailVerificationPopup: React.FC<Props> = ({ open, onClose }) => {
  const snackbarCtx = useContext(SnackbarContext);
  const router = useRouter();

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Email must be a valid email Id")
      .trim()
      .required("Email Id is required"),
  });

  const handleSubmit = useCallback(
    async (values: { email: string }) => {
      try {
        const result = await forgotPassword(values.email);
        snackbarCtx.showSnackbar({
          type: "success",
          message: result?.message,
        });
        localStorage.removeItem("email");
        localStorage.setItem("email", values.email);
        router.replace("/auth/forgot-password");
      } catch (error: any) {
        snackbarCtx.showSnackbar({
          type: "error",
          message: error?.message,
        });
      }
    },
    [router, snackbarCtx]
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={"Email Confirmation"}
      showActionButtons={false}
      className="w-full lg:w-1/3"
    >
      <Formik
        initialValues={{ email: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, isSubmitting }) => (
          <>
            <Input name={"email"} label={"Email Id"} />
            <div className="flex gap-4 mt-10">
              <Button
                title={"Submit"}
                onClick={handleSubmit}
                className="w-full"
                isLoading={isSubmitting}
              />
              <Button
                title={"Cancel"}
                onClick={onClose}
                variant="teritary"
                className="w-full"
              />
            </div>
          </>
        )}
      </Formik>
    </Modal>
  );
};
