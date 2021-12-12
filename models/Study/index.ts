// import { DicomStudyResponse } from "./types";
// import { dicomDateToString } from "../util";
import { STUDY_TAGS } from "../../tags";
import { DicomGeneralResponse } from "../DicomResponse";
import { dicomDateToString, getTag } from "../util";

type DicomStudyKeys = {
  -readonly [Property in keyof typeof STUDY_TAGS]: typeof STUDY_TAGS[Property]["vr"] extends "number"
    ? number
    : string;
};

interface DicomStudyResponseInterface extends DicomStudyKeys {}

class DicomStudyResponse
  extends DicomGeneralResponse
  implements DicomStudyResponseInterface
{
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
    super(obj);
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
