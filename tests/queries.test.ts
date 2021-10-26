import { client } from "./testSetup";
import nodeFetch from "node-fetch";
//tests will be run in node environment, so need to mock node-fetch
jest.mock("node-fetch");

const mockedFetch = nodeFetch as jest.MockedFunction<typeof nodeFetch>;

mockedFetch.mockResolvedValue({ ok: true, json: async () => [] } as any);

describe("query fn tests", () => {
  it("queries studies", async () => {
    expect(client).toBeDefined();
    await client.getUserStudies();
    const calls = mockedFetch.mock.calls;
    expect(calls.length).toBe(1);
    const call = calls[0];
    expect(call[0]).toBe("http://localhost:8042/dicom-web/studies");
    expect(call[1]).toEqual({ method: "GET", headers: {} });
    console.log(calls[0]);
  });
});
