import type { DicomClient } from "..";

export async function getSeriesMetadata(
  this: DicomClient,
  studyUID: string,
  seriesUID: string
): Promise<{ instanceUID: string }[]> {
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
  jsonRes.forEach((e) => {
    if (
      !(
        e["00080018"] &&
        e["00080018"]["Value"] instanceof Array &&
        e["00080018"]["Value"].length === 1
      )
    )
      throw new Error(
        "not a valid dicom study response " + JSON.stringify(e, null, 2)
      );
  });
  const dicomStudyResponse = jsonRes.map((e) => ({
    ...e,
    instanceUID: e["00080018"]["Value"][0],
  }));
  return dicomStudyResponse;
}
