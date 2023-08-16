import * as solidClient from '@inrupt/solid-client';
import { expect, vi, it, describe } from 'vitest';
import { createUser, parseUserFromThing } from '../../src/model-helpers/User';
import { RDF_PREDICATES } from '../../src/constants';

vi.mock('@inrupt/solid-client');

const mockPodUrl = 'https://pod.example.com/';
const { getPodUrlAll, buildThing, createThing } = solidClient;

describe('createUser', () => {
  it('properly creates user from form submission', async () => {
    getPodUrlAll.mockResolvedValue([mockPodUrl]);
    const mockUserSubmission = {
      username: 'tilde',
      givenName: 'Far',
      familyName: 'Cry',
      webId: `${mockPodUrl}profile/card`
    };
    const newUser = await createUser(mockUserSubmission);
    expect(newUser).toMatchObject({
      familyName: 'Cry',
      givenName: 'Far',
      username: 'tilde',
      webId: `${mockPodUrl}profile/card`,
      podUrl: mockPodUrl
    });
  });
});

describe('parseUserFromThing', () => {
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
    const result = parseUserFromThing(mockThing);
    expect(result).toMatchObject({
      username,
      givenName,
      familyName,
      webId,
      podUrl
    });
  });
});
