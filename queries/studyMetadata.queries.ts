import { DicomClient } from "..";
import { DicomSeriesResponse } from "../models";

export async function getSeriesInStudy(this: DicomClient, studyId: string) {
  const response = await this._fetchFunction(
    `/dicom-web/studies/${studyId}/series`
  );
  const jsonRes = await response.json();
  if (!(jsonRes instanceof Array)) {
    //try getting error
    if (jsonRes.error) throw new Error(jsonRes.error);
    throw new Error("expected array of json to be retuned");
  }

  const dicomResPromise = jsonRes.map(
    (e) => new DicomSeriesResponse(e, studyId, this)
  );
  const dicomRes = await Promise.all(dicomResPromise);

  return dicomRes;
}

// async function responseToDicomSeriesResponse(
//   obj: unknown,
//   studyId: string
// ): Promise<DicomSeriesResponse> {
//   const tags = Object.keys(dicomSeriesTagMapping);
//   const dicomStudy: Record<string, string | number | null> = {};
//   for (const t of tags) {
//     dicomStudy[dicomSeriesTagMapping[t].name] = getTagValue(
//       obj,
//       t,
//       dicomSeriesTagMapping[t]
//     );
//   }
//   dicomStudy["thumbnail"] = null;

//   if (!isDicomSeriesResponse(dicomStudy))
//     throw new Error("response was not a valid DicomStudy response");
//   //try getting thumbnail
//   const seriesThumbnail = await this.getDicomSeriesThumbnail(
//     studyId,
//     dicomStudy.seriesInstanceUID,
//     dicomStudy
//   );
//   return { ...dicomStudy, thumbnail: seriesThumbnail };
// }

// //load middle image of series as thumbnail
// export async function getDicomSeriesThumbnail(
//   this: DicomClient,
//   studyId: string,
//   seriesInstanceUID: string,
//   seriesResponse: DicomSeriesResponse
// ): Promise<string | null> {
//   const numInstances = seriesResponse.numberSeriesRelatedInstances;
//   if (numInstances < 1) throw new Error("No instances in Series");
//   const middleIndex =
//     numInstances % 2 === 0 ? numInstances / 2 : (numInstances - 1) / 2;
//   try {
//     const findReq = await this._fetchFunction(
//       `/dicom-web/studies/${studyId}/series/${seriesInstanceUID}/instances?limit=1&offset=${middleIndex}`
//     );
//     const foundInstance = await findReq.json();
//     if (!(foundInstance instanceof Array && foundInstance.length > 0))
//       throw new Error("Error generating thumbnail");
//     const foundInstanceUID = getTagValue(foundInstance[0], "00080018", {
//       name: "instanceUID",
//       type: "string",
//     });
//     const res = await this._fetchFunction(
//       `/dicom-web/studies/${studyId}/series/${seriesInstanceUID}/instances/${foundInstanceUID}/frames/1/rendered`,
//       undefined,
//       { Accept: "image/png" }
//     );

//     const body = await res.blob();
//     const localImageUrl = URL.createObjectURL(body);
//     return localImageUrl;
//   } catch (err) {
//     console.warn(err);
//     return null;
//   }
// }
