# dicom-web-client
Simple dicom client with typescript types to interact with dicom-web REST API

__WORK IN PROGRESS__

## __[Github](https://github.com/doepnern/dicom-web-client)__

## API
There are 3 levels in this api:
- Study
- Series
- Intance

Each of them has their own interfaces and slightly different types available.
They try to representate the levels specified in the official DICOM specifications. However this API was built for a personal project with limited need for support of DICOM-Tags, so it is not nearly complete.

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

__studyUID__ : string

__getThumbnail() : null | string__
- calls to dicom-web/studies/{this.StudyInstanceUID}/series/{this.SeriesInstanceUID}/thumbnail and creates blobURL to be used as image source in browser

_Scheduled "ProcedureStepID" and "RequestedProcedureID" is changed to optional due to it missing often_

## DicomInstanceResponse
Tags included: http://dicom.nema.org/medical/dicom/current/output/chtml/part18/sect_10.6.3.3.3.html

__studyUID__ : string
__seriesUID__ : string

# Tags
Tags and their settings are defined in tags.ts.

If you encounter a problem with a tag you can look up the settings for that tag and change the type to __optional__ if you dont need the tag. In that case a default value of "undefined" is returned if it is a date or string or -1 if it is a number. 

If the tag in the server response has a weird format you can specify __customGetters : ((e : unknown)=>unknown)[]__ on the tag, then the parser(getTag()) will try all customGetters, passing in the value of __incomingObject[{tag}]["Value"]__ in the order specified until one customGetter returns a value with the correct return type.





