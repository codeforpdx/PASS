import * as solidClient from '@inrupt/solid-client';
import { beforeEach, afterEach, describe, expect, vi, it } from 'vitest';
import {
  fetchProfileInfo,
  removeProfileImage,
  updateProfileInfo,
  uploadProfileImage
} from '../../src/model-helpers';
import * as utils from '../../src/utils';

let session = {};
const mockWebId = 'https://example.com/pod/profile/card#me';

vi.mock('@inrupt/solid-client');

describe('fetchProfileInfo', () => {
  beforeEach(() => {
    session = {
      fetch: vi.fn(),
      info: {
        webId: mockWebId
      }
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns expected properties for profileData object', async () => {
    vi.spyOn(solidClient, 'getWebIdDataset').mockResolvedValue(
      solidClient.mockSolidDatasetFrom(mockWebId)
    );
    vi.spyOn(solidClient, 'getThing').mockReturnValue({
      predicates: {
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': {
          namedNodes: ['http://xmlns.com/foaf/0.1/Person']
        },
        'http://www.w3.org/ns/solid/terms#oidcIssuer': {
          namedNodes: ['https://example.com/']
        }
      },
      type: 'Subject',
      url: 'https://example.com/pod/profile/card#me'
    });
    vi.spyOn(solidClient, 'getSolidDataset').mockResolvedValue();

    const results = await fetchProfileInfo(session.info.webId);

    expect(results).toHaveProperty('profileInfo.profileName');
    expect(results).toHaveProperty('profileInfo.nickname');
    expect(results).toHaveProperty('profileInfo.profileImage');
    expect(results).toHaveProperty('profileDataset');
    expect(results).toHaveProperty('profileThing');
  });
});

describe('updateProfileInfo', () => {
  beforeEach(() => {
    session = {
      fetch: vi.fn(),
      info: {
        webId: mockWebId
      }
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockDataset = solidClient.addMockResourceAclTo(solidClient.mockSolidDatasetFrom(mockWebId));

  it('only run buildThing or removeStringNoLocale when value is not null', async () => {
    const mockDatasetThing = solidClient.getThing(mockDataset, mockWebId);
    const mockData = {
      profileDataset: mockDataset,
      profileThing: mockDatasetThing,
      profileInfo: { profileName: 'Alice', nickname: null, profileImage: null }
    };
    const mockInputValues = { profileName: 'Alice', nickname: null };

    vi.spyOn(solidClient, 'removeStringNoLocale');
    vi.spyOn(solidClient, 'buildThing');
    vi.spyOn(solidClient, 'setThing').mockReturnValue();
    vi.spyOn(solidClient, 'saveSolidDatasetAt');

    await updateProfileInfo(session, mockData, mockInputValues);

    expect(solidClient.removeStringNoLocale).not.toBeCalled();
    expect(solidClient.buildThing).toBeCalledTimes(1);
    expect(solidClient.saveSolidDatasetAt).toBeCalled();
  });

  it('run buildThing twice when updating both profileName and nickname', async () => {
    const mockDatasetThing = solidClient.getThing(mockDataset, mockWebId);
    const mockData = {
      profileDataset: mockDataset,
      profileThing: mockDatasetThing,
      profileInfo: { profileName: 'Alice', nickname: null, profileImage: null }
    };
    const mockInputValues = { profileName: 'Alice', nickname: 'Al' };

    vi.spyOn(solidClient, 'removeStringNoLocale');
    vi.spyOn(solidClient, 'buildThing');
    vi.spyOn(solidClient, 'saveSolidDatasetAt');

    await updateProfileInfo(session, mockData, mockInputValues);

    expect(solidClient.removeStringNoLocale).not.toBeCalled();
    expect(solidClient.buildThing).toBeCalledTimes(2);
    expect(solidClient.saveSolidDatasetAt).toBeCalled();
  });

  it('run removeStringNoLocale when one of the inputValues are an empty string', async () => {
    const mockDatasetThing = solidClient.getThing(mockDataset, mockWebId);
    const mockData = {
      profileDataset: mockDataset,
      profileThing: mockDatasetThing,
      profileInfo: { profileName: 'Alice', nickname: null, profileImage: null }
    };
    const mockInputValues = { profileName: '', nickname: 'Al' };

    vi.spyOn(solidClient, 'removeStringNoLocale');
    vi.spyOn(solidClient, 'buildThing');
    vi.spyOn(solidClient, 'saveSolidDatasetAt');

    await updateProfileInfo(session, mockData, mockInputValues);

    expect(solidClient.removeStringNoLocale).toBeCalledTimes(1);
    expect(solidClient.buildThing).toBeCalledTimes(1);
    expect(solidClient.saveSolidDatasetAt).toBeCalled();
  });
});

describe('uploadProfileImage', () => {
  beforeEach(() => {
    session = {
      fetch: vi.fn(),
      info: {
        webId: mockWebId
      }
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockDataset = solidClient.addMockResourceAclTo(solidClient.mockSolidDatasetFrom(mockWebId));

  it('run function when triggered with inputImage', async () => {
    const mockDatasetThing = solidClient.getThing(mockDataset, mockWebId);
    const mockData = {
      profileDataset: mockDataset,
      profileThing: mockDatasetThing,
      profileInfo: { profileName: 'Alice', nickname: null, profileImage: null }
    };
    const mockImageData = new Blob(new Array(9).fill(0), { type: 'image/png' });
    const mockInputImage = new File([mockImageData], 'image.png', { type: 'image/png' });
    const mockFileResource = solidClient.mockFileFrom('https://example.com/pod/profile/image.png');
    const mockFileResourceWithAcl = solidClient.addMockResourceAclTo(mockFileResource);

    vi.spyOn(solidClient, 'saveFileInContainer').mockResolvedValue(mockFileResource);
    vi.spyOn(solidClient, 'getSourceUrl');
    vi.spyOn(utils, 'saveSourceUrlToThing').mockReturnValue(mockData.profileThing);
    vi.spyOn(solidClient, 'setThing');
    vi.spyOn(solidClient, 'getFile').mockReturnValue(mockFileResource);
    vi.spyOn(solidClient, 'createAcl');
    vi.spyOn(solidClient, 'saveSolidDatasetAt');
    vi.spyOn(solidClient, 'createAcl');
    vi.spyOn(utils, 'setupAcl').mockReturnValue(mockFileResourceWithAcl);
    vi.spyOn(solidClient, 'saveAclFor');

    await uploadProfileImage(session, mockData, mockInputImage);

    expect(solidClient.saveFileInContainer).toBeCalled();
    expect(utils.saveSourceUrlToThing).toBeCalled();
    expect(solidClient.setThing).toBeCalled();
    expect(solidClient.getFile).toBeCalled();
    expect(solidClient.createAcl).toBeCalled();
    expect(solidClient.saveSolidDatasetAt).toBeCalled();
    expect(solidClient.createAcl).toBeCalled();
    expect(utils.setupAcl).toBeCalled();
    expect(solidClient.saveAclFor).toBeCalled();
  });
});

describe('removeProfileImage', () => {
  beforeEach(() => {
    session = {
      fetch: vi.fn(),
      info: {
        webId: mockWebId
      }
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does not run deleteFile only when profileImg is null', async () => {
    const mockDataset = solidClient.addMockResourceAclTo(
      solidClient.mockSolidDatasetFrom(mockWebId)
    );
    const mockDatasetThing = solidClient.getThing(mockDataset, mockWebId);
    const mockData = { mockDataset, mockDatasetThing };

    vi.spyOn(solidClient, 'getUrl').mockReturnValue(null);
    vi.spyOn(solidClient, 'removeUrl');
    vi.spyOn(solidClient, 'setThing');
    vi.spyOn(solidClient, 'saveSolidDatasetAt');
    vi.spyOn(solidClient, 'deleteFile');

    await removeProfileImage(session, mockData);

    expect(solidClient.removeUrl).not.toBeCalled();
    expect(solidClient.setThing).not.toBeCalled();
    expect(solidClient.saveSolidDatasetAt).not.toBeCalled();
    expect(solidClient.deleteFile).not.toBeCalled();
  });

  it('run deleteFile only when profileImg is defined', async () => {
    const mockDataset = solidClient.addMockResourceAclTo(
      solidClient.mockSolidDatasetFrom(mockWebId)
    );
    const mockDatasetThing = solidClient.getThing(mockDataset, mockWebId);
    const mockData = { mockDataset, mockDatasetThing };

    vi.spyOn(solidClient, 'getUrl').mockReturnValue('https://example.com/pod/profile/image.png');
    vi.spyOn(solidClient, 'removeUrl').mockReturnThis();
    vi.spyOn(solidClient, 'setThing').mockReturnThis();
    vi.spyOn(solidClient, 'saveSolidDatasetAt');
    vi.spyOn(solidClient, 'deleteFile');

    await removeProfileImage(session, mockData);

    expect(solidClient.removeUrl).toBeCalled();
    expect(solidClient.setThing).toBeCalled();
    expect(solidClient.saveSolidDatasetAt).toBeCalled();
    expect(solidClient.deleteFile).toBeCalled();
  });
});
