import React from 'react';
import { Contacts } from '@pages';
import { expect, it, describe, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { useContactsList } from '@hooks';
import { BrowserRouter } from 'react-router-dom';

vi.mock('@hooks', async () => {
  const actual = await vi.importActual('@hooks');

  return {
    ...actual,
    useContactsList: vi.fn()
  };
});

describe('Contacts Page', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('displays Loading message while loading', () => {
    useContactsList.mockReturnValue({ isLoading: true });
    const { getByText } = render(<Contacts />);
    const button = getByText('Loading Contacts...');
    expect(button).not.toBeNull();
  });

  it('displays Errors when fetch errors', () => {
    useContactsList.mockReturnValue({ isError: true, error: { message: 'error' } });
    const { getByText } = render(<Contacts />);
    const text = getByText('Error loading contacts list: error');
    expect(text).not.toBeNull();
  });

  it('displays Contacts List Table when there are contacts', () => {
    const firstContact = {
      person: 'Peter Parker',
      familyName: 'Parker',
      givenName: 'Peter',
      webId: 'http://peter.com'
    };
    const secondContact = {
      person: 'Batman',
      familyName: 'Batman',
      givenName: 'Batman',
      webId: 'http://batman.com'
    };
    useContactsList.mockReturnValue({ data: [firstContact, secondContact] });
    const { getByRole } = render(
      <BrowserRouter>
        <Contacts />
      </BrowserRouter>
    );
    const contacts = getByRole('table');
    expect(contacts).not.toBeNull();
  });
  it('displays empty list message when there are no contacts', () => {
    useContactsList.mockReturnValue({ data: [] });
    const { getByLabelText } = render(<Contacts />);
    const contacts = getByLabelText('No Items Found Box');
    expect(contacts).not.toBeNull();
  });
});
