const prefix = 'urn:hud:hmis:owl#';

const HMIS_ONTOLOGY_VALUES = {
  legalFirstName: 'urn:hud:hmis:owl#FirstName',
  legalLastName: 'urn:hud:hmis:owl#LastName',
  legalDOB: 'urn:hud:hmis:owl#DOB',
  legalGender: 'urn:hud:hmis:owl#Gender',
  lastPermanentCity: `${prefix}LastPermanentCity`,
  lastPermanentState: `${prefix}LastPermanentState`,
  lastPermanentStreet: `${prefix}LastPermanentStreet`,
  lastPermanentZIP: `${prefix}LastPermanentZIP`,
  monthsHomeless: `${prefix}MonthsHomelessPast3Years`,
  timesHomeless: `${prefix}TimesHomelessPast3Years`,
  timeToHousingLoss: `${prefix}TimeToHousingLoss`
};

export default HMIS_ONTOLOGY_VALUES;
