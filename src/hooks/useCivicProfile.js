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

const useCivicProfile = () => {
  const { session, podUrl } = useSession();
  const { fetch } = session;
  const fileUrl = podUrl && new URL('PASS/Profile/civic_profile.ttl', podUrl).toString();

  const serialize = ({ firstName, lastName, dateOfBirth, gender, ...profile }) =>
    buildThing(createThing({ name: 'Civic Profile' }))
      .addStringNoLocale(RDF_PREDICATES.legalFirstName, firstName)
      .addStringNoLocale(RDF_PREDICATES.legalLastName, lastName)
      .addDate(RDF_PREDICATES.legalDOB, dateOfBirth)
      .addInteger(RDF_PREDICATES.legalGender, gender)
      .addStringNoLocale(RDF_PREDICATES.lastPermanentCity, profile.city)
      .addStringNoLocale(RDF_PREDICATES.lastPermanentStreet, profile.street)
      .addStringNoLocale(RDF_PREDICATES.lastPermanentState, profile.state)
      .addStringNoLocale(RDF_PREDICATES.lastPermanentZIP, profile.zip)
      .addStringNoLocale(RDF_PREDICATES.monthsHomeless, profile.monthsHomeless)
      .addStringNoLocale(RDF_PREDICATES.timesHomeless, profile.timesHomeless)
      .addStringNoLocale(RDF_PREDICATES.timeToHousingLoss, profile.timeToHousingLoss)
      .addStringNoLocale()
      .build();

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
    profile.city = getStringNoLocale(profileThing, RDF_PREDICATES.lastPermanentCity);
    profile.state = getStringNoLocale(profileThing, RDF_PREDICATES.lastPermanentState);
    profile.street = getStringNoLocale(profileThing, RDF_PREDICATES.lastPermanentStreet);
    profile.zip = getStringNoLocale(profileThing, RDF_PREDICATES.lastPermanentZIP);
    profile.monthsHomeless = getInteger(profileThing, RDF_PREDICATES.monthsHomeless);
    profile.timesHomeless = getInteger(profileThing, RDF_PREDICATES.timesHomeless);
    profile.timeToHousingLoss = getInteger(profileThing, RDF_PREDICATES.timeToHousingLoss);
    return profile;
  };

  return useRdfCollection(parse, serialize, fileUrl, fetch);
};

export default useCivicProfile;
