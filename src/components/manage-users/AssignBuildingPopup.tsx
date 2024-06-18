import React, { useCallback, useContext, useState } from "react";
import { Modal } from "../common/modal/Modal";
import { ManageMediaFilters } from "../manage-media/ManageMediaFilters";
import { ColumnDefinitionType, Table } from "../common/table/Table";
import { Button } from "../common/button/Button";
import { BuildingMedia, MediaFilters } from "@/models/BuildingMediaModel";
import { useAsyncCall } from "@/hooks/useAsyncCall";
import { getBuildings } from "@/services/ManageMediaService";
import { assignBuildingsToUser } from "@/services/UserService";
import { SnackbarContext } from "../common/snackbar/SnackbarContext";

interface Props {
  userId?: string;
  open: boolean;
  onClose: () => void;
  onChange: () => void;
}

export const AssignBuildingPopup: React.FC<Props> = ({
  userId,
  open,
  onClose,
  onChange,
}) => {
  const [filters, setFilters] = useState<MediaFilters>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [assignedBuildings, setAssignedBuildings] = useState<string[]>([]);
  const [assignLoading, setLoading] = useState(false);
  const snackbarCtx = useContext(SnackbarContext);

  const { loading, result, refetch } = useAsyncCall(async () => {
    const buildings = await getBuildings(page, limit, filters, userId);
    return buildings.data;
  }, [page, limit, filters]);

  const handleFiltersChange = useCallback(
    (val: MediaFilters) => {
      setFilters(val);
      refetch?.();
    },
    [refetch]
  );

  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      const res = await assignBuildingsToUser(
        assignedBuildings,
        "buildings",
        false,
        "IL",
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
  }, [assignedBuildings, onChange, onClose, snackbarCtx, userId]);

  const handleAssignedBuildings = useCallback(
    (rows: BuildingMedia[]) => {
      const data = rows.map((building) => building.id.toString());
      setAssignedBuildings(data);
    },
    [setAssignedBuildings]
  );

  const handleRowsPerPageChange = useCallback((val: number) => {
    setLimit(val);
  }, []);

  const handlePageChange = useCallback((val: number) => {
    setPage(val);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={"Assign Buildings"}
      showActionButtons={false}
      className="w-full lg:w-[80%]"
    >
      <div>
        <ManageMediaFilters onFiltersChange={handleFiltersChange} />
        <Table
          columns={columns}
          data={result?.rows ?? []}
          displayRowCheckbox
          loading={loading}
          onRowSelectionChange={handleAssignedBuildings}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          totalRowCount={result?.count}
        />
        <Button
          title={"Save Changes"}
          isLoading={assignLoading}
          className="!bg-primary mt-4"
          onClick={handleClick}
        />
      </div>
    </Modal>
  );
};

const columns: ColumnDefinitionType<BuildingMedia, keyof BuildingMedia>[] = [
  {
    key: "id",
    header: "Id",
  },
  {
    key: "name",
    header: "Building Name",
    renderCell: (params: any) => {
      return <div className="text-secondary">{params?.name}</div>;
    },
  },
  {
    key: "state",
    header: "State",
  },
  {
    key: "county",
    header: "County",
  },
  {
    key: "city",
    header: "City",
  },
  {
    key: "zip",
    header: "Zip Code",
  },
  {
    key: "neighbourhood",
    header: "Neighborhood Name",
  },
  {
    key: "volume",
    header: "Volume",
  },
];
