# PASS - Personal Access System for Services

<img src ="./public/pass-logo.png" width="175">

[![License](https://img.shields.io/github/license/codeforpdx/PASS)](https://github.com/codeforpdx/PASS/blob/Master/LICENSE)
[![Discord](https://img.shields.io/discord/1068260532806766733)](https://discord.gg/Ts923xaUYV)
[![Pull Requests](https://img.shields.io/github/issues-pr/codeforpdx/PASS)](https://github.com/codeforpdx/PASS/pulls)
[![Issues](https://img.shields.io/github/issues/codeforpdx/PASS)](https://github.com/codeforpdx/PASS/issues)
[![Commits](https://img.shields.io/github/commit-activity/m/codeforpdx/PASS)](https://github.com/codeforpdx/PASS/commits/Master)
[![Build status](https://github.com/codeforpdx/pass/actions/workflows/ci.yml/badge.svg)](https://github.com/codeforpdx/pass/actions?query=workflow%3ABuild)
![Top Language](https://img.shields.io/github/languages/top/codeforpdx/PASS)
[![Contributors](https://img.shields.io/github/contributors/codeforpdx/pass)](https://github.com/codeforpdx/PASS/graphs/contributors)
![Latest Commit](https://img.shields.io/github/last-commit/codeforpdx/PASS/Development)

Welcome! 👋👋🏿👋🏽👋🏻👋🏾👋🏼

PASS is an open source digital wallet for providing home insecure individuals a safe place to store documents within their control. PASS additionally aims to assist caseworkers with processing and providing documents needed to complete the housing assistance application process.

PASS is currently in Development heading towards [Minimum Viable Product](./docs/ROADMAP.md)

## Contents

1.  [Setup Instructions](#1-setup-instructions)
2.  [Project Overview](#2-project-overview)
    - [Terminology](#terminology)
    - [Features and usage](#features-and-usage)
3.  [Contribution Guidelines](#3-contribution-guidelines)
4.  [Contributors](#4-contributors)
5.  [Tech Stack and Additional Resources](#5-tech-stack)
6.  [Code of Conduct](#6-code-of-conduct)

---

## 1. Setup Instructions

- ### Prerequisites

  Currently we require Node version 16 or higher and NPM for our package manager. Most places recommend using a node version manager to install node and npm. To proceed using NVM perform the following..

1. Download NVM for your system.

- For Mac, Linux, and other POSIX users: https://github.com/nvm-sh/nvm
- For Windows users: https://github.com/coreybutler/nvm-windows

2. Install node version 16:
   ```
   nvm install 16
   ```
3. Use that node version:
   ```
   nvm use 16
   ```
4. Check that node and npm are set up:
   ```
   node -v
   npm -v
   ```
   If either of those commands error, node has not been installed correctly.

- ### Clone and Install Dependencies

1. Clone the git repository:
   ```
   git clone https://github.com/codeforpdx/PASS.git
   ```
2. Install project dependencies:
   ```
   npm install
   ```
3. Run the project:
   ```
   npm run dev
   ```
4. PASS should launch at `http://localhost:5173`. You can now visit that url, and sign into a pod hosted at the OIDC provider of your choice.

- ### Setting up a Development Pod Server
  PASS is able to connect to any solid-spec compliant pod server. However, for testing, it's recommended that you run a server locally. PASS provides tools to make this easy to do.

1. Clone and install dependencies. [See previous section](#clone-and-install-dependencies)

2. In the project's root directory, copy the `env.template` file into a `.env` file. In bash you can use this command:

   ```bash
   cp env.template .env
   ```

3. Run `npm run podserver` to launch the pod server. The server will begin listening on `http://localhost:3000`, and will create a folder in the PASS project folder called `local_temp_server_files`. You can find all server and pod files there.

4. Open a browser and navigate to `http://localhost:3000`. You should encounter a screen asking you to set up the server and create an account. Create your first account, and your server will be ready for development.

5. Launch PASS with `npm run dev`. Click the `Login` button on the home page. If everything has been set up right, you should be redirected to your local pod server to finish login.

Note: The `npm run podserver` command will launch a server that stores documents on your local file system. If you don't want to store documents, and want all server data to be deleted on shutdown, you can run `npm run podserver:temp`

Further information can be found in [CONTRIBUTING.md](./docs/CONTRIBUTING.md) & [docs/README.md](./docs/README.md)

**[⬆️ Back to Top](#pass---personal-access-system-for-services)**

---

## 2. Project Overview

In Portland, housing insecure individuals struggle to maintain documents often required to receive government and/or non-profit services. With PASS, we are building out an application to enable housing insecure individuals to store their personal documents in decentralized data stores, called Pods. PASS will also provide a platform for Organizations to assist with providing and processing documents required for housing assistance. Using [Solid Data Pods](https://solidproject.org/) individuals will have control over which organizations and applications can access their data. Verified organizations will be able to use PASS to request data from an individual and/or add documents (such as references or invoices) to an individuals pod to help process housing assistance applications.

### Terminology

- Individual/Client - housing insecure person using services to interact with organizations.
- Organization - housing agencies, landlords, government agencies that will be requesting information from individuals.
- Pod/Wallet - decentralized data/document storage built with Solid API. Individuals and organizations will have certain functionality within their pods.
- Folder/Container - referring to the URI location of document data in ttl files using Solid API with Inrupt's library.
- ACL - Access Control List is used to manage Solid Pods by allowing users to control who can access and modify their data.

### Features and Usage

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
- User authorizes applications and other users to read/write/control data in pod
- User data remains in their pod (which is associated to WebID)
- Full product road map [here](docs/ROADMAP.md)

**[⬆️ Back to Top](#pass---personal-access-system-for-services)**

---

## 3. Contribution Guidelines

- Start by checking out the detailed on-boarding [CONTRIBUTING.md](./docs/CONTRIBUTING.md).
- Join our [Discord](https://discord.gg/Ts923xaUYV) and self assign roles as you see fit. [![Discord](https://img.shields.io/discord/1068260532806766733)](https://discord.gg/Ts923xaUYV)
- Request git-hub access on Discord in the [github-access-request](https://discord.com/channels/1068260532806766733/1078124139983945858) channel of the General category.

**[⬆️ Back to Top](#pass---personal-access-system-for-services)**

---

## 4. Contributors

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

---

## 5. Tech Stack

- Details on tech used and additional resources in [resources.md](./docs/RESOURCES.md)

## 6. Code of Conduct

- [Code for PDX code of conduct](https://github.com/codeforpdx/codeofconduct/blob/master/README.md)

**[⬆️ Back to Top](#pass---personal-access-system-for-services)**
