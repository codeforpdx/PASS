import { SCHEMA_INRUPT } from '@inrupt/vocab-common-rdf';

const RDF_PREDICATES = {
  ...SCHEMA_INRUPT,
  uploadDate: 'https://schema.org/uploadDate',
  dateOfBirth: 'https://schema.org/birthDate',
  additionalType: 'https://schema.org/additionalType',
  conditionsOfAccess: 'https://schema.org/conditionsOfAccess',
  expires: 'https://schema.org/expires',
  dateIssued: 'https://schema.org/dateIssued',
  gender: 'https://schema.org/gender',
  Eye: 'https://schema.org/Eye',
  height: 'https://schema.org/height',
  streetAdress: 'https://schema.org/streetAddress',
  City: 'https://schema.org/City',
  State: 'https://schema.org/State',
  postalCode: 'https://schema.org/postalCode',
  Country: 'https://schema.org/Country',
  additionalName: 'https://schema.org/additionalName'
};

export default RDF_PREDICATES;
