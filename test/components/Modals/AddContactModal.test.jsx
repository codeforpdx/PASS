import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { AddContactModal } from '@components/Modals';
import createMatchMedia from '../../helpers/createMatchMedia';

const MockAddContactModal = () => <AddContactModal showAddContactModal />;

it('renders button container flex-direction row default', () => {
  const { getByRole } = render(<MockAddContactModal />);
  const cancelButton = getByRole('button', { name: 'Cancel' });
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('row');
});

it('renders button container flex-direction column mobile', () => {
  window.matchMedia = createMatchMedia(599);
  const { getByRole } = render(<MockAddContactModal />);
  const cancelButton = getByRole('button', { name: 'Cancel' });
  const buttonContainer = cancelButton.parentElement;
  const cssProperty = getComputedStyle(buttonContainer);

  expect(cssProperty.flexDirection).toBe('column');
});

it('will submit data only after deleting leading and trailing spaces from each field', async () => {
  const user = userEvent.setup(() => new Promise());

  // Mocks required so it won't crash from undefined imports
  vi.mock('@hooks/useNotification', async (importOriginal) => {
    const mod = await importOriginal();
    return {
      ...mod,
      default: vi.fn(() => ({ addNotification: vi.fn() }))
    };
  });

  vi.spyOn(Storage.prototype, 'setItem');
  const setItemSpy = vi.fn();
  Storage.prototype.setItem = setItemSpy;
  vi.spyOn(Storage.prototype, 'getItem');
  const getItemSpy = vi.fn(() => 'http://www.oidcIssuer.com');
  Storage.prototype.getItem = getItemSpy;

  const inputData = {
    givenName: 'given  ',
    familyName: '  family',
    username: '  username  '
  };

  const mockAdd = vi.fn();

  render(
    <AddContactModal setShowAddContactModal={() => {}} showAddContactModal addContact={mockAdd} />
  );

  const givenName = screen.getByRole('textbox', { name: 'First/given name' });
  const familyName = screen.getByRole('textbox', { name: 'Last/family name' });
  const username = screen.getByRole('textbox', { name: 'Username' });
  const submitButton = screen.getByRole('button', { name: 'Add Contact' });

  await user.type(givenName, inputData.givenName);
  await user.type(familyName, inputData.familyName);
  await user.type(username, inputData.username);

  expect(givenName.value).toBe(inputData.givenName);
  expect(familyName.value).toBe(inputData.familyName);
  expect(username.value).toBe(inputData.username);

  await user.click(submitButton);

  expect(mockAdd).toHaveBeenCalled();
  const userObject = mockAdd.mock.calls[0][0];
  // Should be the input data without leading or trailing whitespace
  expect(userObject).toMatchObject({
    givenName: inputData.givenName.trim(),
    familyName: inputData.familyName.trim(),
    webId: expect.stringContaining(inputData.username.trim())
  });
});
