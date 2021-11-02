import { INSTANCE_TAGS } from "../../tags";
import { DicomGeneralResponse } from "../DicomResponse";
import { getTag } from "../util";

type DicomInstanceKeys = {
  -readonly [Property in keyof typeof INSTANCE_TAGS]: typeof INSTANCE_TAGS[Property]["vr"] extends "number"
    ? number
    : string;
};

interface DicomInstanceResponseInterface extends DicomInstanceKeys {}

export class DicomInstanceResponse
  extends DicomGeneralResponse
  implements DicomInstanceResponseInterface
{
  //general
  studyUID: string;
  seriesUID: string;
  //tags
  Columns: number;
  InstanceAvailability: string;
  InstanceNumber: number;
  RetrieveURL: string;
  Rows: number;
  SOPClassUID: string;
  SOPInstanceUID: string;
  TimezoneOffsetFromUTC: string;
  constructor(obj: unknown, studyUID, seriesUID) {
    super(obj);

    this.studyUID = studyUID;
    this.seriesUID = seriesUID;

    this.Columns = getTag(obj, INSTANCE_TAGS["Columns"]);
    this.InstanceAvailability = getTag(
      obj,
      INSTANCE_TAGS["InstanceAvailability"]
    );
    this.InstanceNumber = getTag(obj, INSTANCE_TAGS["InstanceNumber"]);
    this.RetrieveURL = getTag(obj, INSTANCE_TAGS["RetrieveURL"]);
    this.Rows = getTag(obj, INSTANCE_TAGS["Rows"]);
    this.SOPClassUID = getTag(obj, INSTANCE_TAGS["SOPClassUID"]);
    this.SOPInstanceUID = getTag(obj, INSTANCE_TAGS["SOPInstanceUID"]);
    this.TimezoneOffsetFromUTC = getTag(
      obj,
      INSTANCE_TAGS["TimezoneOffsetFromUTC"]
    );
  }
}
