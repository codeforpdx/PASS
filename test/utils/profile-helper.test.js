import { beforeEach, afterEach, describe, expect, vi, it } from 'vitest';
import { fetchProfileInfo } from '../../src/utils';

let session = {};

vi.mock('@inrupt/solid-client');

describe('fetchProfileInfo', () => {
  beforeEach(() => {
    session = {
      fetch: vi.fn(),
      info: {
        webId: 'https://newtestuser2.opencommons.net/profile/card#me'
      }
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns expected properties for profileData object', async () => {
    const results = await fetchProfileInfo(session);

    expect(results).toHaveProperty('profileInfo.profileName');
    expect(results).toHaveProperty('profileInfo.organization');
    expect(results).toHaveProperty('profileDataset');
    expect(results).toHaveProperty('profileThing');
  });
});
