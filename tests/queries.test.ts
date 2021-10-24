import { client } from "./testSetup";
import nodeFetch from "node-fetch";
//tests will be run in node environment, so need to mock node-fetch
jest.mock("node-fetch");

const mockedFetch = nodeFetch as jest.MockedFunction<typeof nodeFetch>;

mockedFetch.mockResolvedValue({ ok: true, json: async () => [] } as any);

// const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

it("creates client", async () => {
  expect(client).toBeDefined();
  const res = await client.getUserStudys();
  console.log(res);
});
