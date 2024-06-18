"use client";
import { Button } from "@/components/common/button/Button";
import { AssignBuildingPopup } from "@/components/manage-users/AssignBuildingPopup";
import { AssignedBuildingsTable } from "@/components/manage-users/AssignedBuildingsTable";
import { hasPermissionForAction } from "@/helpers/AuthHelper";
import { useAsyncCall } from "@/hooks/useAsyncCall";
import { usePopup } from "@/hooks/usePopup";
import { getAssignedBuildings } from "@/services/UserService";
import { useSession } from "next-auth/react";
import React, { useCallback, useState } from "react";
import { USER_ACTION } from "../common/Constants";

interface Props {
  userId?: string;
}

const AssignBuildings: React.FC<Props> = ({ userId }) => {
  const permissions = useSession().data?.user.permissions;
  const canAssignBuildings = hasPermissionForAction(
    "user_management",
    permissions,
    USER_ACTION.IS_WRITE
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [assignBuildings, viewAssignBuildings, hideAssignBuildings] =
    usePopup();

  const {
    result: assignedBuildings,
    loading,
    refetch,
  } = useAsyncCall(async () => {
    if (userId) {
      const buildings = await getAssignedBuildings(page, limit, userId);
      return buildings;
    }
  }, [page, limit]);

  const handleRowsPerPageChange = useCallback((val: number) => {
    setLimit(val);
  }, []);

  const handlePageChange = useCallback((val: number) => {
    setPage(val);
  }, []);

  const handleChange = useCallback(() => {
    refetch?.();
  }, [refetch]);

  return (
    <>
      <AssignedBuildingsTable
        userId={userId}
        loading={loading}
        assignedBuildings={assignedBuildings?.data}
        onChange={handleChange}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      {canAssignBuildings && (
        <Button
          title={"Assign Building to User"}
          className="mt-4"
          onClick={viewAssignBuildings}
        />
      )}
      {assignBuildings && (
        <AssignBuildingPopup
          userId={userId}
          open={assignBuildings}
          onChange={handleChange}
          onClose={hideAssignBuildings}
        />
      )}
    </>
  );
};

export default AssignBuildings;
