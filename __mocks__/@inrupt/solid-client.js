import { vi } from 'vitest';
import { mockSolidDatasetFrom, addMockResourceAclTo } from '@inrupt/solid-client';

export * from '@inrupt/solid-client';

const exampleUrl = 'https://example.com';

export const getPodUrlAll = vi.fn(() => Promise.resolve([]));
export const saveAclFor = vi.fn((url) =>
  Promise.resolve({
    ...addMockResourceAclTo(mockSolidDatasetFrom(url)),
    internal_accessTo: exampleUrl
  })
);
export const saveSolidDatasetAt = vi.fn((url) =>
  Promise.resolve(addMockResourceAclTo(mockSolidDatasetFrom(url)))
);
export const getSolidDataset = vi.fn((url) =>
  Promise.resolve(addMockResourceAclTo(mockSolidDatasetFrom(url)))
);
export const deleteFile = vi.fn(() => Promise.resolve());
