import { createResourceTtlFile } from "./session-helper";
import { UPLOAD_TYPES } from "../constants";
import { assert, expect, vi, it, describe } from 'vitest'


describe("createResourceTtlFile", () => {
  it('Has proper number of fields', async () => {
      const documentUrl = 'http://example.com';
      const mockText = vi.fn().mockResolvedValue("TEST DATA");

      const fileObjectMock = {
          type: UPLOAD_TYPES.SELF,
          description: "random description here",
          date: "random date",
          file: {
              name: "file name",
              text: mockText
          }
      };

      const result = await createResourceTtlFile(fileObjectMock, documentUrl)
      expect(mockText).toBeCalledTimes(1);
      expect(Object.keys(result.predicates)).toHaveLength(7);
  });
});