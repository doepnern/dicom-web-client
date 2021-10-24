import { dicomDateToString } from "../util";

export interface DicomStudyResponse {
  studyUID: string;
  numberSeries: number;
  numberInstances: number;
  patientName: string;
  patientBirthDate: string;
  patientSex: string;
  studyDate: string;
  studyTime: string;
  modalities: string;
}
export interface DicomStudyResponsePresentation
  extends Omit<DicomStudyResponse, "studyDate"> {
  studyDate: Date;
}

type DicomStudyResponseNames = keyof DicomStudyResponse;

export type dicomBaseTypes = "string" | "number";
export type dicomTagInfo = {
  name: DicomStudyResponseNames;
  type: dicomBaseTypes;
  customGetter?: (val: any) => string | number | unknown;
};

export const dicomStudyTagMapping: {
  [key: string]: dicomTagInfo;
} = {
  "0020000D": { name: "studyUID", type: "string" },
  "00201206": { name: "numberSeries", type: "number" },
  "00201208": { name: "numberInstances", type: "number" },
  "00100030": { name: "patientBirthDate", type: "string" },
  "00100010": {
    name: "patientName",
    type: "string",
    customGetter: (val) => val["Alphabetic"],
  },
  "00080020": {
    name: "studyDate",
    type: "string",
  },
  "00080030": { name: "studyTime", type: "string" },
  "00080061": { name: "modalities", type: "string" },
};

export function isDicomStudyResponse(
  objIn: unknown
): objIn is DicomStudyResponse {
  if (objIn instanceof Object) {
    const obj = objIn as Record<string, unknown>;
    const desiredObj = Object.values(dicomStudyTagMapping);
    try {
      desiredObj.forEach((desired) => {
        if (!(obj[desired.name] && typeof obj[desired.name] === desired.type))
          throw new Error(
            "invalid value for " +
              desired.name +
              " : " +
              desired.type +
              ", found " +
              obj[desired.name] +
              " in " +
              JSON.stringify(objIn)
          );
      });
      return true;
    } catch (err) {
      console.error(err);
    }
  }
  return false;
}

export function dicomStudyToPresentation(
  study: DicomStudyResponse
): DicomStudyResponsePresentation {
  return {
    ...study,
    studyDate: dicomDateToString(study.studyDate),
  };
}
