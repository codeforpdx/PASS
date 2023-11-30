const prefix = 'urn:hud:hmis:owl#';

const HMIS_ONTOLOGY_VALUES = {
  legalFirstName: `${prefix}FirstName`,
  legalLastName: `${prefix}LastName`,
  legalDOB: `${prefix}DOB`,
  legalGender: `${prefix}Gender`,
  lastPermanentCity: `${prefix}LastPermanentCity`,
  lastPermanentState: `${prefix}LastPermanentState`,
  lastPermanentStreet: `${prefix}LastPermanentStreet`,
  lastPermanentZIP: `${prefix}LastPermanentZIP`,
  monthsHomeless: `${prefix}MonthsHomelessPast3Years`,
  timesHomeless: `${prefix}TimesHomelessPast3Years`,
  timeToHousingLoss: `${prefix}TimeToHousingLoss`
};

export default HMIS_ONTOLOGY_VALUES;
