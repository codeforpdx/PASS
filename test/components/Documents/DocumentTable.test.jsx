import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import DocumentTable from '@components/Documents';

import { DocumentListContext } from '@contexts';

const mockedDocumentContext = {
  documentListObject: {
    docList: [
      {
        name: 'test.pdf',
        type: 'Other',
        description: 'test description',
        endDate: new Date(),
        uploadDate: new Date(),
        fileUrl: 'http://localhost:3000/pod/PASS/Documents/test.pdf'
      },
      {
        name: 'test2.pdf',
        type: 'Passport',
        description: 'test description 2',
        endDate: null,
        uploadDate: new Date(),
        fileUrl: 'http://localhost:3000/pod/PASS/Documents/test2.pdf'
      }
    ],
    dataset: {},
    containerURL: 'foo'
  },
  loadingDocuments: false
};

const MockTableComponent = () => (
  <BrowserRouter>
    <DocumentListContext.Provider value={mockedDocumentContext}>
      <DocumentTable />
    </DocumentListContext.Provider>
  </BrowserRouter>
);

describe('DocumentTable Component', () => {
  it('renders with documents', () => {
    const { getAllByRole, queryByRole } = render(<MockTableComponent />);
    const allRows = getAllByRole('row');
    expect(allRows.length).toBe(3);

    const row1FileName = queryByRole('cell', { name: 'test.pdf' });
    const row1FileType = queryByRole('cell', { name: 'Other' });
    const row1Description = queryByRole('cell', { name: 'test description' });
    const row2FileName = queryByRole('cell', { name: 'test2.pdf' });
    const row2FileType = queryByRole('cell', { name: 'Passport' });
    const row2Description = queryByRole('cell', { name: 'test description 2' });

    expect(row1FileName).not.toBeNull();
    expect(row1FileType).not.toBeNull();
    expect(row1Description).not.toBeNull();
    expect(row2FileName).not.toBeNull();
    expect(row2FileType).not.toBeNull();
    expect(row2Description).not.toBeNull();
  });
});
