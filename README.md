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

PASS is currently in development working towards MVP release by generous efforts from [our contributors](https://github.com/codeforpdx/PASS/graphs/contributors
).

## Contents

1. [Setup Instructions](#1-setup-instructions)
2. [Project Overview](#2-project-overview)
3. [Contribution Guidelines](#3-contribution-guidelines)
4. [Code of Conduct](#4-code-of-conduct)

## 1. Setup Instructions

- ### Prerequisites

  Currently, we require Node version 16.20.2 and NPM for our package manager. We recommend managing node and npm using Node Version Manager (NVM). To do so:

1. Download NVM for your system.

- For Mac, Linux, and other POSIX users: <https://github.com/nvm-sh/nvm>
- For Windows users: <https://github.com/coreybutler/nvm-windows>

2. Install node version 18.19.0:

   ```
   nvm install 18.19.0
   ```

3. Use that node version:

   ```
   nvm use 18.19.0
   ```

4. Check that node and npm are set up:

   ```
   node -v
   npm -v
   ```

   The node version should be 18.19.0 and the npm version should be 10.2.3. If they are not these versions, or if either of those commands cause an error, node has not been installed correctly.

- ### Clone and Install Dependencies

1. Clone the git repository:

   ```
   git clone https://github.com/codeforpdx/PASS.git
   ```

2. Install project dependencies:

   ```
   npm install
   ```

3. Install the pre-commmit prettier, linter, and test hooks.

   ```
   npm run prepare
   ```

4. Run the project:

   ```
   npm run dev
   ```

5. PASS should launch at `http://localhost:5173`. You can now visit that url, and sign into a Pod hosted at the OIDC provider of your choice.

- ### Setting up a Development Pod Server

![PASS Solid Server Opening Pod Set-up Screen](https://github.com/codeforpdx/PASS/blob/576-README.md-and-Wiki-Getting-Started-Update/wiki-assets/images/community-solid-server-welcom-screen-small.png)

  PASS is able to connect to any solid-spec compliant Pod server. However, for testing, it's recommended that you run a server locally. PASS provides tools to make this easy to do.

1. Clone and install dependencies. [See previous section](#clone-and-install-dependencies)

2. In the project's root directory, copy the `env.template` file into a `.env` file. In bash you can use this command:

   ```bash
   cp env.template .env
   ```

3. Run `npm run podserver` to launch the Pod server. The server will begin listening on `http://localhost:3000`, and will create a folder in the PASS project folder called `local_temp_server_files`. You can find all server and Pod files there.

4. Open a browser and navigate to `http://localhost:3000`. You should encounter a screen asking you to set up the server and create an account. Create your first account, and your server will be ready for development.

5. Launch PASS with `npm run dev`. Click the `Login` button on the home page. If everything has been set up right, you should be redirected to your local Pod server to finish login.

Note: The `npm run podserver` command will launch a server that stores documents on your local file system. If you don't want to store documents, and want all server data to be deleted on shutdown, you can run `npm run podserver:temp`

## 2. Project Overview

In Portland, housing-insecure individuals struggle to maintain documents often required to receive government and/or non-profit services. With PASS, we are building out an application to enable housing-insecure individuals to store their personal documents in decentralized data stores, called Pods. PASS will also provide a platform for organizations to assist with providing and processing documents required for housing assistance. Using [Solid Data Pods](https://solidproject.org/) individuals will have control over which organizations and applications can access their data. Verified organizations will be able to use PASS to request data from an individual and/or add documents (such as references or invoices) to an individual's Pod to help process housing assistance applications.

## 3. Contribution Guidelines

- Start by checking out the detailed onboarding [in the Wiki](https://github.com/codeforpdx/PASS/wiki/Development#contribution-guidelines).
- Join our [Discord](https://discord.gg/Ts923xaUYV) and self-assign roles as you see fit. [![Discord](https://img.shields.io/discord/1068260532806766733)](https://discord.gg/Ts923xaUYV)
- Request git-hub access on Discord in the [github-access-request](https://discord.com/channels/1068260532806766733/1078124139983945858) channel of the General category.

## 4. Code of Conduct

- [Code for PDX code of conduct](https://github.com/codeforpdx/codeofconduct/blob/master/README.md)

**[⬆️ Back to Top](#pass---personal-access-system-for-services)**
