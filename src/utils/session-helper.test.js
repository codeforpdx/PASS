import { createResourceTtlFile } from "./session-helper";
import { UPLOAD_TYPES } from "../constants";

test('Test Basic Resource TTL Creation Format', async () => {
    const documentUrl = 'http://example.com';
    const file = jest.fn();

    const fileObjectMock = {
        type: UPLOAD_TYPES.SELF,
        description: "random description here",
        date: "random date",
        file: {
            name: "file name",
            file: {}
        }
    };

    jest.spyOn(fileObjectMock.file.file, 'text').mockResolvedValue("REAL TEST DATA");

    const ttl = await createResourceTtlFile(file_mock, documentUrl)

    expect(ttl).toBe(5);
})