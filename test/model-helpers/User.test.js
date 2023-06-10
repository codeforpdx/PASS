import * as solidClient from '@inrupt/solid-client';
import { expect, vi, it, describe, afterEach, beforeEach } from 'vitest';
import { createUser, parseUserFromThing, updateUserActivity } from '../../src/model-helpers/User';
import { RDF_PREDICATES } from '../../src/constants';

vi.mock('@inrupt/solid-client');

const mockPodUrl = 'https://pod.example.com/';
const { getPodUrlAll, saveSolidDatasetAt, getSolidDataset, buildThing, createThing } = solidClient;
let session = {};

describe('createUser', () => {
  beforeEach(() => {
    session = {
      fetch: vi.fn()
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('properly creates user from form submission', async () => {
    getPodUrlAll.mockResolvedValue([mockPodUrl]);
    const mockUserSubmission = {
      username: 'tilde',
      givenName: 'Far',
      familyName: 'Cry',
      webId: `${mockPodUrl}profile/card`
    };
    const newUser = await createUser(session, mockUserSubmission);
    expect(newUser).toMatchObject({
      familyName: 'Cry',
      givenName: 'Far',
      username: 'tilde',
      webId: `${mockPodUrl}profile/card`,
      dateModified: null,
      podUrl: mockPodUrl
    });
  });
});

describe('updateUserActivity', () => {
  beforeEach(() => {
    session = {
      fetch: vi.fn(),
      info: {
        webId: `${mockPodUrl}profile/card`
      }
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns existing activity dataset if it exists', async () => {
    await updateUserActivity(session, mockPodUrl);
    expect(saveSolidDatasetAt).toBeCalledWith(
      `${mockPodUrl}PASS_Public/active.ttl`,
      expect.objectContaining({ type: 'Dataset' }),
      expect.objectContaining({ fetch: session.fetch })
    );
  });
  it('creates new activity dataset if it does not exist', async () => {
    vi.spyOn(solidClient, 'setAgentResourceAccess');
    vi.spyOn(solidClient, 'setPublicResourceAccess');
    getSolidDataset.mockRejectedValueOnce(Error('dataset does not exist'));
    await updateUserActivity(session, mockPodUrl);
    expect(saveSolidDatasetAt).toBeCalledWith(
      `${mockPodUrl}PASS_Public/active.ttl`,
      expect.objectContaining({ type: 'Dataset' }),
      expect.objectContaining({ fetch: session.fetch })
    );
    expect(solidClient.setAgentResourceAccess).toBeCalled();
    expect(solidClient.setPublicResourceAccess).toBeCalled();
  });
});

describe('parseUserFromThing', () => {
  beforeEach(() => {
    session = {
      fetch: vi.fn()
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const username = 'hi';
  const givenName = 'ho';
  const familyName = 'twee';
  const webId = `${mockPodUrl}profile`;
  const podUrl = mockPodUrl;
  const mockThing = buildThing(createThing({ name: username }))
    .addStringNoLocale(RDF_PREDICATES.Person, `${givenName} ${familyName}`)
    .addStringNoLocale(RDF_PREDICATES.givenName, givenName)
    .addStringNoLocale(RDF_PREDICATES.familyName, familyName)
    .addStringNoLocale(RDF_PREDICATES.alternateName, username)
    .addUrl(RDF_PREDICATES.identifier, webId)
    .addUrl(RDF_PREDICATES.URL, podUrl)
    .build();

  it('properly creates user object', async () => {
    const result = await parseUserFromThing(mockThing, session);
    expect(result).toMatchObject({
      username,
      givenName,
      familyName,
      webId,
      podUrl,
      dateModified: null
    });
  });

  it("fetches user activity from the user's pod", async () => {
    await parseUserFromThing(mockThing, session);
    expect(getSolidDataset).toBeCalledWith(
      `${podUrl}PASS_Public/active.ttl`,
      expect.objectContaining({
        fetch: session.fetch
      })
    );
  });
});
