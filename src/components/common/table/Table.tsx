"use client";
import { ReactNode, useCallback, useState, useMemo } from "react";
import { TableRows } from "./TableRows";
import { TableHeader } from "./TableHeader";
import { Pagination } from "./Pagination";

export type ColumnDefinitionType<T, K extends keyof T> = {
  key: K;
  header: string;
  width?: number;
  align?: string;
  truncateLength?: number;
  renderCell?: (params: T) => ReactNode;
};

export type TableProps<T, K extends keyof T> = {
  data: Array<T> | [];
  columns: Array<ColumnDefinitionType<T, K>>;
  isAutoHeight?: boolean;
  loading?: boolean;
  noDataFound?: string | JSX.Element;
  totalRowCount?: number;
  displayRowCheckbox?: boolean;
  onPageChange?: (value: number) => void;
  onRowsPerPageChange?: (value: number) => void;
  onRowSelectionChange?: (rows: Array<T> | []) => void;
};

export const Table = <T, K extends keyof T>({
  data,
  columns,
  isAutoHeight,
  loading = false,
  noDataFound,
  totalRowCount,
  displayRowCheckbox = false,
  onPageChange,
  onRowsPerPageChange,
  onRowSelectionChange,
}: React.PropsWithChildren<TableProps<T, K>>): JSX.Element => {
  const [selectedRows, setSelectedRows] = useState<Array<T>>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const indexOfLastRecord = useMemo(
    () => currentPage * rowsPerPage,
    [currentPage, rowsPerPage]
  );
  const indexOfFirstRecord = useMemo(
    () => indexOfLastRecord - rowsPerPage,
    [indexOfLastRecord, rowsPerPage]
  );
  const totalPages = useMemo(
    () => Math.ceil((totalRowCount ?? data.length) / rowsPerPage),
    [totalRowCount, data.length, rowsPerPage]
  );

  const handleSelectRows = useCallback(
    (row: T) => {
      setSelectedRows((prev) => {
        const updatedSelectedRows = prev.includes(row)
          ? prev.filter((selectedRow) => selectedRow !== row)
          : [...prev, row];
        onRowSelectionChange?.(updatedSelectedRows);
        return updatedSelectedRows;
      });
    },
    [onRowSelectionChange]
  );

  const resetSelection = useCallback(() => {
    setSelectedRows([]);
    onRowSelectionChange?.([]);
  }, [onRowSelectionChange]);

  const handleSelectAll = useCallback(() => {
    const updatedSelectedRows = selectAll ? [] : data;
    setSelectedRows(updatedSelectedRows);
    setSelectAll(!selectAll);
    onRowSelectionChange?.(updatedSelectedRows);
  }, [selectAll, data, onRowSelectionChange]);

  const handleRowPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      setRowsPerPage(newRowsPerPage);
      onRowsPerPageChange?.(newRowsPerPage);
      setCurrentPage(1);
      onPageChange?.(1);
      resetSelection();
    },
    [onPageChange, onRowsPerPageChange, resetSelection]
  );

  const handleCurrentPageChange = useCallback(
    (value: number) => {
      setCurrentPage(value);
      onPageChange?.(value);
      resetSelection();
    },
    [onPageChange, resetSelection]
  );

  const tableHeightClass = useMemo(() => {
    if (isAutoHeight || !data || data.length === 0) return "";
    return "min-h-[60vh] max-h-[60vh]";
  }, [isAutoHeight, data]);

  return (
    <div className="relative">
      <div className={`overflow-x-auto rounded-md ${tableHeightClass}`}>
        <table className="min-w-full border-gray-200 bg-white rounded-md shadow-sm ">
          <TableHeader
            columns={columns}
            selectAll={selectAll}
            onSelectAll={handleSelectAll}
            displayRowCheckbox={displayRowCheckbox}
          />
          <TableRows
            data={data}
            columns={columns}
            loading={loading}
            noDataFound={noDataFound}
            isAutoHeight={isAutoHeight}
            displayRowCheckbox={displayRowCheckbox}
            selectedRows={selectedRows}
            handleSelectRows={handleSelectRows}
          />
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        firstIndex={indexOfFirstRecord + 1}
        lastIndex={indexOfLastRecord}
        onCurrentPageChange={handleCurrentPageChange}
        onRowsPerPageChange={handleRowPerPageChange}
        totalRowCount={totalRowCount ?? data.length}
      />
    </div>
  );
};
