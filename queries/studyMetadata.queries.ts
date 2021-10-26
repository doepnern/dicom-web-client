import { DicomClient } from "..";
import { DicomSeriesResponse } from "../models";

export async function getSeriesInStudy(this: DicomClient, studyId: string) {
  const response = await this._fetchFunction(
    `/dicom-web/studies/${studyId}/series`
  );
  const jsonRes = await response.json();
  if (!(jsonRes instanceof Array)) {
    //try getting error
    if (jsonRes.error) throw new Error(jsonRes.error);
    throw new Error("expected array of json to be retuned");
  }

  const dicomResPromise = jsonRes.map(
    (e) => new DicomSeriesResponse(e, studyId, this)
  );
  const dicomRes = await Promise.all(dicomResPromise);

  return dicomRes;
}
