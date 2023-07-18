import { expect, vi, it, describe, beforeEach, afterEach } from 'vitest';
import {
  createResourceTtlFile,
  getContainerUrl,
  getPodUrl
} from '../../src/utils/network/session-helper';
import { INTERACTION_TYPES } from '../../src/constants';

const mockPodUrl = 'https://pod.example.com/';
let session = {};

vi.mock('@inrupt/solid-client');

describe('createResourceTtlFile', () => {
  it('Has proper number of fields', async () => {
    const documentUrl = 'http://example.com';
    const mockText = vi.fn().mockResolvedValue('TEST DATA');

    const fileObjectMock = {
      type: INTERACTION_TYPES.SELF,
      description: 'random description here',
      date: 'random date',
      file: {
        name: 'file name',
        text: mockText
      }
    };

    const result = await createResourceTtlFile(fileObjectMock, documentUrl);
    expect(mockText).toBeCalledTimes(1);
    expect(Object.keys(result.predicates)).toHaveLength(7);
  });
});

describe('getContainerUrl', () => {
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

  it('Returns the correct container URL to Bank Statement', () => {
    const containerUrl = getContainerUrl(session, 'Bank Statement', INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}PASS/Bank_Statement/`);
  });

  it('Returns the correct container URL to Passport', () => {
    const containerUrl = getContainerUrl(session, 'Passport', INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}PASS/Passport/`);
  });

  it("Returns the correct container URL to Driver's License", () => {
    const containerUrl = getContainerUrl(session, "Driver's License", INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}PASS/Drivers_License/`);
  });

  it('Returns the correct container URL to Users', () => {
    const containerUrl = getContainerUrl(session, 'Users', INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}PASS/Users/`);
  });

  it('Returns the correct container URL to Documents', () => {
    const containerUrl = getContainerUrl(session, 'Documents', INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}PASS/Documents/`);
  });

  it('Returns the correct container URL to inbox', () => {
    const containerUrl = getContainerUrl(session, 'Inbox', INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}PASS/Inbox/`);
  });

  it('Returns the correct container URL to outbox', () => {
    const containerUrl = getContainerUrl(session, 'Outbox', INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}PASS/Outbox/`);
  });

  it('Returns the correct container URL to public', () => {
    const containerUrl = getContainerUrl(session, 'Public', INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}PASS/Public/`);
  });
});

describe('getPodUrl', () => {
  beforeEach(() => {
    localStorage.setItem('oidcIssuer', 'https://example.com/');
  });
  afterEach(() => {
    localStorage.clear();
  });

  it('Returns the correct podUrl', () => {
    const username = 'pod';

    const result = getPodUrl(username);
    expect(result).toBe('https://pod.example.com/');
  });
});
