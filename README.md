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

This document is intended to be a crash course to get you up and running. The [PASS wiki](https://github.com/codeforpdx/PASS/wiki) is the place to go for detailed information of all things PASS including contribution guidelines, tech stack, information on SOLID, etc...

PASS is currently in development working towards MVP release by generous efforts from [our contributors](https://github.com/codeforpdx/PASS/graphs/contributors).

## Contents

1. [Setup Instructions](#1-quick-setup-instructions)
2. [Project Overview](#2-project-overview)
3. [Contribution Guidelines](#3-contribution-guidelines)
4. [Code of Conduct](#4-code-of-conduct)
5. [PASS Wiki](#5-pass-wiki)

## 1. Quick Setup Instructions

 **Note**: All commands in this document are for bash. If you are using an incompatible shell like CMD or powershell, you may need to use different commands. 

- ### Getting the Code 

1. Clone the git repository:

   ```bash
   git clone https://github.com/codeforpdx/PASS.git
   ```
2. Enter the project folder:
    ```bash
    cd PASS
    ```

- ### Setting up Node

_If you already have node 18 installed on your system, you may skip this section._

Currently, we require Node version 18.19.x and NPM for our package manager. We recommend using Node Version Manager (NVM) to install Node and npm. To proceed using NVM, perform the following:

1. Download NVM for your system.

- For Mac, Linux, and other POSIX users: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
- For Windows users: [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

2. If you don't have node version 18, install node version 18 by running:
   ```bash
   nvm install 18
   ```
   This will download node 18 and set it up for use 
3. Check that node and npm are set up:

   ```bash
   node -v
   ```

   ```bash
   npm -v
   ```
The node version should be 18.19 (and maybe third decimal) and the npm version should be 10.2 (and maybe a third decimal). If they are not these versions, or if either of those commands cause an error, node has not been installed correctly.

4. We include a `.nvmrc` in the root folder of the project, which contains our target node version. We update this version periodically. If you're ever not sure of what node version you should be using, run 
   ```bash
   nvm use 
   ```
   to be synced with the project. You may receive warning messages in the terminal if the verion is not installed. Follow the messages to resolve the issues.

- ### Set Up and Run the Project

1. Install project dependencies:

   ```bash
   npm install
   ```

2. Configure the project environment:
    ```bash
    cp env.template .env
    ```

3. Run the following command:
    ```bash
    npm start
    ```
    To start up everything needed to run PASS.

4. Navigate to PASS and set up an account.

    By default, PASS launches at [http://localhost:5173](http://localhost:5173) on your local machine. Navigate to that screen, then click the signup button to create a pod and web ID for yourself. Then return to the homepage and log in. Follow all prompts that appear, and you will be up and running with PASS!

- ### Setting up Git Hooks for development

We require all code contributed to the project to pass through our git hooks. To set them up, do the following:

1. Install the pre-commmit prettier and linter hooks.

   ```bash
   npm run prepare
   ```

## 2. Project Overview

In Portland, housing-insecure individuals struggle to maintain documents often required to receive government and/or non-profit services. With PASS, we are building out an application to enable housing-insecure individuals to store their personal documents in decentralized data stores, called Pods. PASS will also provide a platform for organizations to assist with providing and processing documents required for housing assistance. Using [Solid Data Pods](https://solidproject.org/) individuals will have control over which organizations and applications can access their data. Verified organizations will be able to use PASS to request data from an individual and/or add documents (such as references or invoices) to an individual's Pod to help process housing assistance applications.

## 3. Contribution Guidelines

- Start by checking out the detailed onboarding [in the Wiki](https://github.com/codeforpdx/PASS/wiki/Development#contribution-guidelines).
- Join our [Discord](https://discord.gg/Ts923xaUYV) and self-assign roles as you see fit. [![Discord](https://img.shields.io/discord/1068260532806766733)](https://discord.gg/Ts923xaUYV)
- Request git-hub access on Discord in the [github-access-request](https://discord.com/channels/1068260532806766733/1078124139983945858) channel of the General category.

## 4. Code of Conduct

- [CODEPDX code of conduct](https://github.com/codeforpdx/codeofconduct/blob/master/README.md)

## 5. PASS Wiki
[Visit the wiki for more information on every aspect of the project. Feature set, architecture, tooling, etc](https://github.com/codeforpdx/PASS/wiki)

**[⬆️ Back to Top](#pass---personal-access-system-for-services)**
