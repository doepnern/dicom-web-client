import type { DicomClient } from "..";
import {
  DicomStudyResponse,
  dicomStudyTagMapping,
  isDicomStudyResponse,
} from "../models/Study";
import { getTagValue } from "../models/util";

//returns studys of currently authenticated user
export async function getUserStudys(
  this: DicomClient
): Promise<DicomStudyResponse[]> {
  const response = await this._fetchFunction(`dicom-web/studies`);
  const jsonRes: unknown = await response.json();
  if (!(jsonRes instanceof Array))
    throw new Error("response was not a valid array");
  const dicomRes = jsonRes.map((e) => responseToDicomStudy(e));
  return dicomRes;
}

//trys to create dicom study from response, throws on invalid or missing value
function responseToDicomStudy(obj: unknown): DicomStudyResponse {
  const tags = Object.keys(dicomStudyTagMapping);
  const dicomStudy: Record<string, string | number> = {};
  for (const t of tags) {
    dicomStudy[dicomStudyTagMapping[t].name] = getTagValue(
      obj,
      t,
      dicomStudyTagMapping[t]
    );
  }
  if (!isDicomStudyResponse(dicomStudy))
    throw new Error("response was not a valid DIcomStudy response");
  return dicomStudy;
}
