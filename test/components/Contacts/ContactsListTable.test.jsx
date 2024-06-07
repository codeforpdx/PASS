import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
// import { SessionContext } from '@contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContactListTable } from '@components/Contacts';
import createMatchMedia from '../../helpers/createMatchMedia';

afterEach(() => {
  cleanup();
});

const queryClient = new QueryClient();

const MockTableComponent = ({ contacts }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ContactListTable contacts={contacts} />
    </BrowserRouter>
  </QueryClientProvider>
);

// const { getByRole } = render(
//   <QueryClientProvider client={queryClient}>
//     <SessionContext.Provider value={{ session: { info: { isLoggedIn: true } } }}>
//       <BrowserRouter>
//         <ContactListTable contacts={contacts} />
//       </BrowserRouter>
//     </SessionContext.Provider>
//   </QueryClientProvider>
// );

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

  it('renders ContactsListTable when user is logged in on larger screen device', () => {
    window.matchMedia = createMatchMedia(1200);
  });

  it('renders ContactsListTable when user is logged in on smaller screen device', () => {
    window.matchMedia = createMatchMedia(1200);
  });
});
