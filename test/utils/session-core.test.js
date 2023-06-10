import {
  createContainerAt,
  deleteFile,
  getSolidDataset,
  saveSolidDatasetInContainer
} from '@inrupt/solid-client';
import { expect, vi, it, describe, afterEach, beforeEach } from 'vitest';
import {
  checkContainerPermission,
  createDocumentContainer,
  createInbox,
  createOutbox,
  createPublicContainer,
  deleteDocumentFile,
  getDocuments
} from '../../src/utils/network/session-core';
import * as sessionHelpers from '../../src/utils/network/session-helper';

const mockPodUrl = 'https://pod.example.com/';
let session = {};

vi.mock('@inrupt/solid-client');

describe('checkContainerPermission', () => {
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
    localStorage.clear();
  });
  const otherPodUsername = 'pod2';

  it('returns containerUrl if getSolidDataset resolves', async () => {
    const results = await checkContainerPermission(session, otherPodUsername);

    expect(results).toBe('https://pod2.example.com/PASS/Documents/');
  });

  it('throws an error if getSolidDataset is rejected', async () => {
    getSolidDataset.mockRejectedValueOnce(Error('No data found'));

    await expect(checkContainerPermission(session, otherPodUsername)).rejects.toThrow(
      'No data found'
    );
  });
});

describe('deleteDocumentFile', () => {
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

  it('returns containerUrl after deleting all files inside', async () => {
    vi.spyOn(sessionHelpers, 'getAllFiles').mockReturnValue([
      { url: 'https://pod.example.com/PASS/Passport/document.ttl' },
      { url: 'https://pod.example.com/PASS/Passport/uploaded.pdf' }
    ]);

    await deleteDocumentFile(session, 'Passport');
    expect(deleteFile).toBeCalledTimes(2);
  });
});

describe('getDocuments', () => {
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

  it('returns documentUrl if getSolidDataset resolves', async () => {
    const results = await getDocuments(session, 'Passport', 'self');

    expect(results).toBe('https://pod.example.com/PASS/Documents/Passport/');
  });

  it('throws an error if getSolidDataset is rejected', async () => {
    getSolidDataset.mockRejectedValueOnce(Error('No data found'));

    await expect(getDocuments(session, 'Passport', 'self')).rejects.toThrow('No data found');
  });
});

describe('createDocumentContainer', () => {
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

  it('just runs getSolidDataset if all containers exist', async () => {
    await createDocumentContainer(session, mockPodUrl);
    expect(getSolidDataset).toBeCalled();
    expect(createContainerAt).not.toBeCalled();
  });

  it('runs catch block if getSolidDataset rejects', async () => {
    getSolidDataset.mockRejectedValueOnce(Error('No data found'));
    vi.spyOn(sessionHelpers, 'setDocAclForUser').mockReturnValue();

    await createDocumentContainer(session, mockPodUrl);
    expect(getSolidDataset).toBeCalled();
    expect(createContainerAt).toBeCalled();
    expect(saveSolidDatasetInContainer).toBeCalled();
    expect(sessionHelpers.setDocAclForUser).toBeCalled();
  });
});

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
