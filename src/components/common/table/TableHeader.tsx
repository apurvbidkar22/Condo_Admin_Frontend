import { ColumnDefinitionType } from "./Table";

type TableHeaderProps<T, K extends keyof T> = {
  columns?: Array<ColumnDefinitionType<T, K>>;
  selectAll?: boolean;
  displayRowCheckbox?: boolean;
  onSelectAll?: () => void;
};

export const TableHeader = <T, K extends keyof T>({
  columns,
  displayRowCheckbox = false,
  selectAll,
  onSelectAll,
}: TableHeaderProps<T, K>): JSX.Element => {
  return (
    <thead className="sticky top-0 bg-[#EAEAEA] z-10">
      <tr className="h-11">
        {displayRowCheckbox && (
          <th className="rounded-bl-md">
            <input
              type="checkbox"
              className="cursor-pointer rounded-md border-gray-600 h-4 w-4 accent-black"
              checked={selectAll}
              onChange={onSelectAll}
            />
          </th>
        )}
        {columns?.map((column, index) => {
          const isFirstColumn = index === 0 && !displayRowCheckbox;
          const isLastColumn = index === columns.length - 1;
          return (
            <th
              scope="col"
              className={`text-sm font-medium font-inter ${
                isFirstColumn ? "rounded-bl-md" : ""
              } ${isLastColumn ? " rounded-br-md" : ""}`}
              key={`headCell-${index}`}
            >
              <div
                className={`whitespace-nowrap mr-4 font-inter flex justify-${column?.align}`}
                style={{ width: column.width ? column.width : "" }}
              >
                {column.header}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
