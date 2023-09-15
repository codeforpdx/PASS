import React, { useState } from 'react';
import { render, cleanup, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi, afterEach } from 'vitest';
import { DeleteContactModal } from '../../../src/components/Modals';
import { NotificationContext } from '../../../src/contexts/NotificationContext';

// clear created dom after each test, to start fresh for next
afterEach(() => {
  cleanup();
});

it('renders/mounts when showDeleteContactModal is true', () => {
  const removeContact = vi.fn();
  const setModal = () => {};
  const client = { person: 'john' };
  const { queryByLabelText } = render(
    <DeleteContactModal
      showDeleteContactModal
      setShowDeleteContactModal={setModal}
      selectedContactToDelete={client}
      removeContact={removeContact}
    />
  );

  const deleteButton = queryByLabelText('Delete Contact Button');
  const cancelButton = queryByLabelText('Cancel Button');

  expect(deleteButton).not.toBeNull();
  expect(cancelButton).not.toBeNull();
});

it('hides/unmounts when showDeleteContactModal is false', () => {
  const removeContact = vi.fn();
  const setModal = () => {};
  const client = { person: 'john' };
  const { queryByLabelText } = render(
    <DeleteContactModal
      setShowDeleteContactModal={setModal}
      selectedContactToDelete={client}
      removeContact={removeContact}
    />
  );

  const deleteButton = queryByLabelText('Delete Contact Button');
  const cancelButton = queryByLabelText('Cancel Button');

  expect(deleteButton).toBeNull();
  expect(cancelButton).toBeNull();
});

it('triggers deleteContact/deletion of contact when delete button is clicked', async () => {
  const removeContact = vi.fn();
  const addNotification = vi.fn();
  const setModal = () => {};
  const client = { person: 'john' };
  const user = userEvent.setup();
  const { getByLabelText } = render(
    <NotificationContext.Provider value={{ addNotification }}>
      <DeleteContactModal
        showDeleteContactModal
        setShowDeleteContactModal={setModal}
        selectedContactToDelete={client}
        deleteContact={removeContact}
      />
    </NotificationContext.Provider>
  );

  const deleteButton = getByLabelText('Delete Contact Button');

  await user.click(deleteButton);
  expect(removeContact).toBeCalledWith(client);
});

it('closes without an action when cancel button is clicked', async () => {
  const removeContact = vi.fn();
  const client = { person: 'john' };
  const user = userEvent.setup();
  const ModalWrapper = () => {
    const [showModal, setShowModal] = useState(true);

    return (
      <DeleteContactModal
        showDeleteContactModal={showModal}
        setShowDeleteContactModal={setShowModal}
        selectedContactToDelete={client}
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
