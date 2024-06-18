import { useCallback, useEffect, useState } from "react";

interface AsyncApiCallStatus<TRes> {
  loading: boolean;
  result?: TRes;
  error?: unknown;
  refetch?: () => void;
}

export function useAsyncCall<TRes>(
  asyncMethod: () => Promise<TRes>,
  dependencies: any[]
): AsyncApiCallStatus<TRes> {
  const [apiCallStatus, setApiCallStatus] = useState<AsyncApiCallStatus<TRes>>({
    loading: false,
  });

  const fetchData = useCallback(async () => {
    try {
      setApiCallStatus({ loading: true });
      const result = await asyncMethod();
      setApiCallStatus({ loading: false, result, refetch });
    } catch (error: any) {
      setApiCallStatus({ loading: false, error, refetch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncMethod]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return apiCallStatus;
}
