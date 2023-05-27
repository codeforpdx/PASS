## ZXing Barcode Scanner Overview

_Authored by [Brian Hayes](https://github.com/tomit4) 05/24/2023_

### Introduction

This document is meant to be a general overview for new users and developers for the PASS project's barcode scanner feature. At the time of this writing, this feature is specifically utilized to scan Driver's Licenses PDF417 barcodes in order to retrieve the data from the license, parse it into the appropriate .ttl (aka "Turtle") file format for storage on a Solid Client Server. While the development of this and other feature's of the PASS application is still currently ongoing, this document is meant to assist new user's of the PASS platform in becoming familiar with this feature and also to help new developers of the PASS project find where the logic for this feature lives within the code base.

### For Users of PASS

The current implementation of PDF417 barcode scanning of Driver's Licenses in PASS is imperfect, but functional. In order for the PDF417 barcode scanner to work appropriately, one must ensure that the barcode image is clear. Additionally the barcode image must be cropped reasonably so there are not any other aspects of the image that may interfere with the scanner. Finally, the barcode image must not be presented at a severe angle. Ideally the barcode image would appear very clearly, cropped specifically to show only the barcode, and be facing straight forward in the image. Here is an example of an ideal presentation of the barcode image:

<p align="center">
    <img src="https://github.com/codeforpdx/PASS/raw/Master/src/assets/demo_barcode.gif">
</p>

### For Developers

**General Use**

Currently PASS is in production, please see our [on-boarding](https://github.com/codeforpdx/PASS/blob/Master/CONTRIBUTING.md) to get a local version of PASS running. Alternatively you can visit our [live demo](https://codeforpdx.github.io/PASS/#/PASS/) to try it out. Once you have signed up with Solid, use your new username and password to log in. Navigate to the Forms section and you'll be presented with a series of options to upload documents.

To test the barcode scanner specifically, head to the Upload Documents section. At the drop down form under "Select document type to upload", select "Driver's License". You may optionally provide an expiration date for the document and also a description. Finally under the "File to upload" section, select the scanned image of the Driver's License PDF417 barcode from your computer. Click on the "Upload file" button and wait until you receive a short confirmation message below confirming your file has been uploaded.

To see the results on the Solid Client Server, navigate below to the Search Document section. There you will find a form drop down titled "Select Document Type". Select the "Driver's License" option and once selected, click on the "Get Document" button. After some loading time, a url should appear within this section of the page. Click on that link and a new tab will open which will present you with an interface for the Solid Pod. Here you will find icons that will navigate you to the scanned barcode image as well as the .ttl file containing the scanned data from the Driver's License barcode.

**Entry Point to the Code**

For developers new to a code base, often being pointed to where user interaction first interfaces with the code base is a good place to start. In the case of the barcode scanner functionality, this can be found within the UploadDocumentForm.jsx component within the src/components directory:

```
src/components/Form/UploadDocumentForm.jsx
```

At the time of this writing, the line specific to uploading files can be found on line 67 of this file, where the entry point of what happens when the user clicks on the "Upload file", as this triggers the handleFormSubmission function, defined on line 48. This function in turn calls the makeHandleFormSubmission function found within the utils directory, where the majority of the barcode scanner logic lives:

```
src/utils/frontend/FormSubmissionHelper.js
```

This function handles a good deal of logic for submitting a wide variety of forms to the Solid Server, including parsing the fileObject passed based off the event, and most importantly uploading the document, specifically by calling the uploadDocument() function defined on line 47. Going to the definition of this function leads us to:

```
src/utils/network/session-core.js
```

Defined on line 162, uploadDocument() contains a great deal of logic specific to solid and we start to see a good deal of functions coming from the [@inrupt/solid-client libraries](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/solid-client/). Of particular interest to the subject of this document is the createResourceTtlFile() function on line 191, which is defined within:

```
src/utils/network/session-helper.js
```

Here on line 346 we see the logic specific to @inrupt/solid-client, which takes our fileObject and documentUrl and builds a generic .ttl file to be sent to the Solid server. Specific to the barcode scanner is the if statement check on line 349 which checks to see if the user has selected the "Driver's License" document from the "File to upload:" in the UploadDocumentForm.jsx component. Upon inspection of this if statement, we see that if the user has selected "Driver's License", the function returns the value of a separate helper function called createDriversLicenseTtlFile(), defined on line 300. This lengthy function is very similar to the createResourceTtlFile() function, but starts itself with a helper function of its own called getDriversLicenseData, which takes the fileObject.file as an argument. This helper function is defined in:

```
src/utils/barcode/barcode-scan.js
```

For the sake of brevity, I will not go into particular detail regarding on every aspect of this file. The jsdoc comments should be relatively self explanatory to anyone relatively familiar with the basics of JavaScript. That said, I will do my best to provide a brief explanation. Initially the readImageFile() function is called, which takes the file passed to it and returns the raw base64 image data within a JavaScript object. This image data is then decoded using the [@zxing-browser library](https://www.npmjs.com/package/@zxing/browser), specifically using their PDF417 reader to decode the barcode. The results are then returned in a simple csv style text format. For the purposes of easier parsing, this text data is then further processed by the csvToJson() function, which, as its name suggests, converts this textual data into JSON. This returned data is what is finally returned by the getDriversLicenseData() function in:

```
src/utils/network/session-helper.js
```

Returning to our createDriversLicenseTtlFile() function we see that the returned scanned data as JavaScript object is assigned the variable "dlData". This "dlData" object is then passed to the @inrupt/solid-client library's functions buildThing() and subsequently createThing(). It then utilizes PASS's RDF_PREDICATES object, which stores a series schema definitions specific to [schema.org](https://schema.org/docs/full.html).

NOTE: The schema's used to validate the Driver's License returned data are currently in the works of being changed to a series of custom schemas unique to PASS and may change in the near future.

A side note is that the fields that call the .addDate() function utilize a helper function called formattedDate(), which is defined in src/utils/barcode/barcode-date-parser.js. This ensures that the dates returned from the Driver's License are in a format consistent with other dates parsed in PASS. Finally the @inrupt/solid-client library calls the build() function, finalizing the creation of our .ttl file which is passed back up the uploadDocument() function in session-core.js and sent off to the Solid Client for storage in the user's pod.

### Conclusion

This document is meant mainly for new developers to the PASS project who wish to inspect the barcode scanner logic in particular should the implementation of the barcode scanner need to be changed or should the feature need to be extended somehow (perhaps in scanning other documents). While it is likely that eventually this logic should change at some point during the life cycle of the development of PASS, I thought it imperative to document where exactly the logic for this feature lives, what the life cycle of user interaction with this feature looks like from behind the scenes, and to give developers new to the PASS project a comprehensive "bird's eye" overview of code specific to how the barcode scanner works.
