import type { DicomClient } from "..";
import { InstanceIdentifyers } from "../types";

export async function getInstanceMetadata(
  this: DicomClient,
  { studyUID, seriesUID, instanceUID }: InstanceIdentifyers
): Promise<InstanceIdentifyers> {
  const response = await this._fetchFunction(
    `/dicom-web/studies/${studyUID}/series/${seriesUID}/instances/${instanceUID}/metadata`
  );
  //should return json array with exactly one object
  const jsonRes = await response.json();
  if (!(jsonRes instanceof Array && jsonRes.length === 1)) {
    //try getting error
    if (jsonRes.error) throw new Error(jsonRes.error);
    throw new Error(
      "expected array of exactly one json object to be retuned for instance metadata"
    );
  }
  const instanceMetadata = jsonRes[0];
  return { ...instanceMetadata, studyUID, seriesUID, instanceUID };
}
