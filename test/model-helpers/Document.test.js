import { expect, vi, it, describe } from 'vitest';
import { buildThing, createThing } from '@inrupt/solid-client';
import dayjs from 'dayjs';
import { RDF_PREDICATES } from '../../src/constants';
import { makeDocIntoThing, parseDocFromThing } from '../../src/model-helpers/Document';

vi.mock('@inrupt/solid-client');

const fileText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget felis consectetur, condimentum nisl vel, feugiat augue. Suspendisse suscipit est a enim tincidunt, nec mollis leo convallis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus in metus elit. Curabitur congue, ipsum non varius aliquam, magna nibh venenatis urna, in facilisis magna turpis id risus. Pellentesque nibh neque, mattis eget consequat ac, dictum at magna. Cras in tempor arcu. In eget hendrerit nulla, vitae aliquet est. Phasellus in neque gravida, ultrices tortor hendrerit, congue mi. Sed in tristique mi, sed porta neque. Praesent et arcu tempus, pharetra nisl eu, congue ligula.';

describe('docDescToThing', () => {
  it('correctly converts a document description to a thing', async () => {
    const testFile = {
      text: vi.fn().mockResolvedValue(fileText),
      name: 'junk'
    };
    const doc = {
      name: 'name',
      type: 'type',
      date: dayjs('December 17, 1995').$d,
      description: 'description'
    };
    const thing = await makeDocIntoThing(doc, testFile);
    const newDoc = parseDocFromThing(thing);
    expect(newDoc).toMatchObject({
      name: 'name',
      type: 'type',
      description: 'description'
    });
  });
});

describe('parseDocument', () => {
  it('correctly converts an input thing into a javascript object', () => {
    const doc = {
      name: 'name',
      type: 'type',
      date: dayjs('December 17, 1995').$d,
      description: 'description'
    };

    const thing = buildThing(createThing({ name: doc.name }))
      .addDate(RDF_PREDICATES.uploadDate, dayjs().$d)
      .addStringNoLocale(RDF_PREDICATES.name, doc.name)
      .addStringNoLocale(RDF_PREDICATES.identifier, doc.type)
      .addDate(RDF_PREDICATES.endDate, doc.date)
      .addStringNoLocale(RDF_PREDICATES.description, doc.description)
      .addUrl(RDF_PREDICATES.url, 'http://example.com')
      .build();

    const newDoc = parseDocFromThing(thing);

    expect(newDoc).toMatchObject({
      description: doc.description,
      name: doc.name,
      type: doc.type
    });
  });
});
