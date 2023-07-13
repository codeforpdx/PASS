
import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ClientListTable } from '../../../src/components/Clients/ClientListTable'
import { UserListContext } from '../../../src/contexts';

it('renders all clients from client context', () => {
  const users = [
    {familyName: "Abby", givenName: "Aaron", webId: "https://example.com"},
    {familyName: "Builder", givenName: "Bob", webId: "https://example.com"}
  ];

  const component = <UserListContext.Provider value={{userListObject: {userList: users}}}>
    <ClientListTable />
  </UserListContext.Provider>

  const { queryAllByTestId } = render(
    component
  );

  const rows = queryAllByTestId("clientTableRow");

  expect(rows.length).toBe(2);
});
