import { FetchFunctionType, getFetchFunction } from "./config";
import {
  getUserStudies,
  getInstanceMetadata,
  getSeriesInStudy,
  getSeriesMetadata,
  uploadDicoms,
} from "./queries";
import { downloadStudy } from "./queries/study.queries";
import { uploadDicomsXMLHTTP } from "./queries/upload";

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
  downloadStudy = downloadStudy;

  //Instance level
  getInstancesInSeries = getSeriesMetadata;
  getInstanceMetadata = getInstanceMetadata;

  //upload (no regular endpoint)
  uploadDicoms = uploadDicoms;
  uploadDicomsXMLHTTP = uploadDicomsXMLHTTP;
}

export { DicomClient };
export * from "./models";
export * from "./queries";
