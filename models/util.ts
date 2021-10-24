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

//gets a value for a given tag, if required is
export function getTagValue(
  obj: unknown,
  tag: string,
  tagMapping: {
    name: any;
    type: string;
    customGetter?: (val: any) => string | number | unknown;
    optional?: boolean;
    default?: string | number;
  }
): string | number {
  try {
    if (!(obj instanceof Object && tag in obj))
      throw new Error("not a valid dicomResponse");
    const studyDetails: unknown = (obj as Record<string, unknown>)[tag];
    if (!(studyDetails instanceof Object && "Value" in studyDetails))
      throw new Error("not a valid dicomResponse, missing Value");
    const tagValue: unknown = tagMapping.customGetter
      ? tagMapping.customGetter(studyDetails["Value"][0])
      : studyDetails["Value"][0];
    if (!(typeof tagValue === tagMapping.type))
      throw new Error(
        "expected dicomResponse value to be " +
          tagMapping.type +
          " received: " +
          tagValue +
          " for " +
          tagMapping.name
      );
    return tagValue as string | number;
  } catch (err) {
    //if value was optional, ignore error
    if (tagMapping.optional) {
      console.warn(
        "didnt find value for tag " +
          tagMapping.name +
          " returning default value or empty string instead"
      );
      return tagMapping.default ?? "";
    }
    throw err;
  }
}
