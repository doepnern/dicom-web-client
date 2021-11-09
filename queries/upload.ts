//This is cerated for a custom endpoint I created which allows uploads of dicoms as FormData

import { DicomClient } from "..";

export async function uploadDicoms(
  this: DicomClient,
  files: File[]
): Promise<{ studyIds: string[] }> {
  const data = new FormData();
  files.forEach((f) => {
    data.append("file", f);
  });
  const totalSize = files.reduce((acc, cur) => acc + cur.size, 0);
  const response = await this._fetchFunction(
    `/files/uploadDicoms`,
    {
      method: "POST",
      body: data,
    },
    {
      "total-file-size": totalSize + "",
      "total-file-number": files.length + "",
    }
  );
  const jsonRes = await response.json();
  if (jsonRes.error) {
    throw new Error(jsonRes.error);
  }
  if (!isUploadResponse(jsonRes))
    throw new Error(
      "invalid response for /uplaodDicoms, expected {studyIds : string[]}, got: " +
        JSON.stringify(jsonRes)
    );
  return jsonRes;
}

function isUploadResponse(
  obj: Record<string, unknown>
): obj is { studyIds: string[] } {
  if (!("studyIds" in obj && obj["studyIds"] instanceof Array)) return false;
  return true;
}

type ProgressHandler = (ev: ProgressEvent) => void;
export function uploadDicomsXMLHTTP(
  this: DicomClient,
  files: File[],
  {
    onProgress,
    forUser,
  }: {
    onProgress?: ProgressHandler;
    forUser?: string;
  }
) {
  return new Promise((res, rej) => {
    const data = new FormData();
    files.forEach((f) => {
      data.append("file", f);
    });
    const totalSize = files.reduce((acc, cur) => acc + cur.size, 0);
    const req = new XMLHttpRequest();
    req.open("POST", "/files/uploadDicoms", true);

    req.setRequestHeader("total-file-size", totalSize + "");
    req.setRequestHeader("total-file-number", files.length + "");
    req.setRequestHeader("Authorization", this._auth);

    //add for user
    if (forUser) req.setRequestHeader("X-for-user", forUser);

    req.responseType = "json";

    req.upload.onprogress = onProgress;
    req.onerror = () =>
      rej(new Error("Error in request server status " + req.status));

    req.onreadystatechange = () => {
      if (
        req.readyState === XMLHttpRequest.DONE &&
        req.status > 199 &&
        req.status < 300
      ) {
        if (req.response == null) rej(new Error("empty response"));
        else {
          const response = req.response;
          if (!isUploadResponse(response))
            rej(
              new Error(
                "invalid response for /uplaodDicoms, expected {studyIds : string[]}, got: " +
                  JSON.stringify(response)
              )
            );
          res(response);
        }
      }
    };
    req.send(data);
  });
}
