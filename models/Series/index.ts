import { DicomClient } from "../..";
import { SERIES_TAGS } from "../../tags";
import { DicomGeneralResponse } from "../DicomResponse";
import { getTag } from "../util";

type DicomSeriesKeys = {
  -readonly [Property in keyof typeof SERIES_TAGS]: typeof SERIES_TAGS[Property]["vr"] extends "number"
    ? number
    : string;
};

interface DicomSeriesResponseInterface extends DicomSeriesKeys {}

export class DicomSeriesResponse
  extends DicomGeneralResponse
  implements DicomSeriesResponseInterface
{
  //tags
  Modality: string;
  NumberofSeriesRelatedInstances: number;
  PerformedProcedureStepStartDate: string;
  PerformedProcedureStepStartTime: string;
  RequestedProcedureID: string;
  RetrieveURL: string;
  ScheduledProcedureStepID: string;
  SeriesDescription: string;
  SeriesInstanceUID: string;
  SeriesNumber: number;
  TimezoneOffsetFromUTC: string;

  //additional
  studyInstanceUID: string;
  getThumbnail: () => Promise<null | string>;

  //read response to DicomSeriesResponse class instance
  constructor(
    obj: unknown,
    studyInstanceUID: string,
    dicomClient: DicomClient
  ) {
    super(obj);
    this.studyInstanceUID = studyInstanceUID;
    this.Modality = getTag(obj, SERIES_TAGS["Modality"]);
    this.NumberofSeriesRelatedInstances = getTag(
      obj,
      SERIES_TAGS["NumberofSeriesRelatedInstances"]
    );
    this.PerformedProcedureStepStartDate = getTag(
      obj,
      SERIES_TAGS["PerformedProcedureStepStartDate"]
    );
    this.PerformedProcedureStepStartTime = getTag(
      obj,
      SERIES_TAGS["PerformedProcedureStepStartTime"]
    );
    this.RequestedProcedureID = getTag(
      obj,
      SERIES_TAGS["RequestedProcedureID"]
    );
    this.RetrieveURL = getTag(obj, SERIES_TAGS["RetrieveURL"]);
    this.ScheduledProcedureStepID = getTag(
      obj,
      SERIES_TAGS["ScheduledProcedureStepID"]
    );
    this.SeriesDescription = getTag(obj, SERIES_TAGS["SeriesDescription"]);
    this.SeriesInstanceUID = getTag(obj, SERIES_TAGS["SeriesInstanceUID"]);
    this.SeriesNumber = getTag(obj, SERIES_TAGS["SeriesNumber"]);
    this.TimezoneOffsetFromUTC = getTag(
      obj,
      SERIES_TAGS["TimezoneOffsetFromUTC"]
    );
    this.studyInstanceUID = getTag(obj, SERIES_TAGS["SeriesInstanceUID"]);

    this.getThumbnail = async () => {
      const res = await dicomClient._fetchFunction(
        `/dicom-web/studies/${studyInstanceUID}/series/${this.SeriesInstanceUID}/thumbnail`
      );
      const body = await res.blob();
      const localImageUrl = URL.createObjectURL(body);
      return localImageUrl;
    };
  }
}
