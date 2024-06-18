import React, { useCallback } from "react";
import { AutoComplete } from "../common/dropdown/AutoComplete";
import { useAsyncCall } from "@/hooks/useAsyncCall";
import { getBuildingsFiltersOptions } from "@/services/ManageMediaService";
import { useFormikContext } from "formik";
import { MediaFilters } from "@/models/BuildingMediaModel";
import { Button } from "../common/button/Button";

interface Props {
  isLocation?: boolean;
  onFiltersChange: (filters: MediaFilters) => void;
}

export const ManageMediaFiltersForm: React.FC<Props> = ({
  isLocation = false,
  onFiltersChange,
}) => {
  const { values, resetForm } = useFormikContext<MediaFilters>();
  const { result, loading } = useAsyncCall(async () => {
    const options = await getBuildingsFiltersOptions(values);
    return options.data;
  }, [values]);

  const handleClear = useCallback(() => {
    resetForm();
    onFiltersChange({});
  }, [onFiltersChange, resetForm]);

  const gridClass = isLocation
    ? "flex grid-cols-5 lg:grid-cols-10"
    : "grid-cols-5 lg:grid-cols-9";
  const spanClass = isLocation
    ? "col-span-1 lg:col-span-2"
    : "col-span-1 lg:col-span-1";

  return (
    <div className={`grid ${gridClass} gap-2 my-7 font-poppins`}>
      <div>
        <AutoComplete
          name={"state"}
          label={"State"}
          options={result?.state}
          loading={loading && !values?.state}
        />
      </div>
      <div>
        <AutoComplete
          name={"metro"}
          label={"Metro"}
          options={result?.metro}
          disabled={!values?.state}
          loading={
            loading && !!values?.state && !values?.county && !values?.metro
          }
        />
      </div>
      <div className={spanClass}>
        <AutoComplete
          name={"county"}
          label={"County"}
          options={result?.county}
          disabled={!values?.metro}
          loading={
            loading && !!values?.metro && !values?.city && !values?.county
          }
        />
      </div>
      <div>
        <AutoComplete
          name={"city"}
          label={"City"}
          options={result?.city}
          disabled={!values?.county}
          loading={loading && !!values?.county && !values?.zip && !values?.city}
        />
      </div>
      <div className={spanClass}>
        <AutoComplete
          name={"zip"}
          label={"Zip Code"}
          options={result?.zip}
          disabled={!values?.city}
          loading={
            loading && !!values?.city && !values?.neighbourhood && !values?.zip
          }
        />
      </div>
      <div className={spanClass}>
        <AutoComplete
          name={"neighbourhood"}
          label={"Neighborhood"}
          options={result?.neighbourhood}
          disabled={!values?.zip}
          loading={
            loading && !!values?.zip && !values?.name && !values?.neighbourhood
          }
        />
      </div>
      {!isLocation && (
        <>
          <div className={spanClass}>
            <AutoComplete
              name={"name"}
              label={"Building Name"}
              options={result?.buildingname}
              disabled={!values?.neighbourhood}
              loading={loading && !!values?.neighbourhood && !values?.name}
            />
          </div>
          <Button type="submit" title={"Apply"} className="!bg-primary !py-0" />
        </>
      )}
      <Button
        title={"Clear"}
        className="!py-0"
        variant={"teritary"}
        onClick={handleClear}
      />
    </div>
  );
};
