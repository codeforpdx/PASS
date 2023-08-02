import { getSolidDataset } from '@inrupt/solid-client';
import { useQuery } from '@tanstack/react-query';

/**
 *
 * @param {string} url - A string representation of the URL to fetch
 * @param {Function} fetch - An authenticated fetch call to pass to getSolidDataset
 * @returns {object} - all the data provided by the useQuery call
 */
function useDataset(url, fetch) {
  const fetchSolidDataset = async () => {
    const myDataset = await getSolidDataset(url, { fetch });

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
