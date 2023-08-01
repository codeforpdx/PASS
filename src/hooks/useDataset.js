import { getSolidDatasetWithAcl } from '@inrupt/solid-client';
import { useQuery } from '@tanstack/react-query';

function useDataset(url, fetch) {
  const fetchSolidDataset = async () => {
    const myDataset = await getSolidDatasetWithAcl(url, { fetch });

    return myDataset;
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: [url],
    queryFn: fetchSolidDataset
  });

  return {
    isLoading,
    isError,
    error,
    data
  };
}

export default useDataset;
