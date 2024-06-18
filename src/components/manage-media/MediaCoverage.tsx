import React from "react";
import { CircularProgress } from "./CircularProgress";
import { MediaItem, DonutChart } from "./DonutChart";
import { MediaCoverage as IMediaCoverage } from "@/models/BuildingMediaModel";

const MediaCoverageItem: React.FC<MediaItem> = ({ color, label, value }) => (
  <div className="h-32 w-[24%] bg-white shadow-sm rounded-md flex items-center justify-evenly">
    <div>
      <CircularProgress value={value} color={color} size={90} />
    </div>
    <div className="flex text-sm gap-8">
      <div>
        <div className="font-semibold">Status</div>
        <div className="flex items-center gap-2 mt-2">
          <div className={`h-3 w-3 bg-[${color}] rounded-full`} />
          <div>{label}</div>
        </div>
      </div>
      <div>
        <div className="flex justify-end font-semibold">%</div>
        <div className="flex justify-end mt-2">{value}%</div>
      </div>
    </div>
  </div>
);

interface Props {
  mediaCoverage?: IMediaCoverage;
}

export const MediaCoverage: React.FC<Props> = ({ mediaCoverage }) => {
  const data: MediaItem[] = [
    {
      color: "#3B82F6",
      label: "Images",
      value: mediaCoverage?.imagesCount ?? 0,
    },
    {
      color: "#F59E0B",
      label: "Videos",
      value: mediaCoverage?.videosCount ?? 0,
    },
    {
      color: "#14B8A6",
      label: "Links",
      value: mediaCoverage?.linksCount ?? 0,
    },
  ];

  return (
    <>
      <div className="font-semibold text-xl font-inter">Media Coverage</div>
      <div className="text-sm text-[#5F5F5F] font-inter">
        Remaining {mediaCoverage?.remainingMediaCount}%
      </div>
      <div className="w-full flex gap-3 mt-2 font-roboto">
        <div className="h-32 w-[28%] bg-white shadow-sm rounded-md flex items-center justify-evenly">
          <DonutChart
            total={mediaCoverage?.totalMediaCount ?? 0}
            width={120}
            height={120}
            items={data}
            innerRadius={45}
            outerRadius={55}
          />
          <div className="flex text-sm gap-8">
            <div className="">
              <div className="font-semibold">Status</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-3 w-3 bg-[#3B82F6] rounded-full" />
                <div>Images</div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-3 w-3 bg-[#F59E0B] rounded-full" />
                <div>Videos</div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-3 w-3 bg-[#14B8A6] rounded-full" />
                <div>Links</div>
              </div>
            </div>
            <div className="">
              <div className="flex justify-end font-semibold">%</div>
              <div className="flex justify-end mt-2">
                {mediaCoverage?.imagesCount ?? 0}%
              </div>
              <div className="flex justify-end mt-2">
                {mediaCoverage?.videosCount ?? 0}%
              </div>
              <div className="flex justify-end mt-2">
                {mediaCoverage?.linksCount ?? 0}%
              </div>
            </div>
          </div>
        </div>
        {data.map((item, index) => (
          <MediaCoverageItem key={index} {...item} />
        ))}
      </div>
    </>
  );
};
