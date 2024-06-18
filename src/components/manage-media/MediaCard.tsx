import React, { useEffect, useState } from "react";
import { generatePresignedUrl } from "../common/Utils";
import { IFile } from "@/models/BuildingMediaModel";
import Image from "next/image";
import { hasPermissionForAction } from "@/helpers/AuthHelper";
import { USER_ACTION } from "../common/Constants";
import { useSession } from "next-auth/react";

interface Props {
  index: number;
  file: IFile;
  onDelete: (file: IFile) => void;
}

export const MediaCard: React.FC<Props> = ({ index, file, onDelete }) => {
  const permissions = useSession().data?.user.permissions;
  const [thumbImageUrl, setThumbImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchThumbImageUrl = async () => {
      if (file.thumbUrl) {
        const url = await generatePresignedUrl(file?.thumbUrl ?? "");
        setThumbImageUrl(url);
      }
    };

    fetchThumbImageUrl();
  }, [file]);

  return (
    <>
      <img
        src={thumbImageUrl}
        alt={"thumb_" + index}
        className="rounded-md !h-[150px] !w-[150px]"
      />

      {hasPermissionForAction(
        "manage_building_media",
        permissions,
        USER_ACTION.IS_DELETE
      ) && (
        <Image
          src={process.env.NEXT_PUBLIC_ASSETS_URL + "icons/DeleteImageIcon.svg"}
          height={18}
          width={18}
          alt=""
          className="absolute top-[5%] right-[5%] cursor-pointer"
          onClick={() => onDelete(file)}
        />
      )}
    </>
  );
};
