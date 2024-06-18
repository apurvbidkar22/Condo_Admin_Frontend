"use client";
import { Button } from "@/components/common/button/Button";
import { hasPermissionForAction } from "@/helpers/AuthHelper";
import { useAsyncCall } from "@/hooks/useAsyncCall";
import { usePopup } from "@/hooks/usePopup";
import { getAssignedBuildings } from "@/services/UserService";
import { useSession } from "next-auth/react";
import React, { useCallback, useState } from "react";
import { USER_ACTION } from "../common/Constants";
import { AssignLocationPopup } from "./AssignLocationPopup";
import { AssignedLocationTable } from "./AssignedLocationTable";

interface Props {
  userId?: string;
}

const AssignLocation: React.FC<Props> = ({ userId }) => {
  const permissions = useSession().data?.user.permissions;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [assignBuildings, viewAssignBuildings, hideAssignBuildings] =
    usePopup();

  const canAssignLocation = hasPermissionForAction(
    "user_management",
    permissions,
    USER_ACTION.IS_WRITE
  );
  const {
    result: assignedBuildings,
    loading,
    refetch,
  } = useAsyncCall(async () => {
    if (userId) {
      const buildings = await getAssignedBuildings(page, limit, userId);
      return buildings.data;
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
      <AssignedLocationTable
        userId={userId}
        loading={loading}
        assignedBuildings={assignedBuildings}
        onChange={handleChange}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      {canAssignLocation && (
        <Button
          title={"Assign Location to User"}
          className="mt-4"
          onClick={viewAssignBuildings}
        />
      )}
      {assignBuildings && (
        <AssignLocationPopup
          userId={userId}
          open={assignBuildings}
          onChange={handleChange}
          onClose={hideAssignBuildings}
        />
      )}
    </>
  );
};

export default AssignLocation;
