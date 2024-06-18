import React, { useCallback, useState } from "react";
import { MediaFilters } from "@/models/BuildingMediaModel";
import { Formik, Form } from "formik";
import { ManageMediaFiltersForm } from "./ManageMediaFiltersForm";
import { Button } from "../common/button/Button";

interface Props {
  loading?: boolean;
  isLocation?: boolean;
  onFiltersChange: (filters: MediaFilters) => void;
}

export const ManageMediaFilters: React.FC<Props> = ({
  loading = false,
  isLocation,
  onFiltersChange,
}) => {
  const intialvalues = {
    name: undefined,
    city: undefined,
    state: undefined,
    neighbourhood: undefined,
    zip: undefined,
    metro: undefined,
    county: undefined,
  };

  const handleApply = useCallback(
    (values: MediaFilters) => {
      onFiltersChange(values);
    },
    [, onFiltersChange]
  );

  return (
    <Formik initialValues={intialvalues} onSubmit={handleApply}>
      {({ handleSubmit, values }) => (
        <Form onSubmit={handleSubmit}>
          <ManageMediaFiltersForm
            isLocation={isLocation}
            onFiltersChange={onFiltersChange}
          />
          {isLocation && (
            <Button
              title={"Save Changes"}
              type="submit"
              className="!bg-primary mt-4"
              isLoading={loading}
              disabled={!values?.state}
            />
          )}
        </Form>
      )}
    </Formik>
  );
};
