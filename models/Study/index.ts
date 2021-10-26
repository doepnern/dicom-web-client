// import { DicomStudyResponse } from "./types";
// import { dicomDateToString } from "../util";
// import { DicomStudyResponsePresentation } from "../../dist/models";
import { STUDY_TAGS } from "../../tags";
import { dicomDateToString, getTag } from "../util";

type DicomStudyKeys = {
  -readonly [Property in keyof typeof STUDY_TAGS]: typeof STUDY_TAGS[Property]["vr"] extends "number"
    ? number
    : string;
};

interface DicomStudyResponseInterface extends DicomStudyKeys {}

class DicomStudyResponse implements DicomStudyResponseInterface {
  _rawMessage: unknown | null;

  InstanceAvailability: string;
  ModalitiesinStudy: string;
  NumberofStudyRelatedInstances: number;
  NumberofStudyRelatedSeries: number;
  PatientBirthDate: string;
  PatientID: string;
  PatientName: string;
  PatientSex: string;
  ReferringPhysiciansName: string;
  RetrieveURL: string;
  StudyID: string;
  StudyInstanceUID: string;
  TimezoneOffsetFromUTC: string;
  StudyDate: string;
  StudyTime: string;
  AccessionNumber: string;
  constructor(obj: unknown) {
    this._rawMessage = obj;
    this.InstanceAvailability = getTag(obj, STUDY_TAGS["InstanceAvailability"]);
    this.ModalitiesinStudy = getTag(obj, STUDY_TAGS["ModalitiesinStudy"]);
    this.NumberofStudyRelatedInstances = getTag(
      obj,
      STUDY_TAGS["NumberofStudyRelatedInstances"]
    );
    this.NumberofStudyRelatedSeries = getTag(
      obj,
      STUDY_TAGS["NumberofStudyRelatedSeries"]
    );
    this.PatientBirthDate = getTag(obj, STUDY_TAGS["PatientBirthDate"]);
    this.PatientID = getTag(obj, STUDY_TAGS["PatientID"]);
    this.PatientName = getTag(obj, STUDY_TAGS["PatientName"]);
    this.PatientSex = getTag(obj, STUDY_TAGS["PatientSex"]);
    this.ReferringPhysiciansName = getTag(
      obj,
      STUDY_TAGS["ReferringPhysiciansName"]
    );
    this.RetrieveURL = getTag(obj, STUDY_TAGS["RetrieveURL"]);
    this.StudyID = getTag(obj, STUDY_TAGS["StudyID"]);
    this.StudyInstanceUID = getTag(obj, STUDY_TAGS["StudyInstanceUID"]);
    this.StudyDate = getTag(obj, STUDY_TAGS["StudyDate"]);
    this.StudyTime = getTag(obj, STUDY_TAGS["StudyTime"]);
    this.AccessionNumber = getTag(obj, STUDY_TAGS["AccessionNumber"]);
  }
}

interface DicomStudyResponsePresentation
  extends Omit<DicomStudyResponse, "studyDate"> {
  studyDate: Date;
}

function dicomStudyToPresentation(
  study: DicomStudyResponse
): DicomStudyResponsePresentation {
  return {
    ...study,
    studyDate: dicomDateToString(study.StudyDate),
  };
}

export {
  DicomStudyResponse,
  DicomStudyResponsePresentation,
  dicomStudyToPresentation,
};

// export const dicomStudyTagMapping: {
//   [key: string]: dicomTagInfo;
// } = {
//   "0020000D": { name: "studyUID", type: "string" },
//   "00201206": { name: "numberSeries", type: "number" },
//   "00201208": { name: "numberInstances", type: "number" },
//   "00100030": { name: "patientBirthDate", type: "string" },
//   "00100010": {
//     name: "patientName",
//     type: "string",
//     customGetter: (val) => val["Alphabetic"],
//   },
//   "00080020": {
//     name: "studyDate",
//     type: "string",
//   },
//   "00080030": { name: "studyTime", type: "string" },
//   "00080061": { name: "modalities", type: "string" },
// };

// export function isDicomStudyResponse(
//   objIn: unknown
// ): objIn is DicomStudyResponse {
//   if (objIn instanceof Object) {
//     const obj = objIn as Record<string, unknown>;
//     const desiredObj = Object.values(dicomStudyTagMapping);
//     try {
//       desiredObj.forEach((desired) => {
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
