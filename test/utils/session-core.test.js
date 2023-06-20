import { getFile, createContainerAt, getSolidDataset } from '@inrupt/solid-client';
import { expect, vi, it, describe, afterEach, beforeEach } from 'vitest';
import {
  createInbox,
  createOutbox,
  createPublicContainer,
  getBlobFromSolid
} from '../../src/utils/network/session-core';
import * as sessionHelpers from '../../src/utils/network/session-helper';

const mockPodUrl = 'https://pod.example.com/';
let session = {};

vi.mock('@inrupt/solid-client');

describe('createInbox', () => {
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

  const inboxContainerUrl = `${mockPodUrl}PASS/Inbox/`;

  it('just runs getSolidDataset if container exist', async () => {
    await createInbox(session, inboxContainerUrl);
    expect(getSolidDataset).toBeCalled();
    expect(createContainerAt).not.toBeCalled();
  });

  it('runs catch block if getSolidDataset rejects', async () => {
    getSolidDataset.mockRejectedValueOnce(Error('No data found'));
    vi.spyOn(sessionHelpers, 'setDocAclForUser').mockReturnValue();

    await createInbox(session, inboxContainerUrl);
    expect(getSolidDataset).toBeCalled();
    expect(createContainerAt).toBeCalled();
    expect(sessionHelpers.setDocAclForUser).toBeCalled();
  });
});

describe('createOutbox', () => {
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

  const outboxContainerUrl = `${mockPodUrl}PASS/Outbox/`;

  it('just runs getSolidDataset if container exist', async () => {
    await createOutbox(session, outboxContainerUrl);
    expect(getSolidDataset).toBeCalled();
    expect(createContainerAt).not.toBeCalled();
  });

  it('runs catch block if getSolidDataset rejects', async () => {
    getSolidDataset.mockRejectedValueOnce(Error('No data found'));
    vi.spyOn(sessionHelpers, 'setDocAclForUser').mockReturnValue();

    await createOutbox(session, outboxContainerUrl);
    expect(getSolidDataset).toBeCalled();
    expect(createContainerAt).toBeCalled();
    expect(sessionHelpers.setDocAclForUser).toBeCalled();
  });
});

describe('createPublicContainer', () => {
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

  const publicContainerUrl = `${mockPodUrl}PASS/Public/`;

  it('just runs getSolidDataset if container exist', async () => {
    await createPublicContainer(session, publicContainerUrl);
    expect(getSolidDataset).toBeCalled();
    expect(createContainerAt).not.toBeCalled();
  });

  it('runs catch block if getSolidDataset rejects', async () => {
    getSolidDataset.mockRejectedValueOnce(Error('No data found'));
    vi.spyOn(sessionHelpers, 'setDocAclForUser').mockReturnValue();
    vi.spyOn(sessionHelpers, 'setDocAclForPublic').mockReturnValue();

    await createPublicContainer(session, publicContainerUrl);
    expect(getSolidDataset).toBeCalled();
    expect(createContainerAt).toBeCalled();
    expect(sessionHelpers.setDocAclForUser).toBeCalled();
    expect(sessionHelpers.setDocAclForPublic).toBeCalled();
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
    getFile.mockResolvedValue(fileBlob);

    // Mocking URL.createObjectURL since the function is not available for Node
    const createObjectURLMock = vi.fn().mockReturnValue('mock-url');
    global.URL.createObjectURL = createObjectURLMock;

    const result = await getBlobFromSolid(session, mockFileUrl);

    expect(result).toBe('mock-url');
  });
});
