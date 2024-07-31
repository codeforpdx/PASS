// import React from 'react';
// import { BrowserRouter } from 'react-router-dom';
// import { render } from '@testing-library/react';
// import { expect, it } from 'vitest';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import ContactListTableDesktop from '../../../src/components/Contacts/ContactListTableDesktop';

// // Clear created DOM after each test
// afterEach(() => {
//   cleanup();
// });

// const queryClient = new QueryClient();

// const MockTableComponent = ({
// deleteContact,
// editContact,
// handleSendMessage,
// 'data-testid': dataTestId }) => {
//   window.matchMedia = createMatchMedia(isSmallScreen ? 500 : 1200);

//   return render(
//     <QueryClientProvider client={queryClient}>
//       <SessionContext.Provider>
//         <BrowserRouter>
//           <ContactListTableDesktop
//           />
//         </BrowserRouter>
//       </SessionContext.Provider>
//     </QueryClientProvider>
//   );
// };

// const contacts = [
//   {
//     familyName: 'Abby',
//     givenName: 'Aaron',
//     person: 'Aaron Abby',
//     webId: 'https://example.com/Abby'
//   },
//   {
//     familyName: 'Builder',
//     givenName: 'Bob',
//     person: 'Bob Builder',
//     webId: 'https://example.com/Builder'
//   }
// ];
