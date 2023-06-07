import { vi } from 'vitest';
import { mockSolidDatasetFrom, addMockResourceAclTo } from '@inrupt/solid-client';

export * from '@inrupt/solid-client';

const exampleUrl = 'https://example.com';

const mockDatasetFactory = (url) => Promise.resolve(addMockResourceAclTo(mockSolidDatasetFrom(url)))

export const getPodUrlAll = vi.fn(() => Promise.resolve([]));
export const saveAclFor = vi.fn((url) =>
  Promise.resolve({
    ...addMockResourceAclTo(mockSolidDatasetFrom(url)),
    internal_accessTo: exampleUrl
  }));
export const saveSolidDatasetAt = vi.fn(mockDatasetFactory);
export const getSolidDataset = vi.fn(mockDatasetFactory);
export const createContainerAt = vi.fn(() => Promise.resolve());
export const deleteFile = vi.fn(() => Promise.resolve());
export const getSolidDatasetWithAcl = vi.fn(mockDatasetFactory);
export const saveSolidDatasetInContainer = vi.fn(() => Promise.resolve());
