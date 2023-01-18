import {
  saveFileInContainer,
  getSourceUrl,
  getSolidDataset,
  saveSolidDatasetInContainer,
  getStringNoLocale,
  getStringNoLocaleAll,
  getUrlAll,
  getThingAll,
  saveSolidDatasetAt,
  buildThing,
  createSolidDataset,
  createThing,
  setThing,
  createContainerAt,
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

// variables for HTML form fields;
const buttonLogin = document.getElementById("btnLogin");
const writeForm = document.getElementById("writeForm");

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
    // once logged in removes hidden attributes from HTML fields displaying form fields;
    document.getElementById("write").removeAttribute("hidden");
    console.log(`session info: ${session.info.webId.split("profile")[0]}`);
  }
}

// Function defined above is invoked causing re-direct to index.html;
// If function is called when not part of the login redirect, the function is a no-op;
handleRedirectAfterLogin();

// functions for buttons defined at start of program;
buttonLogin.onclick = function () {
  console.log("logging in");
  login();
};

writeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleFiles();
});
