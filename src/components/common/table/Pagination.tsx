import { RowPerPageOptions } from "../DropdownOptions";
import Image from "next/image";
import { useCallback } from "react";
import { RowPerPageDropdown } from "./RowPerPageDropdown";

interface Props {
  currentPage: number;
  rowsPerPage: number;
  firstIndex: number;
  lastIndex: number;
  totalPages: number;
  totalRowCount: number;
  onCurrentPageChange: (value: number) => void;
  onRowsPerPageChange: (value: number) => void;
}

export const Pagination: React.FC<Props> = ({
  totalPages,
  currentPage,
  rowsPerPage,
  firstIndex,
  lastIndex,
  totalRowCount,
  onRowsPerPageChange,
  onCurrentPageChange,
}): JSX.Element => {
  const handlePrevious = useCallback(() => {
    if (currentPage !== 1) {
      onCurrentPageChange(currentPage - 1);
    }
  }, [currentPage, onCurrentPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage !== totalPages && lastIndex < totalRowCount) {
      onCurrentPageChange(currentPage + 1);
    }
  }, [currentPage, lastIndex, onCurrentPageChange, totalPages, totalRowCount]);

  return (
    <div className="py-1 px-4 h-12 flex justify-end ">
      <div className="flex items-center gap-14 font-inter">
        <div className="flex gap-2 items-center">
          <span>Rows per page: {rowsPerPage}</span>
          <RowPerPageDropdown
            options={RowPerPageOptions}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </div>
        <div className="text-sm font-semibold">
          {`${firstIndex} - ${
            totalRowCount <= lastIndex ? totalRowCount : lastIndex
          } of ${totalRowCount}`}
        </div>
        <div className="flex items-center gap-10">
          <div className="cursor-pointer" onClick={handlePrevious}>
            <Image
              src={
                process.env.NEXT_PUBLIC_ASSETS_URL +
                "icons/PaginationRightArrowIcon.svg"
              }
              height={8}
              width={8}
              alt="paginationRightArrowIcon"
            />
          </div>
          <div className="cursor-pointer" onClick={handleNext}>
            <Image
              src={
                process.env.NEXT_PUBLIC_ASSETS_URL +
                "icons/PaginationLeftArrowIcon.svg"
              }
              height={9}
              width={9}
              alt="paginationLeftArrowIcon"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
