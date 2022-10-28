import { DicomClient } from ".";

export type FetchFunctionType = (
  url: string,
  options?: RequestInit,
  changedHeaders?: HeadersInit
) => Promise<Response>;

//own fetch implementation which rejects on non 2xx status, pass Authorization object to changedHeaders
const basicFetch: FetchFunctionType = async function _basicFetch(
  this: DicomClient,
  url,
  options = {},
  changedHeaders = {}
) {
  const authHeader: { Authorization: "string" } | {} = this._auth
    ? { Authorization: this._auth }
    : {};
  const headers = new Headers({ ...authHeader, ...changedHeaders });
  const targetUrl = this._baseURL ? this._baseURL + url : url;
  const request = new Request(targetUrl, {
    method: "GET",
    headers: headers,
    mode: "cors",
    cache: "default",
    ...options,
  });

  const response = await fetch(request);
  if (!response.ok)
    throw new Error(
      "Error making request to backend, status: " + response.status
    );
  return response;
};

const basicNodeFetch = (customFetchFunction): FetchFunctionType => {
  if (!customFetchFunction)
    throw new Error("customFetchFunction is required in node environment");
  return async function _basicNodeFetch(
    this: DicomClient,
    url,
    _options = {},
    changedHeaders = {}
  ) {
    if (!this._baseURL)
      throw new Error(
        "Base URL should be defined when using in node environment"
      );

    if (!customFetchFunction) {
      throw new Error(
        "please set fetch function when using in node environment"
      );
    }
    const authHeader: { Authorization: "string" } | {} = this._auth
      ? { Authorization: this._auth }
      : {};
    const headers = { ...authHeader, ...changedHeaders };
    const response = await customFetchFunction(this._baseURL + url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok)
      throw new Error(
        "Error making request to backend, status: " + response.status
      );
    return response as any as Response;

    // formData: async () => {
    //   throw new Error("Not available in node mode");
    // },
    // clone: async () => {
    //   throw new Error("Not available in node mode");
    // },
    // arrayBuffer: async () => {
    //   throw new Error("Not available in node mode");
    // },
    // blob: async () => {
    //   throw new Error("Not available in node mode");
    // },
    // json: async () => {
    //   throw new Error("Not available in node mode");
    // },
    // text: async () => {
    //   throw new Error("Not available in node mode");
    // },
  };
};

export function getFetchFunction(customFetchFunction?: any) {
  // console.log(global.fetch);
  if (global.fetch) return basicFetch;
  return basicNodeFetch(customFetchFunction);
}
