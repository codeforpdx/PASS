
<h1 id="PASS">PASS - Personal Access System for Services </h2>

[![License](https://img.shields.io/github/license/codeforpdx/PASS)](https://github.com/codeforpdx/PASS/blob/Master/LICENSE)
[![Discord](https://img.shields.io/discord/1068260532806766733)](https://discord.gg/Ts923xaUYV)
[![Pull Requests](https://img.shields.io/github/issues-pr/codeforpdx/PASS)](https://github.com/codeforpdx/PASS/pulls)
[![Issues](https://img.shields.io/github/issues/codeforpdx/PASS)](https://github.com/codeforpdx/PASS/issues)
[![Commits](https://img.shields.io/github/commit-activity/m/codeforpdx/PASS)](https://github.com/codeforpdx/PASS/commits/Master)
[![Build status](https://github.com/codeforpdx/pass/actions/workflows/ci.yml/badge.svg)](https://github.com/codeforpdx/pass/actions?query=workflow%3ABuild)
![Top Language](https://img.shields.io/github/languages/top/codeforpdx/PASS)
[![Contributors](https://img.shields.io/github/contributors/codeforpdx/pass)](https://github.com/codeforpdx/PASS/graphs/contributors)
![Latest Commit](https://img.shields.io/github/last-commit/codeforpdx/PASS/Development)
# Table of Contents

1.  [Setup Instructions](#setup-instructions)
2.  [Project Overview](#project-overview)
       - [Terminology](#terminology) 
       - [User Flows](#user-flows)
3.  [Contribution Guidelines](#contribution-guidelines)
4.  [Contributors](#contributors)
5.  [Tech Stack](#tech-stack)
6.  [Additional Resources](#additional-resources)
       - [RDF and TTL](#rdf-and-ttl)

---
<h2 id="setup-instructions">1.🔧 Setup Instructions </h2>

   Currently we require Node version 16 or higher and NPM for our package manager.  Most places recommend using a node version manager to install node and npm. To proceed using NVM perform the following..

1. Clone the git repository: `git clone https://github.com/codeforpdx/PASS.git`
2. Download NVM for your system. Find instructions here: https://github.com/nvm-sh/nvm
3. Install node version 16: `nvm install 16`
4. Use that node version: `nvm use 16`
5. Check that node and npm are set up:
  `node -v`
  `npm -v`
If either of those commands error, node has not been installed correctly.
1. Install project dependencies: `npm install`
2. Run the project: `npm run dev`
3. PASS should launch at `http://localhost:5173`. You can now visit that url, and sign into a pod hosted at the OIDC provider of your choice.

---

<h2 id="project-overview">2. 🚧 Project Overview </h2>


In Portland, housing insecure individuals struggle to maintain documentats often required to receive government and/or non-profit services. With PASS, we are building out an application to enable housing insecure individuals to store their personal documents in decentralized data stores, called Pods. Pass will also provide a platform for Organizations to assist with providing and processing documents required for housing assistance. Using [Solid Data Pods](https://solidproject.org/) individuals will have control over which organizations and applications can access their data. Verified organizations will be able to use PASS to request data from an individual and/or add documents (such as references or invoices) to an individuals pod to help process housing assistance applications.

<h3 id="terminology">🗣️ Terminology</h2>

- Individual/Client - housing insecure person using services to interact with organizations.
- Organization - housing agencies, landlords, government agencies that will be requesting information from individuals.
- Pod/Wallet - decentralized data/document storage built with Solid API. Individuals and organizations will have certain functionality within their pods.
- Folder/Container - referring to the URI location of document data in ttl files using Solid API with Inrupt library.
- ACL - Access Control List is used to manage Solid Pods by allowing users to control who can access and modify their data.

<h3 id="user-flows">🔀 User Flows</h2>


1. Individual/Client
   - Upload and Maintain Documents
   - Able to share documents
   - Can copy verified documents into pod from organization(s)
   - Messaging to organizations
2. Organization
   - Can request and review documents
   - Can create verified documents
   - Can place files into clients pod with permission
   - Able to share verified documents with clients
   - Will have several users per organization


- User registers for a WebID (similar to an email address)
- User data remains in their pod (which is associated to WebID)
- User authorizes applications and other users to read/write/control data in pod

**[⬆️ Back to Top](#PASS)**

---

<h2 id="contribution-guidelines">3. 🧑‍💻 Contribution Guidelines</h2>

-  Start by checking out the detailed on-boarding [CONTRIBUTING.MD](CONTRIBUTING.md).
-  Join our [Discord](https://discord.gg/Ts923xaUYV). [![Discord](https://img.shields.io/discord/1068260532806766733)](https://discord.gg/Ts923xaUYV)
-  Request git-hub access on Discord in the github-access-request channel of the General category.
  
**[⬆️ Back to Top](#PASS)**

---

<h2 id="tech-stack">4. 🧪 Tech Stack</h2>

- ![tech stack](https://drive.google.com/uc?id=1hvs0XKI0hfdlGOJ_oRG-MqQTR9NCtmPy)
-  [![Javascript](https://badges.aleen42.com/src/javascript.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
-  [![Node.JS](https://badges.aleen42.com/src/node.svg)](https://nodejs.org/en)
-  [![NPM](https://badges.aleen42.com/src/npm.svg)](https://www.npmjs.com/)
-  [![React](https://badges.aleen42.com/src/react.svg)](https://react.dev/)
-  [![ESLint](https://badges.aleen42.com/src/eslint.svg)](https://eslint.org/)
-  [![Vite](https://badges.aleen42.com/src/vitejs.svg)](https://vitejs.dev/)
-  [![Git-Hub](https://badges.aleen42.com/src/github.svg)](https://github.com/codeforpdx/PASS)
-  [![Discord](https://badges.aleen42.com/src/discord.svg)](https://discord.com/)
-  [![Google Meet](https://img.shields.io/badge/Google%20Meet-00897B?style=for-the-badge&logo=google-meet&logoColor=white)](https://meet.google.com/)
-  [![Material UI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
-  <a href="https://solidproject.org"><img src="https://solidproject.org/assets/img/solid-emblem.svg" alt="SolidProjectIcon" width="18" height="18"> Solid Project
- <a href="https://www.inrupt.com/"><img src="https://docs.inrupt.com/inrupt-logo-small.svg" alt="InruptIcon" width="18" height="18"> Inrupt(solid library)
-  <a href="https://eslint.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/ESLint_logo.svg/324px-ESLint_logo.svg.png?20211012234406" alt="SolidProjectIcon" width="18" height="18"> ESLint
- 🗒️  [JSDoc](https://jsdoc.app/)

**[⬆️ Back to Top](#PASS)**

---

<h2 id="contributors">5. 💻 Contributors</h2>

| Development Team | UI Team     | UX Team     | Project Management Team |
| ---------------- | ----------- | ----------- | ----------------------- |
| Jared K. \*      | Andy W. \*  | Gabby P. \* | Florian S. \*           |
| Kevin M.         | Scott B. \* | Kyle B. \*  | Danica B. \*            |
| Ka Hung L. \*    | Zack        | Laura U. \* | Wilfred P. \*           |
| Greg W.          | Nicholas G. | Shelby P.   | Katharine               |
| Emily S.         |             |             |                         |
| Ben C. \*        |             |             |                         |
| Tim S. \*        |             |             |                         |
| Brian H. \*      |             |             |                         |
| Georgia          |             |             |                         |
| Natalie M.       |             |             |                         |
| Grac F.          |             |             |                         |

\* Active Contributors

**[⬆️ Back to Top](#PASS)**

---

<h2 id="Additional Resources">6. 📀Additional Resources</h2>

- [Solid Data Pods](https://solidproject.org/developers/tutorials/getting-started)
- [Inrupt](https://docs.inrupt.com/developer-tools/javascript/client-libraries/) provides JavaScript client libraries to help developers create Solid applications. Will be used to upload and query data in pods. Data will be stored in `ttl` files.
- [Inrupt Access Requests and Grants](https://docs.inrupt.com/ess/latest/security/access-requests-grants/)
- [Access Authorization](https://solid.github.io/data-interoperability-panel/specification/#access-authorization%E2%91%A0) to a pod.
- [`solid-ui-react`](https://solid-ui-react.docs.inrupt.com/?path=/story/intro--page), a React library to make development with Solid simple(ish).
  
- [rdf-and-ttl](https://www.w3.org/TR/turtle/)

   The Resource Description Framework (RDF) is a framework for expressing information about resources. Resources can be anything, including documents, people, physical objects, and abstract concepts. RDF is intended for situations in which information on the Web needs to be processed by applications, rather than being only displayed to people. Read more about RDF [here](https://www.w3.org/TR/rdf11-primer/). See how RDF is used within Solid [here](https://solidproject.org/developers/vocabularies/well-known/core).

   There is a textual syntax for RDF called Turtle that allows an RDF graph to be completely written in a compact and natural text form, with abbreviations for common usage patterns and datatypes. Read more on the Turtle spec [here](https://www.w3.org/TR/turtle/)

   With PASS we are looking into using RDF to link between pods and store metadata in turtle files. We are exploring the use of ttl files to enable organizations to query into an individuals pod to see if certain documents are present, while restricting access to the documents themselves.

**[⬆️ Back to Top](#PASS)**




