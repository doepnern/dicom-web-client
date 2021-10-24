# dicom-web-client
Simple dicom client with typescript types to interact with dicom-web REST API

## API
There are 3 levels in this api:
- Study
- Series
- Intance

Each of them has their own interfaces and slightly different types available.
They try to representate the leves specified in the official DICOM specifications. However this API was built for a personal project with limited need for support of DICOM-Tags, so it is not nearly complete.

This package uses the fetch API(https://developer.mozilla.org/de/docs/Web/API/Fetch_API)

You can either import the functions directly, which will use the basicFetch or import the DicomClient class and modify the fetch function with the DicomClient.setFetchFunction(fetchFn).

### Study
____




