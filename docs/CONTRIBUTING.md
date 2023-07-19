# Contributing to PASS

## Contents

1. [Project Summary](#1-project-summary)
2. [Tech Stack & Resources](#2-tech-stack--resources)
3. [Code of Conduct](#3-code-of-conduct)
4. [Connect With the Team](#4-connect-with-the-team)
5. [Development Process](#5-development-process)
    - [Choosing an Issue](#choosing-an-issue)
    - [Clone the Repo](#clone-the-repo)
    - [Submitting a Pull Request](#submitting-a-pull-request)
    - [Bug Reporting Template](#bug-reporting-template)
    - [Requesting A Feature](#requesting-a-feature)
    - [Enhancement Request](#enhancement-request)
    - [Unit Testing](#unit-testing)
    - [Code Styling/Linting](#code-stylinglinting)
  
## 1. Project summary

PASS is a decentralized application aiming to enable home insecure individuals to electronically securely store their documents. Verified organizations seeking documentation from individuals will utilize PASS to request and review documents from individuals, as well as share documents with individuals. Individuals will need to grant permission to organizations before they can access documents allowing them to always remain in control of their data.

## 2. Tech Stack & Resources

Located in [Resources.md](./RESOURCES.md)

## 3. Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md). Please make sure to read and understand it before contributing. (code of conduct subject to change post Code For America re-branding)

## 4. Connect With the Team

-  Join [Code for PDX Discord](https://discord.gg/uwqrPpyuap). If you run into any issues, email our CodeForPDX brigade leader, Hugh: Hugh@codeforpdx.org or join the discord and drop a message in [introductions](https://discord.com/channels/1068260532806766733/1075286322530484256) or [general-chat](https://discord.com/channels/1068260532806766733/1068260535080063028).
-  Post your GitHub name in the [**#github-access-request**](https://discord.com/channels/1068260532806766733/1078124139983945858) channel and we’ll add you to our [GitHub](https://github.com/codeforpdx/PASS). We keep track of technical and non-technical tasks in [GitHub Projects](https://github.com/orgs/codeforpdx/projects/3).
- Introduce yourself and post your email in the [**#pass**](https://discord.com/channels/1068260532806766733/1075285803137257544) channel so we can add you to our [Google Drive](https://drive.google.com/drive/u/0/folders/1zTEd34K7Eg7rvg71zS6Uzbwrsct2Lx9E?ths=true). You can also request access privately from Flo -- florian@codeforpdx.org.
-  Pass is composed of three teams: UX/UI, Project Management, and Developers (back and front end). We are currently meeting in separate groups based on team member availability. The development team meets virtually every Tuesday at 7pm via Google Meet. Bi-weekly in person full group meetings are also back in session!!(details in discord).
-  Reach out to Flo (Project Manager) on Discord or florian@codeforpdx.org to introduce yourself and share how you wish to contribute.
-  Our developers will occasionally hang out in the [PASS voice chat](https://discord.com/channels/1068260532806766733/1106779713793433730) on Discord while working on the project. If you ever see people in there, feel free to hop in and ask questions. Consider it office hours.

## 5. Development Process

- ## Choosing an Issue
  
1. Search through open [issues](https://github.com/codeforpdx/PASS/issues).
2. Find an issue that interests you.
3. Check if someone is currently working on that issue and if a [pull request](https://github.com/codeforpdx/PASS/pulls) exists.
4. Assign yourself to issue and leave a comment stating your intentions.
  
- ## Clone the repo

1. Clone repo to local environment in IDE of choice. If you are new to Git/GitHub you can also check out [this article](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) for a broad overview.
   - Open terminal & change working directory to the location you want the repository cloned to.
   - `git clone https://github.com/codeforpdx/PASS.git` [learn more about git clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository?platform=linux)
   - `git remote add origin https://github.com/codeforpdx/PASS.git` [learn more about git remote](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories)

2. Setup instructions to locally run PASS can be found in the [readme](../README.md).

3. Create a new branch to work on your feature (We recommend doing this via terminal) Branches should all be based off of `Development`:
    
    A. `git checkout -b <your branch name> Development` [learn more about git branches](https://www.atlassian.com/git/tutorials/using-branches/git-checkout) using the recommended naming convention:`<issue number><branch name>` with a concise title.
      > Example: `112/delete-client-modal`

    B. `git pull origin Development` - to sync with PASS Development branch
  
  > This can also be done directly from an issue in GitHub with the following three steps(Default branch is Master and will need to be changed to Development). If done manually via command line, link branch to corresponding GitHub issue.
  >
  > A. Create a branch by clicking `create a branch` under Development within the issues page.
  >
  >  <img src="https://drive.google.com/uc?id=11zUuOYSkv8K0CJE_snet12YSdyLDKP8q" width="200"/>

  > B. Select `change branch source`.
  >
  >  <img src="https://drive.google.com/uc?id=1ciU2NgtAjkEx3Pi5FnzxNxDjw0KkZXF-" width="200">

  > C. Select Development as the base branch.
  >
  >  <img src="https://drive.google.com/uc?id=1rqRkau7lxTVEcwRFc8NcHRf-Z4U_lVxb" width="200">

  - Work on feature in your own branch.

  - When ready, push to GitHub in terminal: `git push origin <your branch name>`
    
1. Code Styling/Linting

   Linting and formatting for this project has also been setup using ESlint and Prettier. They are included as dependencies and will be installed while following the instructions of the readme. To lint your changes with ESLint follow the instructions [here](./README.md#linting)

- ## Submitting a Pull Request
  
   If you are new to GitHub and/or the team, feel free to make your first pull request on the README/Contributing documentation to familiarize yourself with the project and GitHub. Add any comments and/or feedback and request reviews.

-  Make a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/requesting-a-pull-request-review) to the `Development` branch. Request reviews from members of the team - you’ll need their approval to merge. \*\*Make sure to close your branch once merged.

- Recommended reviewers:
  - Development -- Jared K, Ka Hung L, Kevin M, Tim S, Scott B
  - Documentation -- Jared K, Ka Hung L
  - Include screenshots whenever you’re building a frontend feature.

- ## Bug Reporting Template
  
  - Bugs are reported via the GitHub built-in issues page for the repository https://github.com/codeforpdx/PASS/issues. 
  - Current bug reporting template can be found [here](../.github/ISSUE_TEMPLATE/bug_report.md) and will automatically populate when creating an issue in GitHub.

  Provide information requested in the template.

- ## Requesting a Feature
  
  - Features are requested via the GitHub built-in issue page for the repository https://github.com/codeforpdx/PASS/issues.
  - Current feature request template can be found [here](../.github/ISSUE_TEMPLATE/feature_request.md) and will automatically populate when creating an issue in GitHub.

- ## Enhancement Request

  - Enhancements are requested via the GitHub built-in issues page for the repository https://github.com/codeforpdx/PASS/issues. 
  - Current bug reporting template can be found [here](../.github/ISSUE_TEMPLATE/enhancement_request.md) and will automatically populate when creating an issue in GitHub.
  
- ## Unit Testing 
  
   *UNDER CONSTRUCTION🚧*
  - All PASS unit tests are done with [Vitest](https://vitest.dev/).
  - In Vitest, tests are simply async functions that throw errors for failures.
  - To run all repository unit tests `npm run test`
  - To run a single test `npm run test "<filename>.test.js"` 
    > Example: `npm run test "navBar.test.js"`

**[⬆️ Back to Top](#contributing-to-pass)**