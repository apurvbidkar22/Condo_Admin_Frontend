export enum ACTIONS { EDIT = "edit", DELETE = "delete" }

export enum ROLES { SUPER_ADMIN = "super_admin", ADMIN = "admin", USER = "user" }

export const ImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"]
export const VideoTypes = ["video/mp4", "video/avi", "video/quicktime", "video/webm"]

export const SECTION_LABELS: Record<string, string> = {
  manage_users: "Manage Users",
  manage_buildings: "Manage Buildings",
  manage_media: "Manage Media",
  manage_data: "Manage Data",
};

export enum USER_ACTION {
  IS_READ = "isRead",
  IS_WRITE = "isWrite",
  IS_DELETE = "isDelete",
}

export const PERMISSION_TYPES = ["isRead", "isWrite", "isDelete"]
export const PERMISSION_LABELS: Record<string, string> = {
  isRead: "Read",
  isWrite: "Write",
  isDelete: "Delete",
};