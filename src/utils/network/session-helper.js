import {
  getSolidDataset,
  createAcl,
  setAgentResourceAccess,
  saveAclFor,
  setAgentDefaultAccess,
  createThing,
  buildThing,
  setThing,
  getThing,
  getStringNoLocale,
  saveSolidDatasetInContainer,
  getResourceAcl,
  getSolidDatasetWithAcl,
  setPublicResourceAccess,
  setPublicDefaultAccess,
  createSolidDataset,
  getWebIdDataset
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '../../constants';

/**
 * @typedef {import('@inrupt/solid-client').Access} Access
 */

/**
 * @typedef {import('@inrupt/solid-client').AclDataset} AclDataset
 */

/**
 * @typedef {import('@inrupt/solid-client-authn-browser').Session} Session
 */

/**
 * @typedef {import('@inrupt/solid-client').SolidDataset} SolidDataset
 */

/**
 * @typedef {import('@inrupt/solid-client').Thing} Thing
 */

/**
 * @typedef {import('@inrupt/solid-client').ThingLocal} ThingLocal
 */

/**
 * Function that setups ACL permissions for a Solid dataset or resource with an
 * ACL file
 *
 * @memberof utils
 * @function setupAcl
 * @param {AclDataset} resourceWithAcl - A Solid Session Dataset with ACL file
 * (see {@link AclDataset})
 * @param {string} webId - Solid webId
 * @param {Access} accessObject - Solid Access Object which sets ACL permission
 * for read, append, write, and control (see {@link Access})
 * @param {Access} [publicAccessObject] - Access Object to set public permissions
 * @returns {AclDataset} - Solid Session Dataset with updated ACL file (see
 * {@link AclDataset})
 */
export const setupAcl = (resourceWithAcl, webId, accessObject, publicAccessObject = null) => {
  // setAgentResourceAccess will set ACL for resource and setAgentDefaultAcess
  // will set ACL for resource container
  let acl = setAgentResourceAccess(resourceWithAcl, webId, accessObject);
  acl = setAgentDefaultAccess(acl, webId, accessObject);
  acl = publicAccessObject ? setPublicResourceAccess(acl, publicAccessObject) : acl;
  return acl;
};

/**
 * Function that generates ACL file for container containing a specific document
 * type and turtle file and give the user access and control to the Solid
 * container
 *
 * @memberof utils
 * @function setDocAclForUser
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {URL} documentUrl - Url link to document container
 * @param {string} generateType - A string for "create" or "update"
 * @param {URL} webId - The webId of the user permissions are set to
 * @param {Access} [accessObject] - Access Object to set user permissions
 * @param {Access} [publicAccessObject] - Access Object to set public permissions
 * @returns {Promise} Promise - Generates ACL file for container and give user
 * access and control to it and its contents
 */
export const setDocAclForUser = async (
  session,
  documentUrl,
  generateType,
  webId,
  accessObject = {
    read: true,
    append: true,
    write: true,
    control: true
  },
  publicAccessObject = null
) => {
  const podResource =
    generateType === 'create'
      ? await getSolidDataset(documentUrl, { fetch: session.fetch })
      : await getSolidDatasetWithAcl(documentUrl, { fetch: session.fetch });
  const resourceAcl =
    generateType === 'create' ? createAcl(podResource) : getResourceAcl(podResource);
  const newAcl = setupAcl(resourceAcl, webId, accessObject, publicAccessObject);
  await saveAclFor(podResource, newAcl, { fetch: session.fetch });
};

/**
 * Function that sets up ACL file for container to public
 *
 * @memberof utils
 * @function setDocAclForPublic
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {URL} documentUrl - Url link to document container
 * @param {Access} accessObject - Access Object to use when creating the file
 * @returns {Promise} Promise - Generates ACL file for container and give user
 * access and control to it and its contents
 */

export const setDocAclForPublic = async (session, documentUrl, accessObject) => {
  const podResource = await getSolidDatasetWithAcl(documentUrl, { fetch: session.fetch });
  const resourceAcl = getResourceAcl(podResource);
  let acl = setPublicResourceAccess(resourceAcl, accessObject);
  acl = setPublicDefaultAccess(acl, accessObject);
  await saveAclFor(podResource, acl, { fetch: session.fetch });
};

/**
 * Gets user's name from profile using their webId
 *
 * @memberof utils
 * @function getUserProfileName
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {URL} webId - A user's Solid webId attached to Solid Pod
 * @returns {Promise} Promise - Fetch user's name from their Solid Pod profile
 */

export const getUserProfileName = async (webId) => {
  const profile = await getWebIdDataset(webId);
  const profileDataThing = getThing(profile, webId);
  return getStringNoLocale(profileDataThing, RDF_PREDICATES.profileName);
};

/**
 * A function that saves a message TTL file inside containerUrl and name it
 * based on its slug suggestion
 *
 * @memberof utils
 * @function saveMessageTTL
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {URL} containerUrl - URL location of Pod container
 * @param {SolidDataset} solidDataset - Solid's dataset object on Pod
 * @param {string} slug - The slug suggestion for the message file
 * @returns {Promise} Promise - Saves message TTL file inside containerUrl and
 * name the TTL file based on its slug suggestion
 */

export const saveMessageTTL = async (session, containerUrl, solidDatset, slug) => {
  await saveSolidDatasetInContainer(containerUrl, solidDatset, {
    slugSuggestion: `${slug}.ttl`,
    contentType: 'text/turtle',
    fetch: session.fetch
  });
};

/**
 * A function that builds a new message TTL file to be sent
 *
 * @memberof utils
 * @function buildMessageTTL
 * @param {Session} session - Solid's Session Object (see {@link Session})
 * @param {Date} date - JavaScript Date object
 * @param {object} messageObject - Object containing information for the message
 * content
 * @param {object} messageMetadata - Object containing information about the message
 * @param {string} buildFor - String for "Sender" or "Recipient"
 * @returns {object} messageObject - An object containinng the message content,
 * title, uploadDate, sender, and recipient
 */
export const buildMessageTTL = (session, date, messageObject, messageMetadata, buildFor) => {
  const newMessageTTL = buildThing(createThing({ name: 'message' }))
    .addDatetime(RDF_PREDICATES.uploadDate, date)
    .addStringNoLocale(RDF_PREDICATES.title, messageObject.title)
    .addStringNoLocale(RDF_PREDICATES.message, messageObject.message)
    .build();

  const newMessageStatus = buildThing(createThing({ name: 'messagestatus' }))
    .addStringNoLocale(RDF_PREDICATES.propertyValue, 'Read Status')
    .addBoolean(RDF_PREDICATES.value, false)
    .build();

  const newMessageID = buildThing(createThing({ name: 'messageid' }))
    .addStringNoLocale(RDF_PREDICATES.identifier, messageMetadata.messageId)
    .addUrl(
      RDF_PREDICATES.url,
      buildFor === 'sender'
        ? `${messageMetadata.podUrl}PASS/Outbox/${messageMetadata.messageSlug}.ttl`
        : `${messageMetadata.recipientPodUrl}PASS/Inbox/${messageMetadata.messageSlug}.ttl`
    )
    .build();

  const senderInfo = buildThing(createThing({ name: 'sender' }))
    .addStringNoLocale(RDF_PREDICATES.sender, messageMetadata.senderName)
    .addUrl(RDF_PREDICATES.url, session.info.webId)
    .build();

  const recipientInfo = buildThing(createThing({ name: 'recipient' }))
    .addStringNoLocale(RDF_PREDICATES.recipient, messageMetadata.recipientName)
    .addUrl(RDF_PREDICATES.url, messageMetadata.recipientWebId)
    .build();

  let newSolidDataset = createSolidDataset();
  [newMessageTTL, newMessageStatus, newMessageID, senderInfo, recipientInfo].forEach((thing) => {
    newSolidDataset = setThing(newSolidDataset, thing);
  });

  let replyTo;

  if (messageObject.inReplyTo) {
    replyTo = buildThing(createThing({ name: 'replyTo' }))
      .addStringNoLocale(RDF_PREDICATES.identifier, messageObject.inReplyTo)
      .addUrl(
        RDF_PREDICATES.url,
        buildFor === 'sender'
          ? messageObject.messageUrl
          : `${`${messageMetadata.recipientPodUrl}PASS/Outbox/`}${
              messageObject.messageUrl.split(`${messageMetadata.podUrl}PASS/Inbox/`)[1]
            }`
      )
      .build();

    newSolidDataset = setThing(newSolidDataset, replyTo);
  }

  return newSolidDataset;
};

/**
 * Function take saves the source URL to the associated Thing
 *
 * @param {ThingLocal} thing - Associated Thing with source URL
 * @param {URL} sourceUrl - The source URL to the related Thing
 * @param {string} urlPredicate - The string related to which predicate to use
 * @returns {ThingLocal} thing - The updated Thing with the sourceURL now attached
 * to the RDF
 */
export const saveSourceUrlToThing = (thing, sourceUrl, urlPredicate) =>
  buildThing(thing).addUrl(RDF_PREDICATES[urlPredicate], sourceUrl).build();
