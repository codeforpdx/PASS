import {
  getStringNoLocale,
  getThingAll,
  getUrl,
  buildThing,
  createThing
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '@constants';
import useSession from './useSession';
import useRdfModel from './useRdfModel';

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
const useContactsList = () => {
  const { session, podUrl } = useSession();
  const { fetch } = session;
  const fileUrl = podUrl && new URL('PASS/Users/userlist.ttl', podUrl);

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
      contact.thingId = contact.webId;
      contacts.push(contact);
    });
    return contacts;
  };

  const serialize = ({ givenName, familyName, webId }) =>
    buildThing(createThing({ name: encodeURIComponent(webId) }))
      .addStringNoLocale(RDF_PREDICATES.Person, `${givenName} ${familyName}`)
      .addStringNoLocale(RDF_PREDICATES.givenName, givenName)
      .addStringNoLocale(RDF_PREDICATES.familyName, familyName)
      .addUrl(RDF_PREDICATES.identifier, webId)
      .addUrl(RDF_PREDICATES.URL, webId.split('profile')[0])
      .build();

  const hook = useRdfModel(parse, serialize, fileUrl, fetch);
  return {
    ...hook,
    delete: async (contact) => hook.delete(contact.thingId)
  };
};

export default useContactsList;
