import { FetchFunctionType, getFetchFunction } from "./config";
import { getUserStudys } from "./queries/study.queries";
import { getSeriesInStudy } from "./queries/studyMetadata.queries";
import { getSeriesMetadata } from "./queries/series.queries";
import { getInstanceMetadata } from "./queries/instance.queries";

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
  getUserStudys = getUserStudys;
  getSeriesInStudy = getSeriesInStudy;

  //Series level
  getSeriesMetadata = getSeriesMetadata;

  //Instance level
  getInstanceMetadata = getInstanceMetadata;
}

export { DicomClient };
