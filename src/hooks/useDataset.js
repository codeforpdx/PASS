import {
  createSolidDataset,
  getSolidDatasetWithAcl,
  saveSolidDatasetAt
} from '@inrupt/solid-client';
import { useQuery } from '@tanstack/react-query';

/**
 *
 * @param {string} url - A string representation of the URL to fetch
 * @param {Function} fetch - An authenticated fetch call to pass to getSolidDataset
 * @param {boolean} create - Whether the hook should create the dataset if it's not found
 * @returns {object} - all the data provided by the useQuery call
 */
function useDataset(url, fetch, create = false) {
  const fetchSolidDataset = async () => {
    let myDataset;
    try {
      myDataset = await getSolidDatasetWithAcl(url, { fetch });
    } catch (e) {
      if (e.response.status === 404 && create) {
        myDataset = createSolidDataset();
        myDataset = await saveSolidDatasetAt(url, myDataset, { fetch });
        return myDataset;
      }
      throw e;
    }
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
