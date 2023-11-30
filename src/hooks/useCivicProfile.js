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

const civicProfileConfig = {
  firstName: {
    type: 'string',
    predicate: RDF_PREDICATES.legalFirstName
  },
  lastName: {
    type: 'string',
    predicate: RDF_PREDICATES.legalLastName
  },
  dateOfBirth: {
    type: 'date',
    predicate: RDF_PREDICATES.legalDOB
  },
  gender: {
    type: 'number',
    predicate: RDF_PREDICATES.legalGender
  },
  lastPermanentCity: {
    type: 'string',
    predicate: RDF_PREDICATES.lastPermanentCity
  },
  lastPermanentState: {
    type: 'string',
    predicate: RDF_PREDICATES.lastPermanentState
  },
  lastPermanentStreet: {
    type: 'string',
    predicate: RDF_PREDICATES.lastPermanentStreet
  },
  lastPermanentZIP: {
    type: 'string',
    predicate: RDF_PREDICATES.lastPermanentZIP
  },
  monthsHomeless: {
    type: 'number',
    predicate: RDF_PREDICATES.monthsHomeless
  },
  timesHomeless: {
    type: 'number',
    predicate: RDF_PREDICATES.timesHomeless
  },
  timeToHousingLoss: {
    type: 'number',
    predicate: RDF_PREDICATES.timeToHousingLoss
  }
};

const convertDataToThing = (data, thingName, config) => {
  let thingInProgress = buildThing(createThing({ name: thingName }));
  Object.keys(data).forEach((key) => {
    const definition = config[key];
    if (!definition) return;
    if (data[key] === null) return;
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
