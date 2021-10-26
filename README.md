# dicom-web-client
Simple dicom client with typescript types to interact with dicom-web REST API

## API
There are 3 levels in this api:
- Study
- Series
- Intance

Each of them has their own interfaces and slightly different types available.
They try to representate the leves specified in the official DICOM specifications. However this API was built for a personal project with limited need for support of DICOM-Tags, so it is not nearly complete.

This package uses the fetch API (https://developer.mozilla.org/de/docs/Web/API/Fetch_API)

You will need to import the DicomClient class on which ou can modify the fetch function with the DicomClient.setFetchFunction(fetchFn).
If you are using the DicomClient in Node, you will need to pass a baseUrl to the constructor as node-fetch does not support relative URLs.

## DicomClass
__new DicomClass({ baseUrl?: string,  auth: string})__
- creates DicomClass on which all other functions are available, __basUrl__ will be prepended on all requests, __auth__ will be used to populate the Authorization header on requests.

## Study
__getUserStudies()__ : [DicomStudyResponse[]](#DicomStudyResponse)
- calls to dicom-web/studies and returns array of studys

## Series
__getSeriesInStudy(studyUID : string)__ : [DicomSeriesResponse[]](#DicomSeriesResponse)
- calls to dicom-web/studies/{studyId} and returns array of DicomSeriesResponse

## Instances
__getInstancesInSeries(studyUID : string, seriesUID : string)__
- calls to dicom-web/studies/{studyId}/series/{seriesUID} and returns instances in series

__getInstanceMetadata(studyUID : string, seriesUID : string, instanceUID : string)__
- calls to dicom-web/studies/{studyId}/series/{seriesUID}/instanes/{instanceUID}/metadata and returns metadata of series

# Models
## DicomStudyResponse
Tags included: http://dicom.nema.org/medical/dicom/current/output/chtml/part18/sect_10.6.3.3.html

## DicomSeriesResponse
Tags included: http://dicom.nema.org/medical/dicom/current/output/chtml/part18/sect_10.6.3.3.2.html

_Scheduled "ProcedureStepID" and "RequestedProcedureID" is changed to optional due to it missing often_

__studyUID__ : string

__getThumbnail() : null | string__
- calls to dicom-web/studies/{this.StudyInstanceUID}/series/{this.SeriesInstanceUID}/thumbnail and creates blobURL to be used as image source in browser





