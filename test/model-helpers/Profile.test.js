import { beforeEach, afterEach, describe, expect, vi, it } from 'vitest';
import { fetchProfileInfo } from '../../src/model-helpers';

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
    expect(results).toHaveProperty('profileInfo.nickname');
    expect(results).toHaveProperty('profileInfo.profileImage');
    expect(results).toHaveProperty('profileDataset');
    expect(results).toHaveProperty('profileThing');
  });
});
