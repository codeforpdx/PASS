import * as solidClient from '@inrupt/solid-client';
import { expect, vi, it, describe, afterEach, beforeEach } from 'vitest';
import createPASSContainer from '../../src/utils/pod-management/pod-helper';
import * as sessionHelpers from '../../src/utils/network/session-helper';

const mockPodUrl = 'https://pod.example.com/';
let session = {};

vi.mock('@inrupt/solid-client');

describe('createPASSContainer with existing container', () => {
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

  it('if Documents exist and hasResourceAcl is true', async () => {
    vi.spyOn(solidClient, 'hasResourceAcl').mockReturnValue(true);
    vi.spyOn(sessionHelpers, 'setDocAclForUser');

    await createPASSContainer(session, mockPodUrl, 'Documents');
    expect(solidClient.getSolidDatasetWithAcl).toBeCalled();
    expect(solidClient.hasResourceAcl).toBeCalled();
    expect(sessionHelpers.setDocAclForUser).not.toBeCalled();
  });

  it('if Documents exist and hasResourceAcl is false', async () => {
    vi.spyOn(solidClient, 'hasResourceAcl').mockReturnValue(false);
    vi.spyOn(sessionHelpers, 'setDocAclForUser');
    vi.spyOn(sessionHelpers, 'setDocAclForPublic');

    await createPASSContainer(session, mockPodUrl, 'Documents');
    expect(solidClient.getSolidDatasetWithAcl).toBeCalled();
    expect(solidClient.hasResourceAcl).toBeCalled();
    expect(sessionHelpers.setDocAclForUser).toBeCalled();
    expect(sessionHelpers.setDocAclForPublic).not.toBeCalled();
  });

  it('if Inbox exist and hasResourceAcl is true', async () => {
    vi.spyOn(solidClient, 'hasResourceAcl').mockReturnValue(true);
    vi.spyOn(sessionHelpers, 'setDocAclForUser');

    await createPASSContainer(session, mockPodUrl, 'Inbox', { append: true });
    expect(solidClient.getSolidDatasetWithAcl).toBeCalled();
    expect(solidClient.hasResourceAcl).toBeCalled();
    expect(sessionHelpers.setDocAclForUser).not.toBeCalled();
  });

  it('if Inbox exist and hasResourceAcl is false', async () => {
    vi.spyOn(solidClient, 'hasResourceAcl').mockReturnValue(false);
    vi.spyOn(sessionHelpers, 'setDocAclForUser');
    vi.spyOn(sessionHelpers, 'setDocAclForPublic');

    await createPASSContainer(session, mockPodUrl, 'Inbox', { append: true });
    expect(solidClient.getSolidDatasetWithAcl).toBeCalled();
    expect(solidClient.hasResourceAcl).toBeCalled();
    expect(sessionHelpers.setDocAclForUser).toBeCalled();
    expect(sessionHelpers.setDocAclForPublic).toBeCalled();
  });
});

describe('createPASSContainer without container', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it('if Documents does not exist', async () => {
    vi.spyOn(solidClient, 'getSolidDatasetWithAcl').mockRejectedValue();

    await createPASSContainer(session, mockPodUrl, 'Documents');
    expect(solidClient.getSolidDatasetWithAcl).toBeCalled();
    expect(solidClient.createContainerAt).toBeCalled();
  });
});
