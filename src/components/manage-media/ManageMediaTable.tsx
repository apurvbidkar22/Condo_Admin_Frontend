"use client";
import React, { useCallback, useState } from "react";
import { ColumnDefinitionType, Table } from "../common/table/Table";
import Image from "next/image";
import { BuildingMedia, MediaFilters } from "@/models/BuildingMediaModel";
import { HamburgurMenu } from "../common/menu/HamburgurMenu";
import { usePopup } from "@/hooks/usePopup";
import { UploadMediaPopup } from "./UploadMediaPopup";
import { useAsyncCall } from "@/hooks/useAsyncCall";
import { getBuildings } from "@/services/ManageMediaService";

interface Props {
  filters: MediaFilters;
  onChange: () => void;
}

export const ManageMediaTable: React.FC<Props> = ({ filters, onChange }) => {
  const [uploadMedia, showUploadMedia, hideUploadMedia] = usePopup();
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingMedia>();
  const [isImages, setIsImages] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { loading, result, refetch } = useAsyncCall(async () => {
    const buildings = await getBuildings(page, limit, filters);
    return buildings.data;
  }, [page, limit, filters]);

  const handleRowsPerPageChange = useCallback((val: number) => {
    setLimit(val);
  }, []);

  const handlePageChange = useCallback((val: number) => {
    setPage(val);
  }, []);

  const handleUploadImage = useCallback(
    (val: BuildingMedia) => {
      setIsImages(true);
      setSelectedBuilding(val);
      showUploadMedia();
    },
    [showUploadMedia]
  );

  const handleUploadVideos = useCallback(
    (val: BuildingMedia) => {
      setIsImages(false);
      setSelectedBuilding(val);
      showUploadMedia();
    },
    [showUploadMedia]
  );
  const handleSubmit = useCallback(() => {
    refetch?.();
    onChange();
  }, [onChange, refetch]);

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
      key: "metro",
      header: "Metro",
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
      key: "images",
      header: "#Images",
      align: "center",
      renderCell: (params: BuildingMedia) => {
        return (
          <div className="flex justify-evenly">
            <div className="px-2 py-1 rounded-md bg-[#E2E2E2]">
              {params?.imagesCount ?? 0}
            </div>
            <Image
              src={process.env.NEXT_PUBLIC_ASSETS_URL + "icons/EditIcon.svg"}
              height={18}
              width={18}
              alt=""
              className="iconButton"
              onClick={() => handleUploadImage(params)}
            />
          </div>
        );
      },
    },
    {
      key: "videos",
      header: "#Videos",
      align: "center",
      renderCell: (params: BuildingMedia) => {
        return (
          <div className="flex justify-evenly ">
            <div className="px-2 py-1 rounded-md bg-[#E2E2E2] ">
              {params?.videosCount ?? 0}
            </div>
            <Image
              src={process.env.NEXT_PUBLIC_ASSETS_URL + "icons/EditIcon.svg"}
              height={18}
              width={18}
              className="iconButton"
              alt=""
              onClick={() => handleUploadVideos(params)}
            />
          </div>
        );
      },
    },
    {
      key: "volume",
      header: "Volume",
    },
  ];

  return (
    <>
      <div className="mt-9">
        <Table
          columns={columns}
          loading={loading}
          data={result?.rows ?? []}
          isAutoHeight
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          totalRowCount={result?.count}
        />
      </div>
      {uploadMedia && (
        <UploadMediaPopup
          open={uploadMedia}
          isImages={isImages}
          building={selectedBuilding}
          onClose={hideUploadMedia}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};
