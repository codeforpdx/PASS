import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ContactListTable } from '@components/Contacts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const MockTableComponent = ({ contacts }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ContactListTable contacts={contacts} />
    </BrowserRouter>
  </QueryClientProvider>
);

it('renders all clients from client context', () => {
  const contacts = [
    {
      familyName: 'Abby',
      givenName: 'Aaron',
      person: 'Aaron Abby',
      webId: 'https://example.com/Abby'
    },
    {
      familyName: 'Builder',
      givenName: 'Bob',
      person: 'Bob Builder',
      webId: 'https://example.com/Builder'
    }
  ];

  const { getAllByRole, queryByRole } = render(<MockTableComponent contacts={contacts} />);

  const allRows = getAllByRole('row');

  // Expect 3 rows: the header, Abby's row, Builder's Row
  expect(allRows.length).toBe(3);

  const row1GivenName = queryByRole('cell', { name: 'Aaron' });
  const row1FamilyName = queryByRole('cell', { name: 'Abby' });

  const row2GivenName = queryByRole('cell', { name: 'Bob' });
  const row2FamilyName = queryByRole('cell', { name: 'Builder' });

  expect(row1GivenName).not.toBeNull();
  expect(row1FamilyName).not.toBeNull();
  expect(row2GivenName).not.toBeNull();
  expect(row2FamilyName).not.toBeNull();
});

it('sorts clients by familyName', () => {
  const originalArray = [
    {
      familyName: 'Zeigler',
      givenName: 'Aaron',
      person: 'Aaron Zeigler',
      webId: 'https://example.com/Zeigler'
    },
    {
      familyName: 'Builder',
      givenName: 'Bob',
      person: 'Bob Builder',
      webId: 'https://example.com/Builder'
    }
  ];

  const { getByRole } = render(<MockTableComponent contacts={[...originalArray]} />);

  const client1 = getByRole('cell', { name: 'Zeigler' });
  const client2 = getByRole('cell', { name: 'Builder' });

  expect(client1.compareDocumentPosition(client2)).toBe(Node.DOCUMENT_POSITION_PRECEDING);
});
