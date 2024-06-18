import { ShortTooltip } from "../tooltip/ShortTooltip";
import { Loader } from "../loader/Loader";
import { ColumnDefinitionType } from "./Table";

type TableRowsProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<ColumnDefinitionType<T, K>>;
  isAutoHeight?: boolean;
  loading?: boolean;
  noDataFound?: string | JSX.Element;
  displayRowCheckbox?: boolean;
  selectedRows?: Array<T>;
  handleSelectRows?: (row: T) => void;
};

export const TableRows = <T, K extends keyof T>({
  data,
  columns,
  loading,
  noDataFound,
  displayRowCheckbox = false,
  selectedRows,
  handleSelectRows,
}: TableRowsProps<T, K>): JSX.Element => {
  return (
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={columns.length} className="">
            <div className="w-full flex justify-center items-center h-64">
              <Loader className="!border-black !h-10 !w-10" />
            </div>
          </td>
        </tr>
      ) : data?.length > 0 ? (
        data?.map((row: T, rowIndex) => {
          const isLastRow = rowIndex === data.length - 1;
          return (
            <tr
              className={`border-b border-[#D9D9D9] h-12 hover:shadow-lg ${
                selectedRows?.includes(row) ? "bg-[#FC866314]" : ""
              }`}
              key={`rowtr-${rowIndex}`}
            >
              {displayRowCheckbox && (
                <td key={`cell-${rowIndex}-0`} className="px-6">
                  <input
                    type="checkbox"
                    checked={selectedRows?.includes(row)}
                    onChange={() => handleSelectRows?.(row)}
                  />
                </td>
              )}
              {columns.map((column, columnIndex) => (
                <td
                  key={`cell-${rowIndex}-${columnIndex}`}
                  style={{ width: column.width ? column.width : "15rem" }}
                  className={"text-left whitespace-nowrap text-sm"}
                >
                  {column?.renderCell ? (
                    column?.renderCell(row)
                  ) : (
                    <ShortTooltip
                      text={row[column.key] as string}
                      length={column.truncateLength ?? 35}
                      direction={isLastRow ? "right" : "bottom"}
                      className={`font-inter flex justify-${column.align} mr-4`}
                    />
                  )}
                </td>
              ))}
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan={columns.length}>
            {noDataFound ? (
              <> {noDataFound}</>
            ) : (
              <div className="w-full font-inter flex justify-center items-center h-64">
                No data available
              </div>
            )}
          </td>
        </tr>
      )}
    </tbody>
  );
};
