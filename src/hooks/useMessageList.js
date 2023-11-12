import {
  getBoolean,
  getDatetime,
  getSolidDataset,
  getStringNoLocale,
  getThingAll,
  getUrl
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '@constants';
import useRdfCollection from './useRdfCollection';
import useSession from './useSession';

/**
 * @typedef {import('@inrupt/solid-client').Thing} Thing
 */

/**
 * A function that parses a message TTL file from inbox or outbox and returns a
 * messageObject
 *
 * @memberof utils
 * @function parseMessageTTL
 * @param {Thing[]} messageTTLThing - List of message Things from message boxes
 * @returns {object} messageObject - An object containinng the message content,
 * title, uploadDate, sender, and recipient
 */
export const parseMessageTTL = (messageTTLThing) => {
  // Get data related to #message
  const messageThing = messageTTLThing.find((thing) => thing.url.includes('#message'));
  const message = getStringNoLocale(messageThing, RDF_PREDICATES.message);
  const title = getStringNoLocale(messageThing, RDF_PREDICATES.title);
  const uploadDate = getDatetime(messageThing, RDF_PREDICATES.uploadDate);

  // Get data related to message status
  const messageStatusThing = messageTTLThing.find((thing) => thing.url.includes('#messagestatus'));
  let readStatus;
  if (!messageStatusThing) {
    readStatus = false;
  } else {
    readStatus = getBoolean(messageStatusThing, RDF_PREDICATES.value);
  }

  // Get data related to messageid
  const messageIdThing = messageTTLThing.find((thing) => thing.url.includes('#messageid'));
  const messageId = getStringNoLocale(messageIdThing, RDF_PREDICATES.identifier);
  const messageUrl = getUrl(messageIdThing, RDF_PREDICATES.url);

  // Get data related to #sender
  const senderThing = messageTTLThing.find((thing) => thing.url.includes('#sender'));
  const sender = getStringNoLocale(senderThing, RDF_PREDICATES.sender);
  const senderWebId = getUrl(senderThing, RDF_PREDICATES.url);

  // Get data related to #recipient
  const recipientThing = messageTTLThing.find((thing) => thing.url.includes('#recipient'));
  const recipient = getStringNoLocale(recipientThing, RDF_PREDICATES.recipient);

  return {
    message,
    messageId,
    messageUrl,
    title,
    uploadDate,
    readStatus,
    sender,
    senderWebId,
    recipient
  };
};

const useMessageList = (messageType) => {
  const { session, podUrl } = useSession();
  const { fetch } = session;
  const containerUrl = podUrl && new URL(`PASS/${messageType}/`, podUrl).toString();
  const messageList = [];

  const parse = async (data) => {
    const solidDataset = getThingAll(data);
    const allMessagesDataset = solidDataset.filter((thing) => thing.url.endsWith('ttl'));

    try {
      const promises = allMessagesDataset.map(async (message) => {
        const messageDataset = await getSolidDataset(message.url, { fetch });
        const messageThing = getThingAll(messageDataset);
        const parsedMessageObject = parseMessageTTL(messageThing);
        messageList.push(parsedMessageObject);
      });

      await Promise.all(promises);
    } catch {
      return [];
    }

    return messageList?.sort((a, b) => b.uploadDate - a.uploadDate);
  };

  return useRdfCollection(parse, () => {}, containerUrl, fetch);
};

export default useMessageList;
