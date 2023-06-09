import {
  buildThing,
  createThing,
  mockSolidDatasetFrom,
  saveSolidDatasetAt,
  setThing
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '../../constants';

export const registerPod = async (
  { email, password, confirmPassword },
  oidcProvider = import.meta.env.VITE_SOLID_POD_SERVER
) => {
  const [podName] = email.split('@');

  const oidcRegistrationPath = `${oidcProvider}idp/register/`;

  const body = {
    email,
    password,
    confirmPassword,
    podName,
    createWebId: true,
    createPod: true,
    rootPod: false,
    register: true
  };

  const response = await fetch(oidcRegistrationPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return response.json();
};

export const subscribeToUser = async (userPodUrl, myProfile) => {
  const { myWebId, myPodUrl, myEmail } = myProfile;
  const [username] = myEmail.split('@');
  const thing = buildThing(createThing({ name: username }))
    .addUrl(RDF_PREDICATES.identifier, myWebId)
    .addUrl(RDF_PREDICATES.URL, myPodUrl)
    .build();
  const datasetUrl = `${userPodUrl}Users/userlist.ttl`;
  // Inrupt's libraries don't seem to support append-only access to datasets normally.
  // mockSolidDatasetFrom is a workaround
  let dataset = mockSolidDatasetFrom(datasetUrl)
  dataset = setThing(dataset, thing);
  await saveSolidDatasetAt(datasetUrl, dataset);
};
