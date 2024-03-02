# PASS - Personal Access System for Services

<picture> <source media="(prefers-color-scheme: dark)" srcset="https://github.com/codeforpdx/PASS/wiki/assets/images/PASSLogodarkmode.png" width="50"> <source media="(prefers-color-scheme: light)" srcset="https://github.com/codeforpdx/PASS/wiki/assets/images/PASSLogolightmode.png
" width="50"> <img alt="PASS logo"> </picture>

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

PASS is an open source digital wallet for providing home-insecure individuals a safe place to store documents within their control. PASS additionally aims to assist caseworkers with processing and providing documents needed to complete the housing-assistance application process.

The [PASS wiki](https://github.com/codeforpdx/PASS/wiki) contains detailed information of all things PASS including contribution guidelines, tech stack, information on SOLID, etc...

PASS is currently in development working towards MVP release by generous efforts from [our contributors](https://github.com/codeforpdx/PASS/graphs/contributors).

## Contents

1. [Setup Instructions](#1-setup-instructions)
2. [Project Overview](#2-project-overview)
3. [Contribution Guidelines](#3-contribution-guidelines)
4. [Code of Conduct](#4-code-of-conduct)

## 1. Quick Setup Instructions

- ### Prerequisites

Currently, we require Node version 18.19.x and NPM for our package manager. We recommend using Node Version Manager (NVM) to install Node and npm. To proceed using NVM, perform the following:

1. Download NVM for your system.

- For Mac, Linux, and other POSIX users: <https://github.com/nvm-sh/nvm>
- For Windows users: <https://github.com/coreybutler/nvm-windows>

2. If you don't have node version 18, install node version 18 by running:
   ```
   nvm install 18
   ```
3. With nvm, nvm will read the .nvmrc file from the root directory to use the latest version of node version 18. So run:
   ```
   nvm use 18
   ```
   To explicitly use node version 18.
4. Check that node and npm are set up:

   ```bash
   node -v
   ```

   ```bash
   npm -v
   ```

The node version should be 18.19.x and the npm version should be 10.2.3. If they are not these versions, or if either of those commands cause an error, node has not been installed correctly.

- ### Clone and Install Dependencies

1. Clone the git repository:

   ```bash
   git clone <https://github.com/codeforpdx/PASS.git>
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```
   
- ### Setting up a Development Pod Server

  PASS is able to connect to any solid-spec compliant Pod server. However, for testing, it's recommended that you run a server locally. PASS provides tools to make this easy to do.

1. Navigate to the project root directory. If you have not already done so, clone and install dependencies. [See previous section](#clone-and-install-dependencies)

2. Copy the `env.template` file into a `.env` file. In bash you can use this command:

   ```bash
   cp env.template .env
   ```

- ### Launching a Development Podserver

1. Launch the development podserver with:

   ```
   npm run podserver
   ```

This will launch the pod server. The server will begin listening on `http://localhost:3000`, and will create a folder in the PASS project folder called `local_temp_server_files`. You can find all server and Pod files there.

Note: The `npm run podserver` command will launch a server that stores documents on your local file system. If you don't want to store documents, and want all server data to be deleted on shutdown, you can run `npm run podserver:temp`

2. Open a browser and navigate to `http://localhost:3000`. You should get a "Community Solid Server" screen. In the "Getting started as a _user_." section, click on the "Sign up for an account."

3. You'll be taken to an "Create Account" screen. Create a new Podserver account by inputting an email, password and confirm password in those fields, and then click on the "Register" button at the bottom.

4. You'll be taken to another "Community Solid Server" page for "Your account." The email login you just registered should be in the "Email/password logins" section at the top.

5. In the "Pods" section on that page, click the "Create pod" link.

6. This will take you to another "Create account" page for the Podserver. Fill in the "Name" field with whatever name for the Pod you wish.

7. Below that, click the radio button for "Use the WebID in the Pod and register it to your account," unless you're testing with an external WebID you already have, in which case, click the "Use an external WebID" radio button and input that external WebID in that field. Once that is all filled in, click the "Create pod" button at the bottom.

8. You'll be taken to a screen that has "Your new Pod" and "Your new WebID" and the URLs for each. Note these down to use for your login to the PASS web site.

- ### Launching PASS

1. Install the pre-commmit prettier, linter, and test hooks.

   ```
   npm run prepare
   ```

2. Run the project:

   ```
   npm run dev
   ```

3. PASS should launch at <http://localhost:5173>.

4. Once you visit that url, click the `Login` button on the home page to your local Pod server to finish login, using the WebID you just authorized from above, click the "Remember this client" checkbox, and click the "Authorize" buton. if everything has been set up right, you should be logged into your local Pod server and logged into your local PASS page.

- ### Setting up PASS with Development Solid Server

To simplify the development process, the library `concurrently` is included as part of our development environment. Thus, you could run `npm run start` to start both the development server for PASS and the local Solid server without the need to run two separate terminal windows.

## 2. Project Overview

In Portland, housing-insecure individuals struggle to maintain documents often required to receive government and/or non-profit services. With PASS, we are building out an application to enable housing-insecure individuals to store their personal documents in decentralized data stores, called Pods. PASS will also provide a platform for organizations to assist with providing and processing documents required for housing assistance. Using [Solid Data Pods](https://solidproject.org/) individuals will have control over which organizations and applications can access their data. Verified organizations will be able to use PASS to request data from an individual and/or add documents (such as references or invoices) to an individual's Pod to help process housing assistance applications.

## 3. Contribution Guidelines

- Start by checking out the detailed onboarding [in the Wiki](https://github.com/codeforpdx/PASS/wiki/Development#contribution-guidelines).
- Join our [Discord](https://discord.gg/Ts923xaUYV) and self-assign roles as you see fit. [![Discord](https://img.shields.io/discord/1068260532806766733)](https://discord.gg/Ts923xaUYV)
- Request git-hub access on Discord in the [github-access-request](https://discord.com/channels/1068260532806766733/1078124139983945858) channel of the General category.

## 4. Code of Conduct

- [Code for PDX code of conduct](https://github.com/codeforpdx/codeofconduct/blob/master/README.md)

**[⬆️ Back to Top](#pass---personal-access-system-for-services)**
