import { expect, it, describe } from 'vitest';
import { buildThing, createThing, createSolidDataset, setThing } from '@inrupt/solid-client';
import { serializeDataSet } from './credentials-helper';
import { RDF_PREDICATES } from '../constants';

describe('serializeDataSet', () => {
  it('properly serializes things', async () => {
    const thing = buildThing(createThing({ name: 'document' }))
      .addStringNoLocale(RDF_PREDICATES.name, 'tim')
      .build();

    let newSolidDataset = createSolidDataset();
    newSolidDataset = setThing(newSolidDataset, thing);

    const expectedResult = '<#document> <http://schema.org/name> "tim".\n';

    const result = await serializeDataSet(newSolidDataset);

    expect(result).toBe(expectedResult);
  });
});
