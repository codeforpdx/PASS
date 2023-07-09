import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { expect, it, vi, afterEach } from 'vitest';
import { DeleteClientModal } from '../../../src/components/Clients';
import { UserListContext } from '../../../src/contexts';

afterEach(() => {
  cleanup();
});

it('shows when showDeleteClientModal is true', () => {
  const setModal = () => {};
  const removeUser = vi.fn();
  const { queryByLabelText } = render(
    <UserListContext.Provider value={{ removeUser }}>
      <DeleteClientModal
        showDeleteClientModal
        setShowDeleteClientModal={setModal}
        selectedClientToDelete={{ person: 'tim' }}
      />
    </UserListContext.Provider>
  );
  const deleteButton = queryByLabelText('Delete Client Button');
  expect(deleteButton).not.toBeNull();
});

it('hides when showDeleteClientModal is false', () => {
  const setModal = () => {};
  const removeUser = vi.fn();
  const { queryByLabelText } = render(
    <UserListContext.Provider value={{ removeUser }}>
      <DeleteClientModal
        setShowDeleteClientModal={setModal}
        selectedClientToDelete={{ person: 'tim' }}
      />
    </UserListContext.Provider>
  );
  const deleteButton = queryByLabelText('Delete Client Button');
  expect(deleteButton).toBeNull();
});

it('triggers delete client when delete button is clicked', async () => {
  const user = userEvent.setup();
  const setModal = () => {};
  const removeUser = vi.fn();
  const client = { person: 'tim' };
  const { getByLabelText } = render(
    <UserListContext.Provider value={{ removeUser }}>
      <DeleteClientModal
        showDeleteClientModal
        setShowDeleteClientModal={setModal}
        selectedClientToDelete={client}
      />
    </UserListContext.Provider>
  );
  const deleteButton = getByLabelText('Delete Client Button');
  await user.click(deleteButton);
  expect(removeUser).toBeCalledWith(client);
});

it('closes without an action when cancel button in clicked', () => {});
