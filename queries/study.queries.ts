import type { DicomClient } from "..";
import { DicomStudyResponse } from "../models/Study";

//returns studys of currently authenticated user
export async function getUserStudies(
  this: DicomClient
): Promise<DicomStudyResponse[]> {
  const response = await this._fetchFunction(`/dicom-web/studies`);
  const jsonRes: unknown = await response.json();
  if (!(jsonRes instanceof Array))
    throw new Error("response was not a valid array");
  const dicomRes = jsonRes.map((e) => new DicomStudyResponse(e));
  return dicomRes;
}

export async function downloadStudy(
  this: DicomClient,
  studyUID: string,
  onProgress?: (bytes: number) => void,
  onError?: (err: Error) => void
) {
  try {
    const response = await this._fetchFunction(
      `/dicom-web/studies/${studyUID}`
    );
    const zipData = await receiveWithProgress(response, onProgress);
    const zipURL = URL.createObjectURL(new Blob([zipData]));
    return zipURL;
  } catch (err) {
    if (onError) onError(err);
    else return "";
  }
}

async function receiveWithProgress(
  response: Response,
  onProgress?: (bytes: number) => void
) {
  const reader = response.body.getReader();
  response.headers.forEach((h) => console.log(h));
  const filename = response.headers.get("filename");

  // Step 2: get total length
  const contentLength = +response.headers.get("Content-Length");

  // Step 3: read the data
  let receivedLength = 0; // received that many bytes at the moment
  let chunks = []; // array of received binary chunks (comprises the body)
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    receivedLength += value.length;

    if (onProgress) onProgress(receivedLength);
    // console.log(`Received ${receivedLength} of ${contentLength}`);
  }

  // Step 4: concatenate chunks into single Uint8Array
  let chunksAll = new Uint8Array(receivedLength); // (4.1)
  let position = 0;
  for (let chunk of chunks) {
    chunksAll.set(chunk, position); // (4.2)
    position += chunk.length;
  }

  return chunksAll;
}
