import Image from "next/image";
import React, { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "../button/Button";

interface Props {
  open: boolean;
  title: string | JSX.Element;
  subTitle?: string;
  className?: string;
  showActionButtons?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  disabled?:boolean
  children: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const Modal: React.FC<Props> = ({
  open,
  title,
  subTitle,
  className,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  showActionButtons = true,
  loading = false,
  onConfirm,
  onCancel,
  disabled,
  onClose,
  children,
}) => {
  useEffect(() => {
    const body = document.body;
    if (open) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
    return () => {
      body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 z-40 bg-black opacity-50"
        onClick={onClose} // Close modal when overlay is clicked
      ></div>
      <div className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 backdrop-filter backdrop-blur-0 bg-opacity-50 bg-black"></div>
        <div className={`z-10 bg-white rounded-md py-4 px-3 ${className}`}>
          <div className="flex justify-between items-center w-full">
            <div>
              <div className="text-lg font-inter font-bold">{title}</div>
              <div className="text-sm font-inter text-[#6D6D6D]">{subTitle}</div>
            </div>
            <Image
              src={
                process.env.NEXT_PUBLIC_ASSETS_URL + "icons/CloseIcon.svg"
              }
              height={13}
              width={13}
              alt="lockIcon"
              className="iconButton"
              onClick={onClose}
            />
          </div>
          <div className="mt-2 mb-4 overflow-y-auto">{children}</div>
          {showActionButtons && (
            <div className="flex gap-4">
              <Button
                title={confirmLabel}
                onClick={onConfirm}
                className="w-full !bg-primary"
                isLoading={loading}
                disabled={disabled}
              />
              <Button
                title={cancelLabel}
                onClick={onCancel}
                variant="teritary"
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};
