import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ContactListTable } from '@components/Contacts';

/* eslint-disable react/jsx-no-constructed-context-values */
const MockTableComponent = ({ contacts }) => (
  <BrowserRouter>
    <ContactListTable contacts={contacts} />
  </BrowserRouter>
);
/* eslint-enable react/jsx-no-constructed-context-values */

it('renders all clients from client context', () => {
  const contacts = [
    { familyName: 'Abby', person: 'Aaron Abby', webId: 'https://example.com/Abby' },
    { familyName: 'Builder', person: 'Bob Builder', webId: 'https://example.com/Builder' }
  ];

  const { getAllByRole } = render(<MockTableComponent contacts={contacts} />);

  const allRows = getAllByRole('row');

  // Expect 3 rows: the header, Abby's row, Builder's Row
  expect(allRows.length).toBe(3);

  const row1 = allRows[1];
  const row2 = allRows[2];

  expect(row1.cells.item(0).innerHTML).toContain('Aaron Abby');
  expect(row2.cells.item(0).innerHTML).toContain('Bob Builder');
});

it('sorts clients by familyName', () => {
  const originalArray = [
    { familyName: 'Zeigler', person: 'Aaron Zeigler', webId: 'https://example.com/Zeigler' },
    { familyName: 'Builder', person: 'Bob Builder', webId: 'https://example.com/Builder' }
  ];

  const { getByText } = render(<MockTableComponent contacts={[...originalArray]} />);

  const client1 = getByText('Aaron Zeigler');
  const client2 = getByText('Bob Builder');

  expect(client1.compareDocumentPosition(client2)).toBe(2);
});
