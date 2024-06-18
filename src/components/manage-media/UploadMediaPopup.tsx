import React, { useCallback, useContext, useMemo, useState } from "react";
import { Modal } from "../common/modal/Modal";
import { BuildingMedia, IFile } from "@/models/BuildingMediaModel";
import { MediaUploader } from "./MediaUploader";
import { ImageTypes, USER_ACTION, VideoTypes } from "../common/Constants";
import { uploadImageToS3 } from "../common/Utils";
import { v4 as uuidv4 } from "uuid";
import { SnackbarContext } from "../common/snackbar/SnackbarContext";
import { uploadBuildingMedia } from "@/services/ManageMediaService";
import { MediaCard } from "./MediaCard";
import { hasPermissionForAction } from "@/helpers/AuthHelper";
import { useSession } from "next-auth/react";

interface Props {
  open: boolean;
  isImages: boolean;
  building?: BuildingMedia;
  onClose: () => void;
  onSubmit: () => void;
}

export interface URLS {
  key: string;
  thumbnailKey: string;
}

export const UploadMediaPopup: React.FC<Props> = ({
  open,
  onClose,
  isImages,
  building,
  onSubmit,
}) => {
  const permissions = useSession().data?.user.permissions;
  const [files, setFiles] = useState<IFile[]>(
    (isImages ? building?.images : building?.videos) ?? []
  );
  const allowedTypes = isImages ? ImageTypes : VideoTypes;
  const [draggedItem, setDraggedItem] = useState<IFile | null>(null);
  const [selectedToDelete, setSelectedToDelete] = useState<IFile[]>([]);
  const [loading, setLoading] = useState(false);
  const snackbarCtx = useContext(SnackbarContext);

  const handleFileUpload = useCallback(
    async (files: File[]) => {
      if (files && files?.length > 10) {
        snackbarCtx.showSnackbar({
          type: "error",
          message: isImages
            ? "Cannot upload more than 10 images."
            : "Cannot upload more than 10 videos.",
        });
        return false;
      }
      
      const uploadPromises = files.map(async (file) => {
        if (!allowedTypes.includes(file.type)) {
          snackbarCtx.showSnackbar({
            type: "error",
            message: isImages
              ? "Invalid file type. Please upload a JPG, JPEG, PNG or SVG image."
              : "Invalid file type. Please upload a MP4, QICKTIME or AVI video.",
          });
          return;
        } else {
          try {
            const url = await uploadImageToS3(file, isImages);
            setFiles((prevSelectedFiles) => [
              ...prevSelectedFiles,
              {
                seqNo: prevSelectedFiles?.length + 1,
                imageUrl: isImages ? url.key : undefined,
                videoUrl: isImages ? undefined : url.key,
                thumbUrl: url.thumbnailKey,
              },
            ]);
          } catch (error) {
            console.error("Error uploading file:", error);
            snackbarCtx.showSnackbar({
              type: "error",
              message: "Error uploading file. Please try again.",
            });
          }
        }
      });
      await Promise.all(uploadPromises);
      return true;
    },
    [isImages, snackbarCtx, allowedTypes]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      setDraggedItem(files[index]);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
    },
    [files]
  );

  const handleDragOver = useCallback(
    (index: number) => {
      if (!draggedItem) return;
      const draggedOverItem = files[index];
      if (draggedItem === draggedOverItem) {
        return;
      }
      const newCards = files.filter((item) => item !== draggedItem);
      newCards.splice(index, 0, draggedItem);

      const data = newCards.map((file, index) => {
        return { ...file, seqNo: index + 1 };
      });
      setFiles(data);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draggedItem]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const handleDelete = useCallback(async (file: IFile) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((f) => f !== file);
      updatedFiles.forEach((f, index) => {
        f.seqNo = index + 1;
      });
      return updatedFiles;
    });
    setSelectedToDelete(
      (prev: IFile[]) => [...prev, { ...file, seqNo: undefined }] ?? []
    );
  }, []);

  const sortedFiles = useMemo(
    (): IFile[] => [...files].sort((a, b) => (a.seqNo || 0) - (b.seqNo || 0)),
    [files]
  );

  const handleNewFiles = useCallback((): IFile[] => {
    const newFiles = files
      .filter((file) => !file.id)
      .map((file) => ({
        ...file,
        id: uuidv4(),
      }));

    return newFiles;
  }, [files]);

  const handleExistingFiles = useCallback((): IFile[] => {
    return files.filter((file) => file.id);
  }, [files]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    let res: any;
    try {
      if (isImages) {
        res = await uploadBuildingMedia({
          bId: building?.id,
          images: handleExistingFiles(),
          newImages: handleNewFiles(),
          deletedImages: selectedToDelete,
          videos: building?.videos ?? [],
          newVideos: [],
          deletedVideos: [],
        });
      } else {
        res = await uploadBuildingMedia({
          bId: building?.id,
          videos: handleExistingFiles(),
          newVideos: handleNewFiles(),
          deletedVideos: selectedToDelete,
          images: building?.images ?? [],
          newImages: [],
          deletedImages: [],
        });
      }
      snackbarCtx.showSnackbar({
        type: "success",
        message: res?.message,
      });
      onSubmit?.();
      onClose();
    } catch (error: any) {
      snackbarCtx.showSnackbar({
        type: "error",
        message: error?.message ?? "Error uploading file. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [
    building?.id,
    building?.images,
    building?.videos,
    handleExistingFiles,
    handleNewFiles,
    isImages,
    onClose,
    onSubmit,
    selectedToDelete,
    snackbarCtx,
  ]);

  const handleReset = useCallback(() => {
    setFiles((isImages ? building?.images : building?.videos) ?? []);
  }, [building?.images, building?.videos, isImages]);

  const canUploadOrDelete =
    hasPermissionForAction(
      "manage_building_media",
      permissions,
      USER_ACTION.IS_WRITE
    ) ||
    hasPermissionForAction(
      "manage_building_media",
      permissions,
      USER_ACTION.IS_DELETE
    );

  const isDisabled = useMemo(
    () => files.length > 0 || selectedToDelete.length,
    [files, selectedToDelete]
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        title={"Upload Media"}
        onConfirm={handleSubmit}
        loading={loading}
        subTitle={"Add your documents here"}
        cancelLabel="Reset"
        showActionButtons={canUploadOrDelete}
        confirmLabel="Save"
        onCancel={handleReset}
        disabled={!isDisabled}
        className="w-2/3 md:w-1/2 lg:w-2/6"
      >
        <div>
          {hasPermissionForAction(
            "manage_building_media",
            permissions,
            USER_ACTION.IS_WRITE
          ) && (
            <>
              <MediaUploader onFileUpload={handleFileUpload} />
              <div className="flex justify-between items-center mt-1 max-w">
                <div className="text-[#6D6D6D] font-inter text-sm">
                  {isImages
                    ? "Only support .jpg, .png and .svg files"
                    : "Only support .mp4, .avi, .quicktime, .webm files"}
                </div>
                <div className="text-sm font-inter font-medium">Drag to Rearrange</div>
              </div>
            </>
          )}
          <div className="grid grid-cols-3 flex-wrap rounded-md items-center gap-x-4 max-h-[345px] overflow-y-auto">
            {sortedFiles.map((file: IFile, index) => {
              return (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={() => handleDragOver(index)}
                  onDragEnd={handleDragEnd}
                  className="mt-4 relative w-fit"
                >
                  <MediaCard
                    index={index}
                    file={file}
                    onDelete={handleDelete}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};
