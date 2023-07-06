# Contributing to PASS

## Contents
1. [Project Summary](#1-project-summary)
2. [Tech Stack & Resources](#2-tech-stack--resources)
3. [Code of Conduct](#3-code-of-conduct)
4. [Connect With the Team](#4-connect-with-the-team)
5. [Development Process](#5-development-process)
    - [Choosing an Issue](#choosing-an-issue)
    - [Clone the Repo](#clone-the-repo)
    - [Submitting a Pull Request]()
    - [Bug Reporting](#bug-reporting-template)
    - [Requesting Product Enhancement](#requesting-product-enhancement)
    - [Testing](#testing)
    - [Code Styling/Linting](#code-stylinglinting)
  
  The development process is still being written in collaboration with active devs
## 1. Project summary

PASS is a decentralized application to enable home insecure individuals to electronically securely store their documents. Verified organizations seeking documentation from individuals will utilize PASS to request and review documents from individuals, as well as share documents with individuals. Individuals will need to grant permission to organizations before they can access documents allowing them to always remain in control of their data.

## 2. Tech Stack & Resources

can be found in [Resources.md](./RESOURCES.md)

## 3. Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md). Please make sure to read and understand it before contributing. (code of conduct subject to change)

## 4. Connect With the Team

-  Join [Code for PDX Discord](https://discord.gg/FEX9KUMH). If you run into any issues, shoot an email to our CodeForPDX brigade leader, Hugh: Hugh@codeforpdx.org or join the discord and drop a message in [introductions](https://discord.com/channels/1068260532806766733/1075286322530484256) or [general-chat](https://discord.com/channels/1068260532806766733/1068260535080063028).
-  (optional) Say hello in [introductions](https://discord.com/channels/1068260532806766733/1075286322530484256) take make the team aware of your presence. 
-  Post your GitHub name in the [**#github-access-request**](https://discord.com/channels/1068260532806766733/1078124139983945858) channel and we’ll add you to our [GitHub](https://github.com/codeforpdx/PASS). We keep track of technical and non-technical tasks in [GitHub Projects](https://github.com/orgs/codeforpdx/projects/3).
- Introduce yourself and post your email in the [**#pass**](https://discord.com/channels/1068260532806766733/1075285803137257544) channel so we can add you to our [Google Drive](https://drive.google.com/drive/u/0/folders/1zTEd34K7Eg7rvg71zS6Uzbwrsct2Lx9E?ths=true). You can also request access privately from Flo -- florian@codeforpdx.org.
-  Pass is composed of three teams: UX/UI, Project Management, and Developers (back and front end). We are currently meeting in separate groups based on team member availability. The development team meets virtually every Tuesday at 7pm via Google Meet. Bi-weekly in person full group meetings are also back in session!!(details in discord)
-  Reach out to Flo (Project Manager) on Discord or florian@codeforpdx.org to introduce yourself and share how you wish to contribute.
-  Our developers will occasionally hang out in the [PASS voice chat](https://discord.com/channels/1068260532806766733/1106779713793433730) on Discord while working on the project. If you ever see people in there, feel free to hop in and ask questions. Consider it office hours.

## 5. Development Process

- ## Choosing an Issue
1. Search through open [issues](https://github.com/codeforpdx/PASS/issues)
2. Find an issue that interests you
3. Check if someone is currently working on that issue and if a [pull request](https://github.com/codeforpdx/PASS/pulls) exists.
- ## Clone the repo

1. Clone repo to local environment in IDE of choice. If you are new to Git/GitHub ou can also check out [this article](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) for a broad overview.
   - Open terminal & change working directory to the location you want the repository cloned to.
   - `git clone https://github.com/codeforpdx/PASS.git` [learn more about git clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository?platform=linux)
   - `git remote add origin https://github.com/codeforpdx/PASS.git` [learn more about git remote](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories)

2. Setup instructions to locally run PASS can be found in the [readme](../README.md)

3. Create a new branch to work on your feature:
    - `git checkout -b <your branch name> Development` [learn more about git branches](https://www.atlassian.com/git/tutorials/using-branches/git-checkout)
    - `git pull origin Development` - to sync with PASS Development branch


4. Work on feature in your own branch.

5. When ready, push up for review:
   - `git push origin <your branch name>`

- Good people to ping for reviews:
  - Development -- Jared K, Ka Hung L., Kevin M., Tim S., Scott B.
  - Documentation -- Danica, Florian(flo), Jared K
- Include screenshots whenever you’re building a frontend feature.
  
6. Make a pull request ⬇️

- ## Submitting a Pull Request
   If you are new to GitHub and/or the team, feel free to make your first pull request on the README/Contributing documentation to familiarize yourself with the project and GitHub. Add any comments and/or feedback and request reviews.
1. Make a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/requesting-a-pull-request-review) to the `Development` branch. Request reviews from members of the team - you’ll need their approval to merge. \*\*Make sure to close your branch once merged.
- ## Bug Reporting Template
  Bugs are reported via the git-hub built in issues for the repo https://github.com/codeforpdx/PASS/issues. 

  Provide general introduction to the issue logging and why it is relevant. 

```
**Context**
[provide more detailed introduction to the issue itself and why it is relevant]

**Process**
[ordered list the process to finding and recreating the issue, example below]
- User goes to delete a dataset (to save space or whatever)
- User gets popup modal warning
- User deletes and it's lost forever

**Expected result**
[describe what you would expect to have resulted from this process]

**Current result**
[describe what you you currently experience from this process, and thereby explain the bug]

**Possible Fix**
[not obligatory, but suggest fixes or reasons for the bug]

Modal tells the user what dataset is being deleted, like “You are about to delete this dataset: car_crashes_2014.”
A temporary "Trashcan" where you can recover a just deleted dataset if you mess up (maybe it's only good for a few hours, and then it cleans the cache assuming you made the right decision).

**if relevant, include a screenshot**
name of issue screenshot
```

- ## Requesting Product Enhancement

- ## Testing

- ## Code Styling/Linting

**[⬆️ Back to Top](#contributing-to-pass)**