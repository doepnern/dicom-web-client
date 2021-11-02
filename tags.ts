export type tagOptions = {
  tag: string;
  type: "optional" | "required" | "unique";
  vr: "string" | "number" | "date";
  customGetters?: readonly ((e: unknown) => unknown)[];
};
export const STUDY_TAGS = {
  InstanceAvailability: { tag: "00080056", type: "optional", vr: "string" },
  ModalitiesinStudy: { tag: "00080061", type: "required", vr: "string" },
  ReferringPhysiciansName: {
    tag: "00080090",
    type: "required",
    vr: "string",
    customGetters: [
      (e: unknown) => e,
      (e: unknown) => e["Alphabetic"],
      (e: unknown) => JSON.stringify(e) as unknown,
    ],
  },
  TimezoneOffsetFromUTC: { tag: "00080201", type: "optional", vr: "string" },
  RetrieveURL: { tag: "00081190", type: "optional", vr: "string" },
  PatientName: {
    tag: "00100010",
    type: "required",
    vr: "string",
    customGetters: [
      (e: unknown) => e,
      (e: unknown) => e["Alphabetic"],
      (e: unknown) => JSON.stringify(e) as unknown,
    ],
  },
  PatientID: { tag: "00100020", type: "required", vr: "string" },
  PatientBirthDate: { tag: "00100030", type: "required", vr: "date" },
  PatientSex: { tag: "00100040", type: "required", vr: "string" },
  StudyInstanceUID: { tag: "0020000D", type: "unique", vr: "string" },
  StudyID: { tag: "00200010", type: "required", vr: "string" },
  NumberofStudyRelatedSeries: {
    tag: "00201206",
    type: "required",
    vr: "number",
  },
  NumberofStudyRelatedInstances: {
    tag: "00201208",
    type: "required",
    vr: "number",
  },
  StudyDate: { tag: "00080020", type: "required", vr: "date" },
  StudyTime: { tag: "00080030", type: "required", vr: "string" },
  AccessionNumber: { tag: "00080050", type: "required", vr: "string" },
} as const;

export const SERIES_TAGS = {
  Modality: { tag: "00080060", type: "required", vr: "string" },
  TimezoneOffsetFromUTC: { tag: "00080201", type: "optional", vr: "string" },
  SeriesDescription: { tag: "0008103E", type: "optional", vr: "string" },
  RetrieveURL: { tag: "00081190", type: "required", vr: "string" },
  SeriesInstanceUID: { tag: "0020000E", type: "unique", vr: "string" },
  SeriesNumber: { tag: "00200011", type: "required", vr: "number" },
  NumberofSeriesRelatedInstances: {
    tag: "00201209",
    type: "required",
    vr: "number",
  },
  PerformedProcedureStepStartDate: {
    tag: "00400244",
    type: "optional",
    vr: "date",
  },
  PerformedProcedureStepStartTime: {
    tag: "00400245",
    type: "optional",
    vr: "string",
  },
  // RequestAttributesSequence: { tag: "00400275", type: "optional", vr: "string"  }, should be array, dont have type defined for that yet
  //should be required but is often missing
  ScheduledProcedureStepID: { tag: "00400009", type: "optional", vr: "string" },
  //should be required but is often missing
  RequestedProcedureID: { tag: "00401001", type: "optional", vr: "string" },
} as const;

export const INSTANCE_TAGS = {
  SOPClassUID: { tag: "00080016", type: "required", vr: "string" },
  SOPInstanceUID: { tag: "00080018", type: "unique", vr: "string" },
  InstanceAvailability: { tag: "00080056", type: "optional", vr: "string" },
  TimezoneOffsetFromUTC: { tag: "00080201", type: "optional", vr: "string" },
  //should be required, but is missing from orthanc response
  RetrieveURL: { tag: "00081190", type: "optional", vr: "string" },
  InstanceNumber: { tag: "00200013", type: "required", vr: "number" },
  Rows: { tag: "00280010", type: "optional", vr: "number" },
  Columns: { tag: "00280011", type: "optional", vr: "number" },
} as const;

// export const SERIES_METADATA_TAGS = {
//   "SOP​Instance​UID": "00080018",
// };

// export const SERIES_TAGS_OLD = {
//   modality: "00080060",
//   seriesInstanceUID: "0020000E",
//   modalitySequence: "0008103E",
//   numberSeriesRelatedInstances: "00201209",
// } as const;
