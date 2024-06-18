import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../common/button/Button";

interface FileDropzoneProps {
  onFileUpload: (files: File[]) => Promise<boolean>;
}

export const MediaUploader: React.FC<FileDropzoneProps> = ({
  onFileUpload,
}) => {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setLoading(true);

    await onFileUpload(files);
    setLoading(false);
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setLoading(true);
      const files = Array.from(e.target.files);
      await onFileUpload(files);
      setLoading(false);
    }
  };

  const handleBrowseClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div
      className={`h-44 w-full rounded-md border border-dashed border-primary ${
        dragging ? "dragging" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <input
        id="fileInput"
        type="file"
        multiple
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
      <div className="flex h-full flex-col justify-center items-center">
        <Image
          src={process.env.NEXT_PUBLIC_ASSETS_URL + "icons/Upload.svg"}
          height={48}
          width={48}
          alt="lockIcon"
        />
        <div className="text-sm font-inter text-[#0B0B0B] mt-2">
          Drag your file(s) to start uploading
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="bg-[#E7E7E7] w-20 h-[1px]" />
          <div className="text-xs font-inter text-[#6D6D6D]">OR</div>
          <div className="bg-[#E7E7E7] w-20 h-[1px]" />
        </div>
        <Button
          title={"Browse Files"}
          variant="teritary"
          className="h-8 mt-2"
          isLoading={loading}
          onClick={handleBrowseClick}
        />
      </div>
    </div>
  );
};
