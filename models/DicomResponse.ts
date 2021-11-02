export class DicomGeneralResponse {
  _rawMessage: Record<string, unknown>;
  constructor(obj: unknown) {
    if (!isRecord(obj))
      throw new Error(
        "expected constructor object to be an object, received " +
          JSON.stringify(obj, null, 2)
      );
    this._rawMessage = obj;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
