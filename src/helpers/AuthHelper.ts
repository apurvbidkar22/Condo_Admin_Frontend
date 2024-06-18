import { USER_ACTION } from "@/components/common/Constants";
import { Permission } from "@/models/ManageUsersModel";

export const hasPermissionForAction = (id: string, menusPermissions?: Permission[], action: USER_ACTION = USER_ACTION.IS_READ): boolean => {
    const result = menusPermissions?.find(permission => permission.section === id);
    if (result) {
        return result[action];
    } else {
        for (const permission of menusPermissions || []) {
            if (permission.subPermissions) {
                const subPermissionResult = hasPermissionForAction(id, permission.subPermissions, action);
                if (subPermissionResult) {
                    return true;
                }
            }
        }
    }
    return false;
};
