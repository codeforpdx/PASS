import { expect, vi, it, describe } from 'vitest';
import { webcrypto } from 'crypto';
import { buildThing, createThing } from '@inrupt/solid-client';
import sha256 from 'crypto-js/sha256';
import { RDF_PREDICATES } from '../../src/constants';
import { makeDocIntoThing, parseDocFromThing } from '../../src/model-helpers/Document';

vi.mock('@inrupt/solid-client');

const fileText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget felis consectetur, condimentum nisl vel, feugiat augue. Suspendisse suscipit est a enim tincidunt, nec mollis leo convallis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus in metus elit. Curabitur congue, ipsum non varius aliquam, magna nibh venenatis urna, in facilisis magna turpis id risus. Pellentesque nibh neque, mattis eget consequat ac, dictum at magna. Cras in tempor arcu. In eget hendrerit nulla, vitae aliquet est. Phasellus in neque gravida, ultrices tortor hendrerit, congue mi. Sed in tristique mi, sed porta neque. Praesent et arcu tempus, pharetra nisl eu, congue ligula.';

describe('docDescToThing', () => {
  window.crypto = webcrypto;

  it('correctly converts a document description to a thing', async () => {
    const testFile = {
      text: vi.fn().mockResolvedValue(fileText)
    };
    const hash = sha256(fileText);
    const doc = {
      name: 'name',
      type: 'type',
      date: new Date('December 17, 1995'),
      description: 'description'
    };
    const thing = await makeDocIntoThing(doc, 'http://example.com', testFile);
    const newDoc = parseDocFromThing(thing);
    expect(newDoc).toMatchObject({
      name: 'name',
      checksum: hash,
      type: 'type',
      description: 'description'
    });
  });
});

describe('parseDocument', () => {
  it('correctly converts an input thing into a javascript object', () => {
    const hash = sha256(fileText);

    const doc = {
      name: 'name',
      type: 'type',
      date: new Date('December 17, 1995'),
      description: 'description'
    };

    const thing = buildThing(createThing({ name: doc.name }))
      .addDate(RDF_PREDICATES.uploadDate, new Date())
      .addStringNoLocale(RDF_PREDICATES.name, doc.name)
      .addStringNoLocale(RDF_PREDICATES.identifier, doc.type)
      .addDate(RDF_PREDICATES.endDate, doc.date)
      .addStringNoLocale(RDF_PREDICATES.sha256, hash)
      .addStringNoLocale(RDF_PREDICATES.description, doc.description)
      .addUrl(RDF_PREDICATES.url, 'http://example.com')
      .build();

    const newDoc = parseDocFromThing(thing);

    expect(newDoc).toMatchObject({
      checksum: hash,
      description: doc.description,
      name: doc.name,
      type: doc.type
    });
  });
});
