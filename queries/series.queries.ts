import { DicomClient, DicomInstanceResponse } from "..";

export async function getSeriesMetadata(
  this: DicomClient,
  studyUID: string,
  seriesUID: string
): Promise<DicomInstanceResponse[]> {
  if (seriesUID === "" || studyUID === "") return [];
  const response = await this._fetchFunction(
    `/dicom-web/studies/${studyUID}/series/${seriesUID}/metadata`
  );
  const jsonRes = await response.json();
  if (!(jsonRes instanceof Array)) {
    //try getting error
    if (jsonRes.error) throw new Error(jsonRes.error);
    throw new Error("expected array of json to be retuned");
  }

  //validate results
  const intances = jsonRes.map(
    (e) => new DicomInstanceResponse(e, studyUID, seriesUID)
  );
  return intances;
}
