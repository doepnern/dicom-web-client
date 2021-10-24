export interface DicomSeriesResponse {
  modality: string;
  modalitySequence: string;
  seriesInstanceUID: string;
  numberSeriesRelatedInstances: number;
  // seriesNumber: string;
  // performedProcedureStartDate: string;
  // performedProcedureStartTime: string;
  // requestAttributeSequence: string;
  thumbnail: null | string;
}

type dicomTagInfo = {
  name: keyof DicomSeriesResponse;
  type: string;
  customGetter?: (val: any) => string | number | unknown;
  optional?: boolean;
  default?: string | number;
};

export const dicomSeriesTagMapping: {
  [key: string]: dicomTagInfo;
} = {
  "00080060": { name: "modality", type: "string" },
  "0020000E": { name: "seriesInstanceUID", type: "string" },
  "0008103E": {
    name: "modalitySequence",
    type: "string",
    optional: true,
    default: "unknown",
  },
  "00201209": {
    name: "numberSeriesRelatedInstances",
    type: "number",
  },
};

export function isDicomSeriesResponse(
  objIn: unknown
): objIn is DicomSeriesResponse {
  console.log(objIn);
  if (objIn instanceof Object) {
    const obj = objIn as Record<string, unknown>;
    const desiredObj = Object.values(dicomSeriesTagMapping);
    try {
      if (
        !(
          "thumbnail" in objIn &&
          (objIn["thumbnail"] === null ||
            typeof objIn["thumbnail"] === "string")
        )
      )
        throw new Error("DicomSeries has missing property thumbnail");
      desiredObj.forEach((desired) => {
        if (desired.optional) return;
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
