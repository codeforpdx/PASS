import {
  mockSolidDatasetFrom,
  buildThing,
  createThing,
  setThing,
  getSolidDataset,
  saveSolidDatasetAt,
  saveAclFor,
  addMockResourceAclTo
} from '@inrupt/solid-client';
import { expect, vi, it, describe, afterEach, beforeEach } from 'vitest';
import { loadUserList, addUser, removeUser, makeUserIntoThing } from '../../src/model-helpers';
import { RDF_PREDICATES } from '../../src/constants';

vi.mock('@inrupt/solid-client');

const makeMockUserListDataset = (userList, url) => {
  let dataset = addMockResourceAclTo(mockSolidDatasetFrom(url));
  const usersListHeader = buildThing(createThing({ name: 'userlist' }))
    .addStringNoLocale(RDF_PREDICATES.name, 'Users List')
    .addStringNoLocale(RDF_PREDICATES.description, 'A list of users')
    .build();

  dataset = setThing(dataset, usersListHeader);
  userList.forEach((user) => {
    dataset = setThing(dataset, makeUserIntoThing(user));
  });

  return dataset;
};

const mockDatasetTim = addMockResourceAclTo(mockSolidDatasetFrom('https://tim.example.com/'));

const firstUser = {
  username: 'timbot',
  givenName: 'tim',
  familyName: 'bot',
  webId: 'https://tim.example.com/',
  podUrl: 'https://tim.example.com/pod/'
};
const secondUser = {
  username: 'turkey',
  givenName: 'tur',
  familyName: 'key',
  webId: 'https://turkey.example.com/',
  podUrl: 'https://turkey.example.com/pod/'
};
let mockSession;
const mockUserList = [firstUser, secondUser];
const mockUrl = 'https://james.example.com/Users/userlist.ttl';
const mockDataset = makeMockUserListDataset(mockUserList, mockUrl);
const mockUserListObject = {
  userList: mockUserList,
  dataset: mockDataset,
  listUrl: mockUrl
};

describe('loadUserList', () => {
  beforeEach(() => {
    mockSession = {
      fetch: vi.fn(),
      info: {
        webId: 'https://example.com/'
      }
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads a user list from a dataset', async () => {
    getSolidDataset.mockResolvedValueOnce(mockDataset);
    getSolidDataset.mockResolvedValue(mockDatasetTim);
    const userListResult = await loadUserList(mockSession, 'https://james.example.com/');
    expect(userListResult.userList).toMatchObject(mockUserList);
    expect(userListResult.listUrl).toBe(mockUrl);
    expect(userListResult.dataset).toMatchObject(mockDataset);
  });
  it('creates a new dataset if no dataset is found', async () => {
    getSolidDataset.mockRejectedValueOnce(Error('random error message'));
    getSolidDataset.mockResolvedValueOnce(mockDatasetTim);

    await loadUserList(mockSession, 'https://james.example.com/');
    expect(saveSolidDatasetAt).toBeCalledWith(
      'https://james.example.com/Users/userlist.ttl',
      expect.objectContaining({ type: 'Dataset' }),
      expect.objectContaining({ fetch: mockSession.fetch })
    );
    expect(saveAclFor).toBeCalled();
  });
});

describe('addUser', () => {
  beforeEach(() => {
    mockSession = {
      fetch: vi.fn(),
      info: {
        webId: 'https://example.com/'
      }
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
  const newUser = {
    username: 'john',
    givenName: 'tim',
    familyName: 'bot',
    webId: 'https://john.example.com/',
    podUrl: 'https://john.example.com/pod/'
  };

  it('saves new user to pod', async () => {
    saveSolidDatasetAt.mockResolvedValueOnce(
      makeMockUserListDataset(mockUserList.concat([newUser]), mockUrl)
    );
    getSolidDataset.mockRejectedValue(Error('no user activity'));

    await addUser(newUser, mockSession, mockUserListObject);
    expect(saveSolidDatasetAt).toBeCalled();
  });

  it('returns a new user list object with the new user inside', async () => {
    saveSolidDatasetAt.mockResolvedValueOnce(
      makeMockUserListDataset(mockUserList.concat([newUser]), 'https://james.example.com/')
    );
    getSolidDataset.mockRejectedValue(Error('no user activity'));

    const result = await addUser(newUser, mockSession, mockUserListObject);
    expect(result.userList).toMatchObject(mockUserList.concat([newUser]));
  });
});

describe('removeUser', () => {
  beforeEach(() => {
    mockSession = {
      fetch: vi.fn(),
      info: {
        webId: 'https://example.com/'
      }
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const reducedDataset = makeMockUserListDataset([firstUser], mockUrl);

  it('returns a new user list object that does not contain the removed user', async () => {
    saveSolidDatasetAt.mockResolvedValueOnce(reducedDataset);
    getSolidDataset.mockRejectedValue(Error('no user activity'));

    const result = await removeUser(secondUser, mockSession, mockUserListObject);
    expect(result.userList).toMatchObject([firstUser]);
  });
  it('saves updated list in pod', async () => {
    saveSolidDatasetAt.mockResolvedValueOnce(reducedDataset);
    getSolidDataset.mockRejectedValue(Error('no user activity'));

    await removeUser(secondUser, mockSession, mockUserListObject);
    expect(saveSolidDatasetAt).toBeCalled();
  });
});
