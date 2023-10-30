import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  getThing,
  removeThing,
  setThing,
  createSolidDataset,
  getSolidDataset,
  saveSolidDatasetAt
} from '@inrupt/solid-client';

const useRdfModel = (parse, serialize, fileUrl, fetchData) => {
  const [storedDataset, setStoredDataset] = useState(null);
  const queryClient = useQueryClient();

  const saveData = async (dataset) => {
    const savedDataset = await saveSolidDatasetAt(fileUrl.toString(), dataset, {
      fetch: fetchData
    });
    setStoredDataset(savedDataset);
    return parse(savedDataset);
  };

  const fetchDocument = async () => {
    let myDataset;
    try {
      myDataset = await getSolidDataset(fileUrl.toString(), { fetch: fetchData });
    } catch (e) {
      if (e.response.status === 404) {
        myDataset = createSolidDataset();
        myDataset = await saveSolidDatasetAt(fileUrl.toString(), myDataset, { fetch: fetchData });
      } else {
        throw e;
      }
    }
    setStoredDataset(myDataset);
    return parse(myDataset);
  };

  const { isLoading, isError, error, data, isSuccess } = useQuery({
    queryKey: [fileUrl?.toString()],
    queryFn: fetchDocument
  });

  const addMutation = useMutation({
    mutationFn: async (item) => {
      if (!data) await fetchDocument();
      const thing = serialize(item);
      const newDataset = setThing(storedDataset, thing);
      const savedDataset = await saveData(newDataset);
      return savedDataset;
    },
    onSuccess: (resData) => {
      queryClient.setQueryData([fileUrl.toString()], () => resData);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (itemId) => {
      const itemUrl = fileUrl;
      itemUrl.hash = encodeURIComponent(itemId);
      const thingToRemove = getThing(storedDataset, itemUrl.toString());
      const newDataset = removeThing(storedDataset, thingToRemove);
      const newDocument = await saveData(newDataset);
      return newDocument;
    },
    onSuccess: (resData) => {
      queryClient.setQueryData([fileUrl.toString()], () => resData);
    }
  });

  return {
    isLoading,
    isError,
    isSuccess,
    error,
    data,
    storedDataset,
    add: addMutation.mutate,
    delete: deleteMutation.mutate
  };
};

export default useRdfModel;
