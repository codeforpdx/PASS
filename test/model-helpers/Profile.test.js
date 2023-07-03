import * as solidClient from '@inrupt/solid-client';
import { beforeEach, afterEach, describe, expect, vi, it } from 'vitest';
import { fetchProfileInfo } from '../../src/model-helpers';

let session = {};
const mockWebId = 'https://example.com/pod/profile/card#me';

vi.mock('@inrupt/solid-client');

describe('fetchProfileInfo', () => {
  beforeEach(() => {
    session = {
      fetch: vi.fn(),
      info: {
        webId: mockWebId
      }
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns expected properties for profileData object', async () => {
    vi.spyOn(solidClient, 'getWebIdDataset').mockResolvedValue(
      solidClient.mockSolidDatasetFrom(mockWebId)
    );
    vi.spyOn(solidClient, 'getThing').mockReturnValue({
      predicates: {
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': {
          namedNodes: ['http://xmlns.com/foaf/0.1/Person']
        },
        'http://www.w3.org/ns/solid/terms#oidcIssuer': {
          namedNodes: ['https://example.com/']
        }
      },
      type: 'Subject',
      url: 'https://example.com/pod/profile/card#me'
    });

    const results = await fetchProfileInfo(session);

    expect(results).toHaveProperty('profileInfo.profileName');
    expect(results).toHaveProperty('profileInfo.nickname');
    expect(results).toHaveProperty('profileInfo.profileImage');
    expect(results).toHaveProperty('profileDataset');
    expect(results).toHaveProperty('profileThing');
  });
});
