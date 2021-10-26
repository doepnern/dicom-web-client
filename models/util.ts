import { tagOptions } from "../tags";

export function getTag(
  obj,
  tagOptions: Omit<tagOptions, "vr"> & {
    vr: "string" | "date";
  }
): string;

export function getTag(
  obj,
  tagOptions: Omit<tagOptions, "vr"> & {
    vr: "number";
  }
): number;

export function getTag(obj: unknown, tagOptions: tagOptions): number | string {
  const { tag, vr } = tagOptions;
  const err = (msg: string) =>
    new DicomTagValidationError(msg, obj, tagOptions);
  try {
    if (!(obj instanceof Object && tag in obj)) throw err("missing tag " + tag);
    const studyDetails: unknown = (obj as Record<string, unknown>)[tag];
    if (!(studyDetails instanceof Object && "Value" in studyDetails))
      throw err("missing Value key in " + JSON.stringify(studyDetails));

    const tagValue: unknown = tagOptions.customGetters
      ? tryCustomGetters(studyDetails["Value"][0], tagOptions, err)
      : studyDetails["Value"][0];
    if (!isCorrectReturnvalue(tagOptions, tagValue))
      throw err(
        "expected type " +
          vr +
          " received: " +
          JSON.stringify(tagValue) +
          " for tag " +
          tag
      );
    return tagValue as string | number;
  } catch (error) {
    //if value was optional, ignore error
    if (tagOptions.type === "optional") {
      console.warn(
        "didnt find value for tag " +
          tag +
          " returning default value or empty string instead"
      );
      return vr === "number" ? -1 : "undefined";
    }
    throw error;
  }
}

function isCorrectReturnvalue(
  tagOptions,
  tagValue: unknown
): tagValue is number | string {
  return (
    (tagOptions.vr === "number" && typeof tagValue === "number") ||
    typeof tagValue === "string"
  );
}

function tryCustomGetters(
  tagValue,
  tagOptions: tagOptions,
  err: (msg: string) => DicomTagValidationError
): string | number {
  for (const cg of tagOptions.customGetters) {
    try {
      const res = cg(tagValue);
      if (isCorrectReturnvalue(tagOptions, res)) return res;
    } catch (e) {}
  }
  throw err(
    "Custom getters did not provide expected type for tag " +
      JSON.stringify(tagOptions)
  );
}

export function dicomDateToString(dateString: string) {
  if (dateString.length !== 8)
    throw new Error("could not contvert to date: " + dateString);
  const year = parseInt(dateString.slice(0, 4));
  const month = parseInt(dateString.slice(4, 6));
  const day = parseInt(dateString.slice(6));
  if ([year, month, day].some((e) => isNaN(e)))
    throw new Error("could not contvert to date: " + dateString);
  return new Date(year, month, day);
}

class DicomTagValidationError extends Error {
  constructor(message: string, checkingObj: unknown, tagOptions: tagOptions) {
    const superMessage: string = `Error trying to get tag: ${JSON.stringify(
      tagOptions,
      null,
      2
    )} from object ${
      checkingObj != null ? JSON.stringify(checkingObj, null, 2) : "undefined"
    } ; ${message}`;
    super(superMessage);
    this.name = "DicomTagValidationError";
  }
}
