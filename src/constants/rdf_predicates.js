import { SCHEMA_INRUPT } from '@inrupt/vocab-common-rdf';

const RDF_PREDICATES = {
  ...SCHEMA_INRUPT,
  uploadDate: 'https://schema.org/uploadDate',
  title: 'https://schema.org/title',
  message: 'https://schema.org/Message',
  recipient: 'https://schema.org/recipient',
  sender: 'https://schema.org/sender'
};

export default RDF_PREDICATES;
