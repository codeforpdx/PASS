import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  buildThing,
  createSolidDataset,
  createThing,
  getBoolean,
  getDatetime,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getThingAll,
  getUrl,
  saveSolidDatasetAt,
  setThing
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '@constants';
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

/**
 * Function that updates the read status of the message in the inbox
 *
 * @memberof utils
 * @function updateMessageReadStatus
 * @param fetchData
 * @param {Session} session - Solid's Session Object {@link Session}
 * @param {object} messageObject - An object containing inputs for the the message
 * @returns {Promise} Promise - Perform action that updates read status of message
 * on messageObject
 */
export const updateMessageReadStatus = async (messageObject, fetchData) => {
  let messageDataset = await getSolidDataset(messageObject.messageUrl, { fetch: fetchData });
  let messageStatusThing = getThing(messageDataset, `${messageObject.messageUrl}#messagestatus`);

  if (messageStatusThing) {
    const readStatus = getBoolean(messageStatusThing, RDF_PREDICATES.value);

    if (!readStatus) {
      messageStatusThing = buildThing(messageStatusThing)
        .setBoolean(RDF_PREDICATES.value, true)
        .build();
    }
  } else {
    messageStatusThing = buildThing(createThing({ name: 'messagestatus' }))
      .addStringNoLocale(RDF_PREDICATES.propertyValue, 'Read Status')
      .addBoolean(RDF_PREDICATES.value, true)
      .build();
  }

  messageDataset = setThing(messageDataset, messageStatusThing);

  try {
    await saveSolidDatasetAt(messageObject.messageUrl, messageDataset, { fetch: fetchData });
  } catch (error) {
    throw new Error('Failed to update ttl file.');
  }
};

const useMessageList = (messageType) => {
  const { session, podUrl } = useSession();
  const { fetch } = session;
  const [storedDataset, setStoredDataset] = useState(null);
  const queryClient = useQueryClient();
  const containerUrl = podUrl && new URL(`PASS/${messageType}/`, podUrl).toString();
  let messageList = [];

  const parse = async (data) => {
    const solidDataset = getThingAll(data);
    const allMessagesDataset = solidDataset.filter((thing) => thing.url.endsWith('ttl'));

    try {
      messageList = await Promise.all(
        allMessagesDataset.map(async (message) => {
          const messageDataset = await getSolidDataset(message.url, { fetch });
          const messageThing = getThingAll(messageDataset);
          return parseMessageTTL(messageThing);
        })
      );
    } catch {
      return [];
    }

    return messageList?.sort((a, b) => b.uploadDate - a.uploadDate);
  };

  const updateReadStatus = async (messageObject) => {
    await updateMessageReadStatus(messageObject, fetch);
  };

  const fetchDocument = async () => {
    let myDataset;
    try {
      myDataset = await getSolidDataset(containerUrl.toString(), { fetch });
    } catch (e) {
      if (e.response.status === 404) {
        myDataset = createSolidDataset();
        myDataset = await saveSolidDatasetAt(containerUrl.toString(), myDataset, { fetch });
      } else {
        throw e;
      }
    }
    setStoredDataset(myDataset);
    return parse(myDataset);
  };

  const { isLoading, isError, error, data, isSuccess, refetch, isFetching } = useQuery({
    queryKey: [containerUrl?.toString()],
    queryFn: fetchDocument
  });

  const addMutation = useMutation({
    mutationFn: async (item) => {
      updateReadStatus(item);
      const savedDataset = await getSolidDataset(containerUrl.toString(), { fetch });
      setStoredDataset(savedDataset);
      return parse(savedDataset);
    },
    onSuccess: (resData) => {
      queryClient.setQueryData([containerUrl.toString()], () => resData);
    }
  });

  return {
    isLoading,
    isError,
    isSuccess,
    error,
    data,
    storedDataset,
    refetch,
    isFetching,
    add: addMutation.mutate
  };
};

export default useMessageList;
