import React, { useCallback, useContext, useState } from "react";
import { ColumnDefinitionType, Table } from "../common/table/Table";
import { BuildingMedia, BuildingsResponse } from "@/models/BuildingMediaModel";
import { Button } from "../common/button/Button";
import { assignBuildingsToUser } from "@/services/UserService";
import { SnackbarContext } from "../common/snackbar/SnackbarContext";
import { useSession } from "next-auth/react";
import { hasPermissionForAction } from "@/helpers/AuthHelper";
import { USER_ACTION } from "../common/Constants";

interface Props {
  userId?: string;
  assignedBuildings?: BuildingsResponse;
  loading?: boolean;
  onChange: () => void;
  onPageChange?: (value: number) => void;
  onRowsPerPageChange?: (value: number) => void;
}

export const AssignedBuildingsTable: React.FC<Props> = ({
  userId,
  loading,
  assignedBuildings,
  onChange,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const [selectedToUnassign, setSelectedToUnassign] = useState<string[]>([]);
  const [unAssignLoading, setLoading] = useState(false);
  const snackbarCtx = useContext(SnackbarContext);
  const permissions = useSession().data?.user.permissions;
  const canUnAssignBuildings = hasPermissionForAction(
    "user_management",
    permissions,
    USER_ACTION.IS_DELETE
  );

  const columns: ColumnDefinitionType<BuildingMedia, keyof BuildingMedia>[] = [
    {
      key: "id",
      header: "Id",
    },
    {
      key: "name",
      header: "Building Name",
    },
    {
      key: "state",
      header: "State",
    },
    {
      key: "city",
      header: "City",
    },
    {
      key: "neighbourhood",
      header: "Neighborhood Name",
    },
    {
      key: "zip",
      header: "Zip Code",
    },
    {
      key: "volume",
      header: "Volume",
    },
  ];

  const handleUnAssignBuildings = useCallback((rows: BuildingMedia[]) => {
    const data = rows.map((building) => building.id.toString());
    setSelectedToUnassign(data);
  }, []);

  const handleUnassign = useCallback(async () => {
    setLoading(true);
    try {
      const res = await assignBuildingsToUser(
        selectedToUnassign,
        "buildings",
        true,
        "IL",
        userId
      );

      onChange();
      setSelectedToUnassign([]);
      snackbarCtx.showSnackbar({
        type: "success",
        message: res?.message,
      });
    } catch (error: any) {
      snackbarCtx.showSnackbar({
        type: "error",
        message: error?.messagge ?? "Something went wrong",
      });
    }
    setLoading(false);
  }, [onChange, selectedToUnassign, snackbarCtx, userId]);

  return (
    <>
      <div className="flex justify-between items-center mt-6 mb-2">
        <div className="text-xl font-inter font-semibold">Assigned Buildings</div>
        <div>
          {canUnAssignBuildings && (
            <Button
              title={"Unassign Buildings"}
              isLoading={unAssignLoading}
              disabled={selectedToUnassign.length <= 0}
              onClick={handleUnassign}
            />
          )}
        </div>
      </div>
      <Table
        columns={columns}
        data={assignedBuildings?.rows ?? []}
        loading={loading}
        isAutoHeight
        displayRowCheckbox={canUnAssignBuildings}
        totalRowCount={assignedBuildings?.count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onRowSelectionChange={handleUnAssignBuildings}
        noDataFound={
          <div className="text-[#FF1313] text-sm font-inter h-12 flex items-center ml-4">
            no buildings assigned*
          </div>
        }
      />
    </>
  );
};
