import { SCHEMA_INRUPT, FOAF } from '@inrupt/vocab-common-rdf';
import HMIS_ONTOLOGY_VALUES from './HMIS_ONTOLOGY_VALUES';

const RDF_PREDICATES = {
  ...SCHEMA_INRUPT,
  ...HMIS_ONTOLOGY_VALUES,
  about: 'https://schema.org/about',
  uploadDate: 'https://schema.org/uploadDate',
  dateOfBirth:
    'https://github.com/hmis-interop/logical-model/blob/FY2022-v1.0.0/src/logical-model.n3.owl#DOB',
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
  sha256: 'https://schema.org/sha256',
  accountablePerson: 'https://schema.org/accountablePerson',
  profileName: FOAF.name,
  profileImg: FOAF.img,
  nickname: FOAF.nick,
  dateCreated: 'https://schema.org/dateCreated',
  propertyValue: 'https://schema.org/PropertyValue',
  value: 'https://schema.org/value',
  role: 'https://schema.org/roleName',
  status: 'https://schema.org/status'
};

export default RDF_PREDICATES;
