import {
  saveFileInContainer,
  getSourceUrl,
  getSolidDataset,
  saveSolidDatasetInContainer,
  getStringWithLocale,
  getStringNoLocaleAll,
  getThingAll,
  saveSolidDatasetAt,
  buildThing,
  createSolidDataset,
  createThing,
  setThing,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { rdf } from "@inrupt/solid-client/dist/constants";
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";

// If your Pod is *not* on `solidcommunity.net`, change this to your identity provider.
const SOLID_IDENTITY_PROVIDER = "https://solidcommunity.net";
document.getElementById(
  "solid_identity_provider"
).innerHTML = `[<a target="_blank" href="${SOLID_IDENTITY_PROVIDER}">${SOLID_IDENTITY_PROVIDER}</a>]`;

const NOT_ENTERED_WEBID =
  "...not logged in yet - but enter any WebID to read from its profile...";

const session = new Session();

const buttonLogin = document.getElementById("btnLogin");
const writeForm = document.getElementById("writeForm");
const queryForm = document.getElementById("queryData");

// 1a. Start Login Process. Call session.login() function.
async function login() {
  if (!session.info.isLoggedIn) {
    await session.login({
      oidcIssuer: SOLID_IDENTITY_PROVIDER,
      //  clientName: "Inrupt tutorial client app",
      redirectUrl: window.location.href,
    });
  }
}

// 1b. Login Redirect. Call session.handleIncomingRedirect() function.
// When redirected after login, finish the process by retrieving session information.
async function handleRedirectAfterLogin() {
  await session.handleIncomingRedirect(window.location.href);
  if (session.info.isLoggedIn) {
    // Update the page with the status.
    document.getElementById(
      "labelStatus"
    ).innerHTML = `Your session is logged in with the WebID [<a target="_blank" href="${session.info.webId}">${session.info.webId}</a>].`;
    document.getElementById("labelStatus").setAttribute("role", "alert");
    console.log(session.info.webId.split("profile")[0]);
    document.getElementById("write").removeAttribute("hidden");
    document.getElementById("query").removeAttribute("hidden");
  }
}

// The example has the login redirect back to the index.html.
// This calls the function to process login information.
// If the function is called when not part of the login redirect, the function is a no-op.
handleRedirectAfterLogin();

// 2. Write to profile

async function handleFiles() {
  //get pod url and remove profile card
  const MY_POD_URL = session.info.webId.split("profile")[0];
  //get document that has been added through browser
  const fileList = document.getElementById("input_file").files[0];
  //get end date from form
  let endDateValue = document.getElementById("date").value;
  //get description from form
  let descriptionValue = document.getElementById("description").value;
  //get selected identifier / document type from form
  let documentValue = document.getElementById("document").value;
  console.log(fileList);

  //run function to upload file, provide file and url where to upload
  const uploadedFile = await placeFileInContainer(fileList, `${MY_POD_URL}`);

  // specify url from where you want to call data. In this case folder as you need to check if ttl file already exists
  const exampleSolidDatasetURL = session.info.webId.split("profile")[0];

  let checkDataSetForTTL = await getSolidDataset(
    exampleSolidDatasetURL,
    { fetch: session.fetch } // fetch function from authenticated session
  );

  //check if ttl file is already existing or not. If file exists you will append the existing ttl file if none exists you need to create a new data set
  function checkTtl() {
    const ttlExists = [];
    //get all things in dataset
    const items = getThingAll(checkDataSetForTTL);
    for (item of items) {
      //check if item ends with ttl if yes push
      if (item.url.slice(-3) == "ttl") {
        ttlExists.push(item.url);
      }
    }
    return ttlExists;
  }

  //even if several ttl exist we use always the first one - no reason for this. easiest solution
  const ttl = checkTtl()[0];

  //end date and description are not mandatory, set default values in case not provided
  if (endDateValue.length < 1) {
    endDateValue = "12/12/1212";
  }
  if (descriptionValue.length < 1) {
    descriptionValue = "No Description provided";
  }

  //create thing for document you just uploaded
  const toBeUpdated = buildThing(createThing({ name: uploadedFile }))
    //set identifier, enddate and description
    .addStringNoLocale(SCHEMA_INRUPT.name, uploadedFile)
    .addStringNoLocale(SCHEMA_INRUPT.identifier, documentValue)
    .addStringNoLocale(SCHEMA_INRUPT.endDate, endDateValue)
    .addStringNoLocale(SCHEMA_INRUPT.description, descriptionValue)
    .build();

  console.log("TTL url ", ttl);
  let myDataset;
  //if ttl exists
  if (ttl) {
    // if ttl exists get ttl
    myDataset = await getSolidDataset(
      ttl,
      { fetch: session.fetch } // fetch function from authenticated session
    );
    console.log("called orginal dataset: ", myDataset);
    //get thing you want to update by specificng the url of the file and run against the whole dataset

    //update dataset with thing
    myDataset = setThing(myDataset, toBeUpdated);

    //save dataset
    const savedSolidDataset = await saveSolidDatasetAt(
      ttl,
      // exampleSolidDatasetURL,
      myDataset,
      { fetch: session.fetch }
    ).then((result) => {
      console.log("new dataset: ", result);
    });
  } else {
    //if not ttl exists first create data set
    let courseSolidDataset = createSolidDataset();

    //add thing to empty data set
    courseSolidDataset = setThing(courseSolidDataset, toBeUpdated);

    //if not create new data set at container - url to be specified
    const savedSolidDataset = await saveSolidDatasetInContainer(
      exampleSolidDatasetURL,
      courseSolidDataset,
      { fetch: session.fetch }
    ).then((result) => {
      console.log("newly generated and uploaded dataset: ", result);
    });
  }
  document.getElementById(
    "labelWriteStatus"
  ).textContent = `Uploaded ${uploadedFile} and set itendifier to ${documentValue}, end date to ${endDateValue}, description to ${descriptionValue} successfully!`;
  document.getElementById("labelWriteStatus").setAttribute("role", "alert");
}

// Upload file into the targetContainer.
async function placeFileInContainer(file, targetContainerURL) {
  console.log("file name: ", file.name);
  try {
    const savedFile = await saveFileInContainer(
      targetContainerURL, // Container URL
      file, // File
      { slug: file.name, contentType: file.type, fetch: session.fetch }
    );
    console.log(`File saved at ${getSourceUrl(savedFile)}`);

    return getSourceUrl(savedFile);
  } catch (error) {
    console.error(error);
  }
}


async function queryFiles(){
// specify url from where you want to call data. In this case folder as you need to check if ttl file already exists
const exampleSolidDatasetURL = session.info.webId.split("profile")[0];

let checkDataSetForTTL = await getSolidDataset(
  exampleSolidDatasetURL,
  { fetch: session.fetch } // fetch function from authenticated session
);
    function checkTtl() {
        const ttlExists = [];
        //get all things in dataset
        const items = getThingAll(checkDataSetForTTL);
        for (item of items) {
          //check if item ends with ttl if yes push
          if (item.url.slice(-3) == "ttl") {
            ttlExists.push(item.url);
          }
        }
        return ttlExists;
      }
    
      //even if several ttl exist we use always the first one - no reason for this. easiest solution
      const ttl = checkTtl()[0];

if(!ttl){
    document.getElementById(
        "labelQueryData"
      ).textContent = `No Data Found To Be Queried`;
      document.getElementById("labelQueryData").setAttribute("role", "alert");

}else{
   const myDataset = await getSolidDataset(
        ttl,
        { fetch: session.fetch } // fetch function from authenticated session
      );

    const allThingsDataSet = getThingAll(myDataset)
    console.log(allThingsDataSet);
    
    let documentValue = document.getElementById("queryDocument").value;
    console.log(documentValue);
    function queryDataSet(){
        let matches = []
        for(item of allThingsDataSet){
         if(getStringNoLocaleAll(item, "http://schema.org/identifier") == documentValue){
             matches.push(item.url)
         }
       }
        return matches
    }
   const queriedData = queryDataSet()

   if(queriedData.length > 0){
    document.getElementById(
        "labelQueryData"
      ).textContent = `Found the following matches for ${documentValue}: ${queriedData.join(', ')}`;
      document.getElementById("labelQueryData").setAttribute("role", "alert");

   }else{
    document.getElementById(
        "labelQueryData"
      ).textContent = `No Matches Found For ${documentValue}`;
      document.getElementById("labelQueryData").setAttribute("role", "alert");

   }
      console.log("matches Found: ", queriedData[0]);
}

}

buttonLogin.onclick = function () {
  login();
};

writeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleFiles();
});

queryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    queryFiles();
  });


