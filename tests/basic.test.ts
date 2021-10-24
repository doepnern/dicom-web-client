import { DicomClient } from "..";
import { FetchFunctionType } from "../config";

it("dicomClient exists and fetch function can be replaced", () => {
  const client = new DicomClient();

  expect(client._fetchFunction).toBeDefined();
  const newFetch: FetchFunctionType = async (_a, _b, _c) => {
    return "test" as any;
  };
  client.setFetchFunction(newFetch);
  expect(client._fetchFunction).toBe(newFetch);
});

it("uses auth header if it is defined", async () => {});
