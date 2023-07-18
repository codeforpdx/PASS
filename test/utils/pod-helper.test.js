import * as solidClient from '@inrupt/solid-client';
import { expect, vi, it, describe, afterEach, beforeEach } from 'vitest';
import {
  createDocumentsContainer,
  createInbox,
  createOutbox,
  createPublicContainer
} from '../../src/utils/pod-management/pod-helper';
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
    expect(solidClient.getSolidDataset).toBeCalled();
    expect(solidClient.createContainerAt).not.toBeCalled();
  });

  it('runs catch block if getSolidDataset rejects', async () => {
    solidClient.getSolidDataset.mockRejectedValueOnce(Error('No data found'));
    vi.spyOn(sessionHelpers, 'setDocAclForUser').mockResolvedValue();

    await createInbox(session, inboxContainerUrl);
    expect(solidClient.getSolidDataset).toBeCalled();
    expect(solidClient.createContainerAt).toBeCalled();
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
    expect(solidClient.getSolidDataset).toBeCalled();
    expect(solidClient.createContainerAt).not.toBeCalled();
  });

  it('runs catch block if getSolidDataset rejects', async () => {
    solidClient.getSolidDataset.mockRejectedValueOnce(Error('No data found'));
    vi.spyOn(sessionHelpers, 'setDocAclForUser').mockResolvedValue();

    await createOutbox(session, outboxContainerUrl);
    expect(solidClient.getSolidDataset).toBeCalled();
    expect(solidClient.createContainerAt).toBeCalled();
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
    expect(solidClient.getSolidDataset).toBeCalled();
    expect(solidClient.createContainerAt).not.toBeCalled();
  });

  it('runs catch block if getSolidDataset rejects', async () => {
    solidClient.getSolidDataset.mockRejectedValueOnce(Error('No data found'));
    vi.spyOn(sessionHelpers, 'setDocAclForUser').mockResolvedValue();
    vi.spyOn(sessionHelpers, 'setDocAclForPublic').mockResolvedValue();

    await createPublicContainer(session, publicContainerUrl);
    expect(solidClient.getSolidDataset).toBeCalled();
    expect(solidClient.createContainerAt).toBeCalled();
    expect(sessionHelpers.setDocAclForUser).toBeCalled();
    expect(sessionHelpers.setDocAclForPublic).toBeCalled();
  });
});

describe('createDocumentsContainer', () => {
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

  const publicContainerUrl = `${mockPodUrl}PASS/Documents/`;

  it('runs getSolidDatasetWithAcl if container exist and hasResourceAcl is true', async () => {
    vi.spyOn(solidClient, 'hasResourceAcl').mockReturnValue(true);
    vi.spyOn(solidClient, 'getSolidDatasetWithAcl').mockResolvedValue();

    await createDocumentsContainer(session, publicContainerUrl);
    expect(solidClient.getSolidDatasetWithAcl).toBeCalled();
    expect(solidClient.hasResourceAcl).toBeCalled();
    expect(sessionHelpers.setDocAclForUser).not.toBeCalled();
    expect(solidClient.createContainerAt).not.toBeCalled();
  });

  it('runs getSolidDatasetWithAcl if container exist and hasResourceAcl is false', async () => {
    vi.spyOn(solidClient, 'hasResourceAcl').mockReturnValue(false);
    vi.spyOn(solidClient, 'getSolidDatasetWithAcl').mockResolvedValue();

    await createDocumentsContainer(session, publicContainerUrl);
    expect(solidClient.getSolidDatasetWithAcl).toBeCalled();
    expect(solidClient.hasResourceAcl).toBeCalled();
    expect(sessionHelpers.setDocAclForUser).toBeCalled();
    expect(solidClient.createContainerAt).not.toBeCalled();
  });

  it('runs catch block if getSolidDatasetWithAcl rejects', async () => {
    vi.spyOn(solidClient, 'getSolidDatasetWithAcl').mockRejectedValue();
    vi.spyOn(sessionHelpers, 'setDocAclForUser').mockResolvedValue();

    await createDocumentsContainer(session, publicContainerUrl);
    expect(solidClient.getSolidDatasetWithAcl).toBeCalled();
    expect(solidClient.hasResourceAcl).not.toBeCalled();
    expect(solidClient.createContainerAt).toBeCalled();
    expect(sessionHelpers.setDocAclForUser).toBeCalled();
  });
});
