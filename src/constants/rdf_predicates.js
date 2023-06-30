import { SCHEMA_INRUPT, RDF, FOAF } from '@inrupt/vocab-common-rdf';

const RDF_PREDICATES = {
  ...SCHEMA_INRUPT,
  about: 'https://schema.org/about',
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
  additionalName: 'https://schema.org/additionalName',
  title: 'https://schema.org/title',
  message: 'https://schema.org/Message',
  recipient: 'https://schema.org/recipient',
  sender: 'https://schema.org/sender',
  profileName: 'http://xmlns.com/foaf/0.1/name',
  sha256: 'https://schema.org/sha256',
  accountablePerson: 'https://schema.org/accountablePerson',
  profileImg: FOAF.img,
  nickname: FOAF.nick,
  type: RDF.type
};

export default RDF_PREDICATES;
