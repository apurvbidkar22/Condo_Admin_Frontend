"use client"
import { useCallback, useState } from "react";

type UsePopupReturnType = [boolean, () => void, () => void];

export const usePopup = (): UsePopupReturnType => {
  const [visible, setVisible] = useState<boolean>(false);

  const showPopup = useCallback(() => {
    setVisible(true);
  }, []);

  const hidePopup = useCallback(() => {
    setVisible(false);
  }, []);

  return [visible, showPopup, hidePopup];
};
