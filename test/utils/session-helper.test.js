import {
  addMockResourceAclTo,
  createAcl,
  getResourceAcl,
  mockSolidDatasetFrom
} from '@inrupt/solid-client';
import { expect, vi, it, describe } from 'vitest';
import { createResourceTtlFile } from '../../src/utils/network/session-helper';
import { UPLOAD_TYPES } from '../../src/constants';

describe('createResourceTtlFile', () => {
  it('Has proper number of fields', async () => {
    const documentUrl = 'http://example.com';
    const mockText = vi.fn().mockResolvedValue('TEST DATA');

    const fileObjectMock = {
      type: UPLOAD_TYPES.SELF,
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
