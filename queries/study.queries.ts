import type { DicomClient } from "..";
import { DicomStudyResponse } from "../models/Study";

//returns studys of currently authenticated user
export async function getUserStudies(
  this: DicomClient
): Promise<DicomStudyResponse[]> {
  const response = await this._fetchFunction(`dicom-web/studies`);
  const jsonRes: unknown = await response.json();
  if (!(jsonRes instanceof Array))
    throw new Error("response was not a valid array");
  const dicomRes = jsonRes.map((e) => new DicomStudyResponse(e));
  return dicomRes;
}
