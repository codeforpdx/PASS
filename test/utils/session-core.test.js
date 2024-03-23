import * as solidClient from '@inrupt/solid-client';
import { expect, vi, it, describe, afterEach, beforeEach } from 'vitest';
import {
  getBlobFromSolid,
  setDocContainerAclPermission
} from '../../src/utils/network/session-core';
import * as sessionHelpers from '../../src/utils/network/session-helper';

const mockPodUrl = 'https://pod.example.com/';
let session = {};

vi.mock('@inrupt/solid-client');

describe('setDocContainerAclPermission', () => {
  beforeEach(() => {
    session = {
      fetch: vi.fn(),
      info: {
        webId: `${mockPodUrl}profile/card#me`
      }
    };

    localStorage.setItem('oidcIssuer', 'https://example.com/');
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('runs setDocAclForUser with the correct inputs', async () => {
    const permissions = { read: true, append: true };
    const expectedWebId = 'https://pod2.example.com/profile/card#me';

    const expectedContainerUrl = 'https://pod.example.com/PASS/Documents/';

    vi.spyOn(sessionHelpers, 'setDocAclForUser');

    await setDocContainerAclPermission(session, permissions, mockPodUrl, expectedWebId);

    expect(sessionHelpers.setDocAclForUser).toBeCalledWith(
      session,
      expectedContainerUrl,
      '',
      expectedWebId,
      permissions
    );
  });
});

describe('getBlobFromSolid', () => {
  beforeEach(() => {
    session = {
      fetch: vi.fn(),
      info: {
        webId: `${mockPodUrl}profile/card#me`
      }
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns a blob URL', async () => {
    const mockFileUrl = 'https://pod.example.com/PASS/Documents/Passport/test.pdf';
    const fileBlob = new Blob(['file content'], { type: 'application/pdf' });
    solidClient.getFile.mockResolvedValue(fileBlob);

    // Mocking URL.createObjectURL since the function is not available for Node
    const createObjectURLMock = vi.fn().mockReturnValue('mock-url');
    global.URL.createObjectURL = createObjectURLMock;

    const result = await getBlobFromSolid(session, mockFileUrl);

    expect(result).toBe('mock-url');
  });
});
