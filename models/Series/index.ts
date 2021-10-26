import { DicomClient } from "../..";
import { SERIES_TAGS } from "../../tags";
import { getTag } from "../util";

type DicomSeriesKeys = {
  -readonly [Property in keyof typeof SERIES_TAGS]: typeof SERIES_TAGS[Property]["vr"] extends "number"
    ? number
    : string;
};

interface DicomSeriesResponseInterface extends DicomSeriesKeys {}

export class DicomSeriesResponse implements DicomSeriesResponseInterface {
  _rawMessage: unknown | null;

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
    this._rawMessage = obj;
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

// type dicomTagInfo = {
//   name: keyof DicomSeriesResponse;
//   type: string;
//   customGetter?: (val: any) => string | number | unknown;
//   optional?: boolean;
//   default?: string | number;
// };

// export function isDicomSeriesResponse(
//   objIn: unknown
// ): objIn is DicomSeriesResponse {
//   console.log(objIn);
//   if (objIn instanceof Object) {
//     const obj = objIn as Record<string, unknown>;
//     const desiredObj = Object.values(dicomSeriesTagMapping);
//     try {
//       if (!("getThumbnail" in objIn))
//         throw new Error("DicomSeries has missing property getThumbnail");
//       desiredObj.forEach((desired) => {
//         if (desired.optional) return;
//         if (!(obj[desired.name] && typeof obj[desired.name] === desired.type))
//           throw new Error(
//             "invalid value for " +
//               desired.name +
//               " : " +
//               desired.type +
//               ", found " +
//               obj[desired.name] +
//               " in " +
//               JSON.stringify(objIn)
//           );
//       });
//       return true;
//     } catch (err) {
//       console.error(err);
//     }
//   }
//   return false;
// }

// }
// export const dicomSeriesTagMapping: {
//   [key: string]: dicomTagInfo;
// } = {
//   "00080060": { name: "modality", type: "string" },
//   "0020000E": { name: "seriesInstanceUID", type: "string" },
//   "0008103E": {
//     name: "modalitySequence",
//     type: "string",
//     optional: true,
//     default: "unknown",
//   },
//   "00201209": {
//     name: "numberSeriesRelatedInstances",
//     type: "number",
//   },
// };

// export interface DicomSeriesResponse {
//   modality: string;
//   modalitySequence: string;
//   seriesInstanceUID: string;
//   numberSeriesRelatedInstances: number;
//   // seriesNumber: string;
//   // performedProcedureStartDate: string;
//   // performedProcedureStartTime: string;
//   // requestAttributeSequence: string;
//   // thumbnail: null | string;
//   getThumbnail: () => Promise<null | string>;

// const seriesTagMapping: {
//   modality: tagOptions<string>;
//   modalitySequence: tagOptions<string>;
//   seriesInstanceUID: tagOptions<string>;
//   numberSeriesRelatedInstances: tagOptions<number>;
// } = {
//   modality: {
//     tag: SERIES_TAGS["modality"],
//     returnType: "string",
//   },
//   modalitySequence: {
//     tag: SERIES_TAGS["modalitySequence"],
//     returnType: "string",
//   },
//   seriesInstanceUID: {
//     tag: SERIES_TAGS["seriesInstanceUID"],
//     returnType: "string",
//   },
//   numberSeriesRelatedInstances: {
//     tag: SERIES_TAGS["numberSeriesRelatedInstances"],
//     returnType: "number",
//   },
// };
