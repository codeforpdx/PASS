import React, { useState } from 'react';
import { render, cleanup, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi, afterEach } from 'vitest';
import { DeleteDocumentModal } from '../../../src/components/Modals';
import { DocumentListContext } from '../../../src/contexts';

// clear created dom after each test, to start fresh for next
afterEach(() => {
  cleanup();
});

it('renders/mounts when showDeleteDocumentModal is true', () => {
  const removeDocument = vi.fn();
  const setModal = () => {};
  const document = { name: 'passport.pdf' };
  const { queryByLabelText } = render(
    <DocumentListContext.Provider value={{ removeDocument }}>
      <DeleteDocumentModal
        showDeleteDocumentModal
        setShowDeleteDocumentModal={setModal}
        selectedDocumentToDelete={document}
      />
    </DocumentListContext.Provider>
  );

  const deleteButton = queryByLabelText('Delete Document Button');
  const cancelButton = queryByLabelText('Cancel Button');

  expect(deleteButton).not.toBeNull();
  expect(cancelButton).not.toBeNull();
});

it('hides/unmounts when showDeleteDocumentModal is false', () => {
  const removeDocument = vi.fn();
  const setModal = () => {};
  const document = { name: 'passport.pdf' };
  const { queryByLabelText } = render(
    <DocumentListContext.Provider value={{ removeDocument }}>
      <DeleteDocumentModal
        setShowDeleteDocumentModal={setModal}
        selectedDocumentToDelete={document}
      />
    </DocumentListContext.Provider>
  );

  const deleteButton = queryByLabelText('Delete Document Button');
  const cancelButton = queryByLabelText('Cancel Button');

  expect(deleteButton).toBeNull();
  expect(cancelButton).toBeNull();
});

it('triggers removeDocument/deletion of document when delete button is clicked', async () => {
  const removeDocument = vi.fn();
  const setModal = () => {};
  const document = { name: 'passport.pdf' };
  const user = userEvent.setup();
  const { getByLabelText } = render(
    <DocumentListContext.Provider value={{ removeDocument }}>
      <DeleteDocumentModal
        showDeleteDocumentModal
        setShowDeleteDocumentModal={setModal}
        selectedDocumentToDelete={document}
      />
    </DocumentListContext.Provider>
  );

  const deleteButton = getByLabelText('Delete Document Button');

  await user.click(deleteButton);
  expect(removeDocument).toBeCalledWith(document.name);
});

it('closes without an action when cancel button is clicked', async () => {
  const removeDocument = vi.fn();
  const document = { name: 'passport.pdf' };
  const user = userEvent.setup();
  const ModalWrapper = () => {
    const [showModal, setShowModal] = useState(true);

    return (
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      <DocumentListContext.Provider value={{ removeDocument }}>
        <DeleteDocumentModal
          showDeleteDocumentModal={showModal}
          setShowDeleteDocumentModal={setShowModal}
          selectedDocumentToDelete={document}
        />
      </DocumentListContext.Provider>
    );
  };

  const { queryByLabelText } = render(<ModalWrapper />);

  const cancelButton = queryByLabelText('Cancel Button');

  await user.click(cancelButton);
  await waitForElementToBeRemoved(() => queryByLabelText('Cancel Button'));
  const hiddenCancelButton = queryByLabelText('Cancel Button');
  expect(hiddenCancelButton).toBeNull();
  expect(removeDocument).not.toBeCalled();
});
