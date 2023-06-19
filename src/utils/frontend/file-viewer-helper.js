import { getDocTTLs } from '../network/session-core';

const runShowFiles = async (session, podUrl) => {
  const allDocumentData = await getDocTTLs(session, podUrl);

  if (allDocumentData.message?.includes('Unauthorized')) {
    throw new Error('No permission to files.');
  }

  if (allDocumentData.message?.includes('No documents found')) {
    throw new Error('No files found.');
  }

  const permittedData = allDocumentData.filter((item) => typeof item !== 'number');
  if (permittedData.length === 0) {
    throw new Error('No permitted files found.');
  } else {
    return permittedData;
  }
};

export default runShowFiles;
