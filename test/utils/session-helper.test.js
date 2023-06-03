import {
  addMockResourceAclTo,
  createAcl,
  getResourceAcl,
  mockSolidDatasetFrom
} from '@inrupt/solid-client';
import { expect, vi, it, describe, beforeEach, afterEach } from 'vitest';
import { createResourceTtlFile, getContainerUrl } from '../../src/utils/network/session-helper';
import { INTERACTION_TYPES } from '../../src/constants';

const mockPodUrl = 'https://pod.example.com/';
let session = {};

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

describe('setDocAclForUser', () => {
  const documentUrl = 'https://example.com';
  let generateType;
  const mockPodResource = mockSolidDatasetFrom(documentUrl);
  const mockPodResourceWithAcl = addMockResourceAclTo(mockPodResource);
  const mockNewResourceAcl = createAcl(mockPodResource);
  const mockResourceAcl = getResourceAcl(mockPodResourceWithAcl);

  const getSolidDataset = vi.fn();
  getSolidDataset.mockResolvedValue(mockPodResource);

  const getSolidDatasetWithAcl = vi.fn();
  getSolidDatasetWithAcl.mockResolvedValue(mockPodResourceWithAcl);

  const mockCreateAcl = vi.fn();
  mockCreateAcl.mockReturnValue(mockNewResourceAcl);

  const mockGetResourceAcl = vi.fn();
  mockGetResourceAcl.mockReturnValue(mockResourceAcl);

  it("generate podResource and resourceAcl with generateType 'create'", async () => {
    generateType = 'create';
    const podResource =
      generateType === 'create'
        ? await getSolidDataset(documentUrl)
        : await getSolidDatasetWithAcl(documentUrl);

    expect(getSolidDataset).toHaveBeenCalledWith(documentUrl);
    expect(podResource).toEqual(mockPodResource);

    const resourceAcl =
      generateType === 'create' ? mockCreateAcl(podResource) : mockGetResourceAcl(podResource);

    expect(mockCreateAcl).toHaveBeenCalledWith(podResource);
    expect(resourceAcl).toEqual(mockNewResourceAcl);
  });

  it("generate podResource and resourceAcl with generateType 'update'", async () => {
    generateType = 'update';
    const podResource =
      generateType === 'create'
        ? await getSolidDataset(documentUrl)
        : await getSolidDatasetWithAcl(documentUrl);

    await expect(Promise.resolve(podResource)).resolves.toBe(
      generateType === 'create' ? mockPodResource : mockPodResourceWithAcl
    );

    expect(getSolidDatasetWithAcl).toHaveBeenCalledWith(documentUrl);
    expect(podResource).toEqual(mockPodResourceWithAcl);

    const resourceAcl =
      generateType === 'create' ? mockCreateAcl(podResource) : mockGetResourceAcl(podResource);

    expect(mockGetResourceAcl).toHaveBeenCalledWith(podResource);
    expect(resourceAcl).toEqual(mockResourceAcl);
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

  it('Calls the correct container URL to Bank Statement', () => {
    const containerUrl = getContainerUrl(session, 'Bank Statement', INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}Bank%20Statement/`);
  });

  it('Calls the correct container URL to Passport', () => {
    const containerUrl = getContainerUrl(session, 'Passport', INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}Passport/`);
  });

  it("Calls the correct container URL to Driver's License", () => {
    const containerUrl = getContainerUrl(session, "Driver's License", INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}Drivers%20License/`);
  });

  it('Calls the correct container URL to Users', () => {
    const containerUrl = getContainerUrl(session, 'Users', INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}Users/`);
  });

  it('Calls the correct container URL to Documents', () => {
    const containerUrl = getContainerUrl(session, 'Documents', INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}Documents/`);
  });

  it('Calls the correct container URL to inbox', () => {
    const containerUrl = getContainerUrl(session, 'Inbox', INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}inbox/`);
  });

  it('Calls the correct container URL to outbox', () => {
    const containerUrl = getContainerUrl(session, 'Outbox', INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}outbox/`);
  });

  it('Calls the correct container URL to public', () => {
    const containerUrl = getContainerUrl(session, 'Public', INTERACTION_TYPES.SELF);
    expect(containerUrl).toBe(`${mockPodUrl}public/`);
  });
});
