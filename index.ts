import { FetchFunctionType, getFetchFunction } from "./config";
import {
  getUserStudies,
  getInstanceMetadata,
  getSeriesInStudy,
  getSeriesMetadata,
} from "./queries";

type DicomClientOptions = {
  auth?: string;
  baseURL?: string;
};

class DicomClient {
  _fetchFunction: FetchFunctionType;
  //if auth is set, the default fetch function will add it in the Authorization header
  _auth: string | null;
  //should be set when operating in node environment, in browser environment optional
  _baseURL: string | null;

  constructor({ auth, baseURL }: DicomClientOptions = {}) {
    this._fetchFunction = getFetchFunction();
    this._auth = auth ?? null;
    this._baseURL = baseURL;
  }

  setFetchFunction(fetchFn: FetchFunctionType) {
    this._fetchFunction = fetchFn;
  }

  // Study level
  getUserStudies = getUserStudies;

  //Series level
  getSeriesInStudy = getSeriesInStudy;

  //Instance level
  getInstancesInSeries = getSeriesMetadata;
  getInstanceMetadata = getInstanceMetadata;
}

export { DicomClient };
export * from "./models";
export * from "./queries";
