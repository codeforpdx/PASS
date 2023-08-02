import React, { useState } from 'react';
import { render, cleanup, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi, afterEach } from 'vitest';
import { DeleteContactModal } from '../../../src/components/Modals';

// clear created dom after each test, to start fresh for next
afterEach(() => {
  cleanup();
});

it('renders/mounts when showDeleteClientModal is true', () => {
  const removeContact = vi.fn();
  const setModal = () => {};
  const client = { person: 'john' };
  const { queryByLabelText } = render(
    <DeleteContactModal
      setShowDeleteClientModal={setModal}
      selectedClientToDelete={client}
      removeContact={removeContact}
    />
  );

  const deleteButton = queryByLabelText('Delete Client Button');
  const cancelButton = queryByLabelText('Cancel Button');

  expect(deleteButton).not.toBeNull();
  expect(cancelButton).not.toBeNull();
});

it('hides/unmounts when showDeleteClientModal is false', () => {
  const removeContact = vi.fn();
  const setModal = () => {};
  const client = { person: 'john' };
  const { queryByLabelText } = render(
    <DeleteContactModal
      setShowDeleteClientModal={setModal}
      selectedClientToDelete={client}
      removeContact={removeContact}
    />
  );

  const deleteButton = queryByLabelText('Delete Client Button');
  const cancelButton = queryByLabelText('Cancel Button');

  expect(deleteButton).toBeNull();
  expect(cancelButton).toBeNull();
});

it('triggers removeUser/deletion of client when delete button is clicked', async () => {
  const removeContact = vi.fn();
  const setModal = () => {};
  const client = { person: 'john' };
  const user = userEvent.setup();
  const { getByLabelText } = render(
    <DeleteContactModal
      setShowDeleteClientModal={setModal}
      selectedClientToDelete={client}
      removeContact={removeContact}
    />
  );

  const deleteButton = getByLabelText('Delete Client Button');

  await user.click(deleteButton);
  expect(removeContact).toBeCalledWith(client);
});

it('closes without an action when cancel button is clicked', async () => {
  const removeContact = vi.fn();
  const client = { person: 'john' };
  const user = userEvent.setup();
  const ModalWrapper = () => {
    const [setShowModal] = useState(true);

    return (
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      <DeleteContactModal
        setShowDeleteClientModal={setShowModal}
        selectedClientToDelete={client}
        removeContact={removeContact}
      />
    );
  };

  const { queryByLabelText } = render(<ModalWrapper />);

  const cancelButton = queryByLabelText('Cancel Button');

  await user.click(cancelButton);
  await waitForElementToBeRemoved(() => queryByLabelText('Cancel Button'));
  const hiddenCancelButton = queryByLabelText('Cancel Button');
  expect(hiddenCancelButton).toBeNull();
  expect(removeContact).not.toBeCalled();
});
