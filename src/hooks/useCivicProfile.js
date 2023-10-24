import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDate,
  getInteger,
  getStringNoLocale,
  getThingAll,
  buildThing,
  createThing,
  setThing,
  createSolidDataset,
  getSolidDataset,
  saveSolidDatasetAt
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '@constants';
import useSession from './useSession';

const makeIntoThing = ({ firstName, lastName, dateOfBirth, gender }) =>
  buildThing(createThing({ name: 'Civic Profile' }))
    .addStringNoLocale(RDF_PREDICATES.legalFirstName, firstName)
    .addStringNoLocale(RDF_PREDICATES.legalLastName, lastName)
    .addDate(RDF_PREDICATES.legalDOB, dateOfBirth)
    .addInteger(RDF_PREDICATES.legalGender, gender)
    .build();

const parse = (data) => {
  const profileThing = getThingAll(data);
  const profile = {};

  profile.firstName = getStringNoLocale(profileThing, RDF_PREDICATES.legalFirstName);
  profile.lastName = getStringNoLocale(profileThing, RDF_PREDICATES.legalLastName);
  profile.dateOfBirth = getDate(profileThing, RDF_PREDICATES.legalDOB);
  profile.gender = getInteger(profileThing, RDF_PREDICATES.gender);
  return profile;
};

const useCivicProfile = () => {
  const queryClient = useQueryClient();
  const { session, podUrl } = useSession();
  const { fetch } = session;
  const fileUrl = podUrl && new URL('PASS/AdditionalProfiles/civic_profile.ttl', podUrl).toString();
  const saveData = async (dataset) => {
    const savedDataset = await saveSolidDatasetAt(fileUrl, dataset, {
      fetch
    });
    return savedDataset;
  };

  const fetchCivicProfile = async () => {
    let myDataset;
    try {
      myDataset = await getSolidDataset(fileUrl, { fetch });
    } catch (e) {
      if (e.response.status === 404) {
        myDataset = createSolidDataset();
        myDataset = await saveSolidDatasetAt(fileUrl, myDataset, { fetch });
      }
      throw e;
    }
    return myDataset;
  };

  const { isLoading, isError, error, data, isSuccess } = useQuery({
    queryKey: [fileUrl],
    queryFn: fetchCivicProfile
  });

  const updateMutation = useMutation({
    mutationFn: async (profile) => {
      if (!data) await fetchCivicProfile();
      const thing = makeIntoThing(profile);
      const newDataset = setThing(data, thing);
      const savedDataset = await saveData(newDataset);
      return savedDataset;
    },
    onSuccess: (resData) => {
      queryClient.setQueryData([fileUrl], () => resData);
    }
  });

  return {
    isLoading,
    isError,
    isSuccess,
    error,
    data: !(isLoading || isError) ? parse(data) : {},
    updateProfile: updateMutation.mutate
  };
};

export default useCivicProfile;
