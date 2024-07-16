import React from 'react';
import DocumentCard from './DocumentCard';

const DocumentsMobile = ({ documents, handlers }) =>
  documents.map((document) => (
    <DocumentCard
      key={document.name}
      document={document}
      onShare={() => handlers.onShare('document', document.name, document.type)}
      onDelete={() => handlers.onDelete(document)}
      onPreview={() => handlers.onPreview(document.fileUrl)}
    />
  ));

export default DocumentsMobile;
