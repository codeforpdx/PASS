import {
  saveFileInContainer,
  getSourceUrl,
  getSolidDataset,
  saveSolidDatasetInContainer,
  // getStringWithLocale,
  getStringNoLocaleAll,
  getThingAll,
  saveSolidDatasetAt,
  buildThing,
  createSolidDataset,
  createThing,
  setThing,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { rdf } from "@inrupt/solid-client/dist/constants";
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";

// If your Pod is *not* on `solidcommunity.net`, change this to your identity provider.
const SOLID_IDENTITY_PROVIDER = "https://solidcommunity.net";

// forcing the id of "solid_identity_provider" to https://solidcommunity.net
document.getElementById(
  "solid_identity_provider"
).innerHTML = `[<a target="_blank" href="${SOLID_IDENTITY_PROVIDER}">${SOLID_IDENTITY_PROVIDER}</a>]`;

// https://docs.inrupt.com/developer-tools/api/javascript/solid-client-authn-node/classes/Session.html#constructor  ;
// session object constructor is called and assigned to session constant;
const session = new Session();

const buttonLogin = document.getElementById("btnLogin");
const writeForm = document.getElementById("writeForm");
const queryForm = document.getElementById("queryData");

// 1a. Start Login Process. Call login() function from session class;
// https://docs.inrupt.com/developer-tools/api/javascript/solid-client-authn-browser/classes/Session.html#login  ;
async function login() {
  if (!session.info.isLoggedIn) {
    await session.login({
      oidcIssuer: SOLID_IDENTITY_PROVIDER, //users identity provider
      redirectUrl: window.location.href, //  url to redirect to after log in, in this case its current page URL;
      // NOT COMPLETED: clientName is trying to display the app name upon login;
      // clientName: "PASS",
    });
  }
}

// 1b. Login Redirect. Call handleIncomingRedirect() function from session class;
// after login, finish the process by retrieving session information;
// https://docs.inrupt.com/developer-tools/api/javascript/solid-client-authn-browser/classes/Session.html#handleincomingredirect  ;
async function handleRedirectAfterLogin() {
  // window.location.href refers to current page URL;
  await session.handleIncomingRedirect(window.location.href);
  // isLoggedIn:boolean
  if (session.info.isLoggedIn) {
    // changes the text of the labelStatus <p> to logged in webID;
    document.getElementById(
      "labelStatus"
    ).innerHTML = `Your session is logged in with the WebID [<a target="_blank" href="${session.info.webId}">${session.info.webId}</a>].`;
    document.getElementById("labelStatus").setAttribute("role", "alert");
    // populates fields for write and query by removing hidden attribute from divs;
    document.getElementById("write").removeAttribute("hidden");
    document.getElementById("query").removeAttribute("hidden");
    console.log(`session info: ${session.info.webId.split("profile")[0]}`);
  }
}

// Function defined above is invoked causing re-direct to index.html;
// If function is called when not part of the login redirect, the function is a no-op;
handleRedirectAfterLogin();

// 2. Write to profile;
// https://docs.inrupt.com/developer-tools/api/javascript/solid-client-authn-node/classes/Session.html#info  ;
async function handleFiles() {
  // assigning string https://USERNAME.solidcommunity.net/ to const, replace username with unique webId;
  const MY_POD_URL = session.info.webId.split("profile")[0];
  // assigning fileList to first item placed in input field through browser;
  const fileList = document.getElementById("input_file").files[0];
  // assigning end date from form value;
  let endDateValue = document.getElementById("date").value;
  // assigning description from form value;
  let descriptionValue = document.getElementById("description").value;
  // assigning selected identifier / document type from form;
  let documentValue = document.getElementById("document").value;
  // logs the file added through input_file HTML form;
  console.log(fileList);

  // assigning function to upload file, provide file from HTML input defined above and url where to upload;
  // function placeFileInContainer is defined below, so by the laws of javascript top down this confuses me but it works probably because its async;
  const uploadedFile = await placeFileInContainer(fileList, `${MY_POD_URL}`);

  // assigning url from where you want to call data. In this case folder as you need to check if ttl file already exists;
  // this is declared in more than one place, not sure why just yet, doesn't seem like it needs function scope but I'll check that later;
  const exampleSolidDatasetURL = session.info.webId.split("profile")[0];

  // https://docs.inrupt.com/developer-tools/api/javascript/solid-client/modules/resource_solidDataset.html#getsoliddataset  ;
  let checkDataSetForTTL = await getSolidDataset(
    // takes in the URL to fetch a SolidDataset from;
    exampleSolidDatasetURL,
    { fetch: session.fetch } // fetch function from authenticated session returns a promise resolving to dataset or rejecting if failed;
  );

  // check if ttl file is already existing or not. If file exists you will append the existing ttl file;
  // if none exist you need to create a new data set;
  function checkTtl() {
    const ttlExists = [];
    // get all things in dataset;
    // https://docs.inrupt.com/developer-tools/api/javascript/solid-client/modules/thing_thing.html#getthingall  ;
    const items = getThingAll(checkDataSetForTTL);
    for (item of items) {
      //check if item ends with ttl if yes push;
      if (item.url.slice(-3) == "ttl") {
        ttlExists.push(item.url);
      }
    }
    return ttlExists;
  }

  // even if several ttl exist we use the first one - no reason for this. easiest solution for consistency;
  const ttl = checkTtl()[0];

  // end date and description are not mandatory, if there is no date set default values;
  if (endDateValue.length < 1) {
    endDateValue = "12/12/1212";
  }
  // if there is no description value set it to the string;
  if (descriptionValue.length < 1) {
    descriptionValue = "No Description provided";
  }

  // create thing for document you just uploaded;
  // https://docs.inrupt.com/developer-tools/api/javascript/solid-client/modules/thing_build.html#buildthing  ;
  // createThing is imported from solid-inrupt-client;
  // https://docs.inrupt.com/developer-tools/api/javascript/solid-client/modules/thing_thing.html#creatething  ;
  const toBeUpdated = buildThing(createThing({ name: uploadedFile }))
    // set identifier, enddate and description. Using noLocale preserves existing values;
    // https://docs.inrupt.com/developer-tools/api/javascript/solid-client/modules/thing_add.html#addstringnolocale  ;
    .addStringNoLocale(SCHEMA_INRUPT.name, uploadedFile)
    .addStringNoLocale(SCHEMA_INRUPT.identifier, documentValue)
    .addStringNoLocale(SCHEMA_INRUPT.endDate, endDateValue)
    .addStringNoLocale(SCHEMA_INRUPT.description, descriptionValue)
    // final call to build() returns a cloned thing with updated values;
    .build();

  // logging the 0th index ttl file in the console;
  console.log("TTL url ", ttl);
  // empty var;
  let myDataset;
  if (ttl) {
    // if ttl exists get ttl and assign to myDataSet;
    // https://docs.inrupt.com/developer-tools/api/javascript/solid-client/modules/resource_solidDataset.html#getsoliddataset  ;
    myDataset = await getSolidDataset(
      ttl,
      { fetch: session.fetch } // fetch function from authenticated session;
    );
    console.log("called orginal dataset: ", myDataset);
    //get thing you want to update by specifying the url of the file and run against the whole dataset;

    // update dataset with thing;
    myDataset = setThing(myDataset, toBeUpdated);

    // save dataset;
    ///////////////////// this function is not called;
    // https://docs.inrupt.com/developer-tools/api/javascript/solid-client/modules/resource_solidDataset.html#savesoliddatasetat  ;
    const savedSolidDataset = await saveSolidDatasetAt(
      ttl,
      exampleSolidDatasetURL,
      myDataset,
      { fetch: session.fetch }
    ).then((result) => {
      console.log("new dataset: ", result);
    });
    /////////////////////
  } else {
    // if not ttl exists first create data set;
    // https://docs.inrupt.com/developer-tools/api/javascript/solid-client/modules/resource_solidDataset.html#createsoliddataset ;
    let courseSolidDataset = createSolidDataset();

    // add thing to empty data set;
    courseSolidDataset = setThing(courseSolidDataset, toBeUpdated);

    // if not create new data set at container - url to be specified;
    // https://docs.inrupt.com/developer-tools/api/javascript/solid-client/modules/resource_solidDataset.html#savesoliddatasetincontainer
    ///////////////////// this function is not called;
    const savedSolidDataset = await saveSolidDatasetInContainer(
      exampleSolidDatasetURL,
      courseSolidDataset,
      { fetch: session.fetch }
    ).then((result) => {
      console.log("newly generated and uploaded dataset: ", result);
    });
    /////////////////////
  }
  document.getElementById(
    "labelWriteStatus"
  ).textContent = `Uploaded ${uploadedFile} and set identifier to ${documentValue}, end date to ${endDateValue}, description to ${descriptionValue} successfully!`;
  document.getElementById("labelWriteStatus").setAttribute("role", "alert");
}

// Upload file into the targetContainer;
// this function is used above as var uploadedFile;
async function placeFileInContainer(file, targetContainerURL) {
  console.log("file name: ", file.name);
  try {
    const savedFile = await saveFileInContainer(targetContainerURL, file, {
      slug: file.name,
      contentType: file.type,
      fetch: session.fetch,
    });
    console.log(`File saved at ${getSourceUrl(savedFile)}`);
    // https://docs.inrupt.com/developer-tools/api/javascript/solid-client/modules/resource_resource.html#getsourceurl  ;
    return getSourceUrl(savedFile);
  } catch (error) {
    console.error(error);
  }
}

async function queryFiles() {
  // specify url from where you want to call data. In this case folder as you need to check if ttl file already exists;
  // const exampleSolidDatasetURL = session.info.webId.split("profile")[0];

  let checkDataSetForTTL = await getSolidDataset(
    exampleSolidDatasetURL,
    { fetch: session.fetch } // fetch function from authenticated session
  );
  function checkTtl() {
    const ttlExists = [];
    //get all things in dataset;
    const items = getThingAll(checkDataSetForTTL);
    for (item of items) {
      //check if item ends with ttl if yes push;
      if (item.url.slice(-3) == "ttl") {
        ttlExists.push(item.url);
      }
    }
    return ttlExists;
  }

  //even if several ttl exist we use always the first one - no reason for this. easiest solution;
  const ttl = checkTtl()[0];
  // if no tt is found display text below  and set attributes listed to html;
  if (!ttl) {
    document.getElementById(
      "labelQueryData"
    ).textContent = `No Data Found To Be Queried`;
    document.getElementById("labelQueryData").setAttribute("role", "alert");
  } else {
    // otherwise retrieve the dataset and append to variable;
    const myDataset = await getSolidDataset(
      ttl,
      { fetch: session.fetch } // fetch function from authenticated session;
    );

    // https://docs.inrupt.com/developer-tools/api/javascript/solid-client/modules/thing_thing.html#getthingall  ;
    const allThingsDataSet = getThingAll(myDataset);

    console.log(allThingsDataSet);

    let documentValue = document.getElementById("queryDocument").value;
    console.log(documentValue);
    function queryDataSet() {
      let matches = [];
      for (item of allThingsDataSet) {
        if (
          getStringNoLocaleAll(item, "http://schema.org/identifier") ==
          documentValue
        ) {
          matches.push(item.url);
        }
      }
      return matches;
    }

    const queriedData = queryDataSet();

    if (queriedData.length > 0) {
      document.getElementById(
        "labelQueryData"
      ).textContent = `Found the following matches for ${documentValue}: ${queriedData.join(
        ", "
      )}`;
      document.getElementById("labelQueryData").setAttribute("role", "alert");
    } else {
      document.getElementById(
        "labelQueryData"
      ).textContent = `No Matches Found For ${documentValue}`;
      document.getElementById("labelQueryData").setAttribute("role", "alert");
    }
    console.log("matches Found: ", queriedData);
  }
}

buttonLogin.onclick = function () {
  console.log("logging in");
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

/////////// for sparql query test not done yet;
let testQuery = document.getElementById("testQuery");
let queryResult = testQuery.innerHTML;
///////////
