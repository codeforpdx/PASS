import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStringNoLocale,
  getThing,
  removeThing,
  getThingAll,
  getUrl,
  buildThing,
  createThing,
  setThing,
  createSolidDataset,
  getSolidDataset,
  saveSolidDatasetAt
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '@constants';
import useSession from './useSession';

const makeIntoThing = ({ givenName, familyName, webId }) =>
  buildThing(createThing({ name: encodeURIComponent(webId) }))
    .addStringNoLocale(RDF_PREDICATES.Person, `${givenName} ${familyName}`)
    .addStringNoLocale(RDF_PREDICATES.givenName, givenName)
    .addStringNoLocale(RDF_PREDICATES.familyName, familyName)
    .addUrl(RDF_PREDICATES.identifier, webId)
    .addUrl(RDF_PREDICATES.URL, webId.split('profile')[0])
    .build();

/**
 * @typedef {object} ContactsList
 * @property {boolean} isLoading - if the contacts list is loading
 * @property {boolean} isSuccess - if the contacts list has been loaded
 * @property {boolean} isError - if an error occurred while fetching the contacts list
 * @property {object} error - the error that occurred while fetching
 * @property {Array} data - the contacts
 * @property {Function} addContact - adds the given contact object to the list
 * @property {Function} deleteContact - removes a contact from the list
 */

/**
 * useContactsList is a wrapper for a react query that manages a ContactsList object
 *
 * @returns {ContactsList} - all the data provided by the useQuery call
 * @memberof hooks
 */
let storedDataset;
const useContactsList = () => {
  const queryClient = useQueryClient();
  const { session, podUrl } = useSession();
  const { fetch } = session;
  const url = podUrl && new URL('PASS/Users/userlist.ttl', podUrl).toString();
  const parse = (data) => {
    const contactThings = getThingAll(data);
    const contacts = [];
    contactThings.forEach((thing) => {
      const contact = {};

      contact.webId = getUrl(thing, RDF_PREDICATES.identifier);
      if (!contact.webId) return;
      contact.podUrl = getUrl(thing, RDF_PREDICATES.URL);
      contact.givenName = getStringNoLocale(thing, RDF_PREDICATES.givenName);
      contact.familyName = getStringNoLocale(thing, RDF_PREDICATES.familyName);
      contact.person = getStringNoLocale(thing, RDF_PREDICATES.Person);
      contacts.push(contact);
    });
    return contacts;
  };
  const saveData = async (dataset) => {
    storedDataset = await saveSolidDatasetAt(url, dataset, {
      fetch
    });
    return parse(storedDataset);
  };

  const fetchContactsList = async () => {
    try {
      storedDataset = await getSolidDataset(url, { fetch });
    } catch (e) {
      if (e.response.status === 404) {
        storedDataset = createSolidDataset();
        storedDataset = await saveSolidDatasetAt(url, storedDataset, { fetch });
      } else {
        throw e;
      }
    }
    return parse(storedDataset);
  };

  const { isLoading, isError, error, data, isSuccess } = useQuery({
    queryKey: [url],
    queryFn: fetchContactsList
  });

  const addContactMutation = useMutation({
    mutationFn: async (newContact) => {
      if (!data) await fetchContactsList();
      const thing = makeIntoThing(newContact);
      const newDataset = setThing(storedDataset, thing);
      const newContactsList = await saveData(newDataset);
      return newContactsList;
    },
    onSuccess: (resData) => {
      queryClient.setQueryData([url], () => resData);
    }
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (contactToDelete) => {
      if (!data) await fetchContactsList();
      const thingUrl = `${url}#${encodeURIComponent(contactToDelete.webId)}`;
      const thingToRemove = getThing(storedDataset, thingUrl);
      const newDataset = removeThing(storedDataset, thingToRemove);
      const newContactsList = await saveData(newDataset);
      return newContactsList;
    },
    onSuccess: (resData) => {
      queryClient.setQueryData([url], () => resData);
    }
  });

  return {
    isLoading,
    isError,
    isSuccess,
    error,
    data,
    deleteContact: deleteContactMutation.mutate,
    addContact: addContactMutation.mutate
  };
};

export default useContactsList;
