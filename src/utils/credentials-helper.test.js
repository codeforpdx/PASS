import { expect, it, describe } from 'vitest';
import { webcrypto } from 'crypto';
import { buildThing, createThing, createSolidDataset, setThing } from '@inrupt/solid-client';
import { serializeDataSet, generateRsaSignature, validateSignature } from './credentials-helper';
import { RDF_PREDICATES } from '../constants';

describe('credentials', async () => {
  // Most of our tests should be in the JSDom browser environment
  // However, JSDom doesn't have a full implementation of Web Crypto
  // Node does, so we use node's implementation for these test
  window.crypto = webcrypto;

  const { privateKey, publicKey } = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-PSS',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['sign', 'verify']
  );

  const document = '<#document> <http://schema.org/name> "tim".';

  const b642ab = (base64String) =>
    Uint8Array.from(window.atob(base64String), (c) => c.charCodeAt(0));

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

  describe('generateRsaSignature', () => {
    it('generates valid RSA signature for a document', async () => {
      const hash = await generateRsaSignature(privateKey, document);

      const verification = await window.crypto.subtle.verify(
        {
          name: 'RSA-PSS',
          saltLength: 32
        },
        publicKey,
        b642ab(hash),
        new TextEncoder().encode(document)
      );
      expect(verification).toBe(true);
    });
  });

  describe('validateSignature', () => {
    it('returns true when passed a valid signature', async () => {
      const hash = await generateRsaSignature(privateKey, document);
      expect(await validateSignature(publicKey, hash, document)).toBe(true);
    });

    it('returns false when passed an invalid signature', async () => {
      expect(await validateSignature(publicKey, 'invalid hash', document)).toBe(false);
    });

    it('returns false when validating the signature for a different document', async () => {
      const hash = await generateRsaSignature(privateKey, document);
      expect(await validateSignature(publicKey, hash, 'new document')).toBe(false);
    });
  });
});
