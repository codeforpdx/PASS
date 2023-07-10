import React from 'react';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi, afterEach } from 'vitest';
import { DeleteClientModal } from '../../../src/components/Clients';
import { UserListContext } from '../../../src/contexts';

afterEach(() => {
  cleanup();
});

const client = { person: 'tim' };
const removeUser = vi.fn();
const setModal = () => {};

it('renders/mounts when showDeleteClientModal is true', () => {
  const { queryByLabelText } = render(
    <UserListContext.Provider value={{ removeUser }}>
      <DeleteClientModal
        showDeleteClientModal
        setShowDeleteClientModal={setModal}
        selectedClientToDelete={client}
      />
    </UserListContext.Provider>
  );
  const deleteButton = queryByLabelText('Delete Client Button');
  const cancelButton = queryByLabelText('Cancel Button');
  expect(deleteButton).not.toBeNull();
  expect(cancelButton).not.toBeNull();
});

it('hides/unmounts when showDeleteClientModal is false', () => {
  const { queryByLabelText } = render(
    <UserListContext.Provider value={{ removeUser }}>
      <DeleteClientModal setShowDeleteClientModal={setModal} selectedClientToDelete={client} />
    </UserListContext.Provider>
  );
  const deleteButton = queryByLabelText('Delete Client Button');
  const cancelButton = queryByLabelText('Cancel Button');
  expect(deleteButton).toBeNull();
  expect(cancelButton).toBeNull();
});

it('triggers removeUser/deletion of client when delete button is clicked', async () => {
  const { getByLabelText } = render(
    <UserListContext.Provider value={{ removeUser }}>
      <DeleteClientModal
        showDeleteClientModal
        setShowDeleteClientModal={setModal}
        selectedClientToDelete={client}
      />
    </UserListContext.Provider>
  );
  const user = userEvent.setup();
  const deleteButton = getByLabelText('Delete Client Button');
  await user.click(deleteButton);
  expect(removeUser).toBeCalledWith(client);
});

it('closes without an action when cancel button is clicked', async () => {
  const { getByLabelText } = render(
    <UserListContext.Provider value={{ removeUser }}>
      <DeleteClientModal
        showDeleteClientModal
        setShowDeleteClientModal={setModal}
        selectedClientToDelete={client}
      />
    </UserListContext.Provider>
  );
  const user = userEvent.setup();
  const cancelButton = getByLabelText('Cancel Button');
  await user.click(cancelButton);
  const closeModal = vi.fn();
  expect(closeModal).toHaveBeenCalledOnce();
});
