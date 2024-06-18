"use client";
import { ManageMediaFilters } from "@/components/manage-media/ManageMediaFilters";
import { ManageMediaTable } from "@/components/manage-media/ManageMediaTable";
import { MediaCoverage } from "@/components/manage-media/MediaCoverage";
import { useAsyncCall } from "@/hooks/useAsyncCall";
import { MediaFilters } from "@/models/BuildingMediaModel";
import { getMediaCoverage } from "@/services/ManageMediaService";
import React, { useCallback, useState } from "react";

const MediaManagement = () => {
  const [filters, setFilters] = useState<MediaFilters>({});

  const handleFiltersChange = useCallback((val: MediaFilters) => {
    setFilters(val);
  }, []);

  const { result, refetch } = useAsyncCall(async () => {
    const mediaCoverage = await getMediaCoverage(filters);
    return mediaCoverage.data;
  }, [filters]);

  const handleChange = useCallback(() => {
    refetch?.();
  }, [refetch]);

  return (
    <div>
      <MediaCoverage mediaCoverage={result} />
      <ManageMediaFilters onFiltersChange={handleFiltersChange} />
      <ManageMediaTable filters={filters} onChange={handleChange} />
    </div>
  );
};

export default MediaManagement;
