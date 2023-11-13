import {
  getDate,
  getInteger,
  getStringNoLocale,
  getThing,
  buildThing,
  createThing
} from '@inrupt/solid-client';
import { RDF_PREDICATES } from '@constants';
import useSession from './useSession';
import useRdfCollection from './useRdfCollection';

const prefix = 'urn:hud:hmis:owl#';

const civicProfileConfig = {
  legalFirstName: {
    type: 'string',
    predicate: 'urn:hud:hmis:owl#FirstName'
  },
  legalLastName: {
    type: 'string',
    predicate: 'urn:hud:hmis:owl#LastName'
  },
  legalDOB: {
    type: 'date',
    predicate: 'urn:hud:hmis:owl#DOB'
  },
  legalGender: {
    type: 'number',
    predicate: 'urn:hud:hmis:owl#Gender'
  },
  lastPermanentCity: {
    type: 'string',
    predicate: `${prefix}LastPermanentCity`
  },
  lastPermanentState: {
    type: 'string',
    predicate: `${prefix}LastPermanentState`
  },
  lastPermanentStreet: {
    type: 'string',
    predicate: `${prefix}LastPermanentStreet`
  },
  lastPermanentZIP: {
    type: 'string',
    predicate: `${prefix}LastPermanentZIP`
  },
  monthsHomeless: {
    type: 'number',
    predicate: `${prefix}MonthsHomelessPast3Years`
  },
  timesHomeless: {
    type: 'number',
    predicate: `${prefix}TimesHomelessPast3Years`
  },
  timeToHousingLoss: {
    type: 'number',
    predicate: `${prefix}TimeToHousingLoss`
  }
};

const convertDataToThing = (data, thingName, config) => {
  let thingInProgress = buildThing(createThing({ name: thingName }));
  Object.keys(data).forEach((key) => {
    const definition = config[key];
    if (!definition) return;
    try {
      switch (definition.type) {
        case 'number':
          thingInProgress = thingInProgress.addInteger(definition.predicate, data[key]);
          break;
        case 'date':
          thingInProgress = thingInProgress.addDate(definition.predicate, data[key]);
          break;
        default:
          thingInProgress = thingInProgress.addStringNoLocale(definition.predicate, data[key]);
      }
      // eslint-disable-next-line no-empty
    } catch {}
  });
  return thingInProgress.build();
};

const useCivicProfile = () => {
  const { session, podUrl } = useSession();
  const { fetch } = session;
  const fileUrl = podUrl && new URL('PASS/Profile/civic_profile.ttl', podUrl).toString();

  const serialize = (data) => convertDataToThing(data, 'Civic Profile', civicProfileConfig);

  const parse = (data) => {
    const url = new URL(fileUrl);
    url.hash = 'Civic Profile';
    const profileThing = getThing(data, url.toString());
    if (profileThing === null) {
      return {};
    }
    const profile = {};
    profile.firstName = getStringNoLocale(profileThing, RDF_PREDICATES.legalFirstName);
    profile.lastName = getStringNoLocale(profileThing, RDF_PREDICATES.legalLastName);
    profile.dateOfBirth = getDate(profileThing, RDF_PREDICATES.legalDOB);
    profile.gender = getInteger(profileThing, RDF_PREDICATES.legalGender);
    profile.lastPermanentCity = getStringNoLocale(profileThing, RDF_PREDICATES.lastPermanentCity);
    profile.lastPermanentState = getStringNoLocale(profileThing, RDF_PREDICATES.lastPermanentState);
    profile.lastPermanentStreet = getStringNoLocale(
      profileThing,
      RDF_PREDICATES.lastPermanentStreet
    );
    profile.lastPermanentZIP = getStringNoLocale(profileThing, RDF_PREDICATES.lastPermanentZIP);
    profile.monthsHomeless = getInteger(profileThing, RDF_PREDICATES.monthsHomeless);
    profile.timesHomeless = getInteger(profileThing, RDF_PREDICATES.timesHomeless);
    profile.timeToHousingLoss = getInteger(profileThing, RDF_PREDICATES.timeToHousingLoss);
    return profile;
  };

  return useRdfCollection(parse, serialize, fileUrl, fetch);
};

export default useCivicProfile;
