import React, { useCallback, useContext, useState } from "react";
import { Modal } from "../common/modal/Modal";
import { ManageMediaFilters } from "../manage-media/ManageMediaFilters";
import { MediaFilters } from "@/models/BuildingMediaModel";
import { SnackbarContext } from "../common/snackbar/SnackbarContext";
import { assignLocationsToUser } from "@/services/UserService";

interface Props {
  userId?: string;
  open: boolean;
  onClose: () => void;
  onChange: () => void;
}

export const AssignLocationPopup: React.FC<Props> = ({
  userId,
  open,
  onClose,
  onChange,
}) => {
  const [assignLoading, setLoading] = useState(false);
  const snackbarCtx = useContext(SnackbarContext);

  const handleFiltersChange = useCallback(
    async (val: MediaFilters) => {
      if (val.state) {
        try {
          setLoading(true);
          const res = await assignLocationsToUser(
            val,
            "location",
            false,
            val.state ?? "",
            userId
          );
          onChange();
          setLoading(false);

          snackbarCtx.showSnackbar({
            type: "success",
            message: res?.message,
          });
          onClose();
        } catch (error: any) {
          snackbarCtx.showSnackbar({
            type: "error",
            message: error?.message ?? "Something went wrong",
          });
          console.log(error);
        }
      }
    },
    [onChange, onClose, snackbarCtx, userId]
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={"Assign Location"}
      showActionButtons={false}
      className="w-full lg:w-[60%]"
    >
      <ManageMediaFilters
        isLocation
        onFiltersChange={handleFiltersChange}
        loading={assignLoading}
      />
    </Modal>
  );
};
