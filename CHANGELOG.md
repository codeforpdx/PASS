# Changelog

## v0.0.5 (May 28, 2023)

## Features

- Generate user outbox on log in if outbox does exist in user's Solid Pod (#186)
- Allow users to choose different Solid Identity Providers when using PASS (#167)
- Render user messages from their Solid inbox on PASS (#148)

## Fixes

- Corrected type in CrossPodWriteForm to use Upload instead of Search (#183)
- Included corrections to JSDoc comments (#148, #179, #183, #184)

## Dev Changes

- Created function to generate an outbox container for users if it doesn't exist in their Solid Pod (#186)
- Refactored set permission forms to pass in Access Object as a parameter to setDocAclPermission function (#183)
- Updated all relevant components/functions using createDocAclForUser with new setDocAclForUser function (#183)
- Optimized session-core functions (#183)
- Included new JSDoc for new barcode scanner functions (#179)
- Updated clearDoc.js and .gitignore to accomedate for new ZXing_barcaode.md (#179)
- Updated/Enhanced UI for Footer, Inactivity Notification, and several Form components (#166, #172, #178, #180)
- Organized utils directory into 4 subdirectories and rerouted import paths (#171)
- Replaced removeKeys function with localStorage.clear (#167)
- Included new unit tests for components and functions (#167, #183)
- Replaced previous Login component with OidcLoginComponent (#167)
- Created new test directory to store unit tests (#167)
- Generate loading text for when user messages are being loaded from Solid (#148)
- Removed types.d.ts in favor of better written JSDoc comments (#148)
- Created new React Context and components for rendering inbox messages (#148)
- Created new getInboxMessageTTL function to pull messages from Solid as JSON from TTLs (#148)

## Others

- Updated GitHub Actions to have lints and unit tests separate from building (#181)
- Updated GitHub Actions to run newer GitHub Actions workflows and correct node version (#181)
- Included new technical documentation for barcode scanner (#179)

---

## v0.0.4 (May 19, 2023)

## Features

- Upload Driver's License into Solid through a barcode scanner (#139)
- Included cryptographically secure signatures to documents (#137)
- Included new Inbox for PASS to allow users to send messages as TTL files (#128)
- Included checksum for uploaded files on Solid Pods via PASS (#123)
- Major UI updates with Material UI, including NavBar, Footer, Login, LogoutModal, etc. (#107, #111, #116, #118, #141, #154, #166)
- Created new Footer component for PASS (#118)
- Included inactivity notification popup that appears after 3 minutes of inactivity (#101)
- Included ability to perform cross-pod uploading/updating of files in another user's Documents container if given access (#97)
- Included permissions setting to a dedicated Documents container on user's Solid Pod (#97)

## Fixes

- Fixed routing to /Documents/Drivers%20License/ for user's Pod by removing apostrophe from string during upload (#157)
- Minor bug fix for state.verifyFile (#157)
- Fixed pathing for Prettier and ESLint in scripts (#114, #122)
- Fixed typings for userListObject in JSDoc (#100)
- Created caching for npm dependencies (#97)
- Updating corrupted package-lock file from repo (#96)

## Dev Changes

- Refactored handleLogout and eventlisteners for inactivity notification (#166)
- Refactored Navbar with MUI components (#156)
- Refactored form submission for file uploads (#145)
- Updating configuration for ESLint (#127)
- Included linter as part of GitHub Actions (#123)
- Created dedicated directory for constants and schemas called constants (#123)
- Replacing BrowserRouter with HashRouter for compatibility issues with GitHub Pages (#103)
- Begin incorporating Material UI libraries to existing build with inactivity popup (#101)

## Others

- Included new GitHub Actions workflow to add PASS project to issue on creation (#156)
- Created local dev server, node scripts, and local .env for Community Solid Server (#106)

---

## v0.0.3 (April 25, 2023)

## Features

- Included basic dialog modal for logout confirmation (#85)
- Allow users to log back into PASS when browser is accidentally refreshed when users have not explicitly logged out (#81)

## Fixes

## Dev Changes

- Functions and components for users list is refactored to loaded asynchronously from one another (#84)
- Moved Router from App.jsx to index.jsx (#81)
- Created useEffect for "session restore" with PASS, current solution involves a workaround that logs users into a new Solid session when browser refreshes (#81)
- Refactored UserSection, Login, and Forms component to include AppHeader (#81)
- Replaced routerContext with custom useRedirectUrl hook (#81)
- Streamlined and simplified routing with React Router (#81)

## Others

- Included dependencies for rollup-plugin-visualizer to check on production build bundle size locally
- Removed the following unused dependencies from package.json: @inrupt/solid-client-authn-browser, buffer, eslint-config-node, eslint-plugin-node, jsdoc-tsimport-plugin, string_decoder

---

## v0.0.2 (April 7, 2023)

## Features

- Developed a basic navbar for navigating between user list (i.e. home screen) and handle document forms when logged in (#74)
- Created login tracker to keep track of user's last active date from PASS (#74)
- Added ability for users to select other users from the user list (#74)
- Created a user list and the ability for users to add/remove users from said list and save this information on their Pod (#74)
- Added ability to update user's ttl file on their Pod if they're updating a document (#71)
- Added ability to update user's file on their Pod (#70)
- Added confirmation window for updating user file on their Pod (#70)

## Fixes

- Fixed typo for input elements in Form component relating to file upload (#65)

## Dev Changes

- Introduced routing to PASS in preparation for dedicated pages different functionalities in the application (#74)
- Created React Contexts for user list, selected user, and browser routing (#74)
- Reorganized session-core with multiline comments separating major functional sections (#74)
- New components has been created for user list and its functionalities (#74)
- uploadDocument function also renames ttl file to 'document.ttl' (#70)
- Refactored UploadDocumentForm to perform both uploadDocument and updateDocument functions (#70)
- Added updateDocument function in session-core.js for updating documents on user's Pod (#70)
- Included typedefs.js to define type definitions for JSDoc (#70)
- Refactored FormSection to include section title instead of inside its children component (#66)
- Reformatted JSDoc to follow recommended linting rules from ESLint plugin for JSDoc (#66)

## Others

- Correcting typos and typing for JSDoc (#70, #74)
- Deployed PASS to GitHub Pages with the link [https://codeforpdx.github.io/PASS/](https://codeforpdx.github.io/PASS/) (domain name will change in future updates) (#59)

---

## v0.0.1 (March 18, 2023)

## Features

- Added guard rails that prevent users from removing access to their own containers on Solid (#56)
- Added button disabling when processing upload/search/delete features to Solid Pod (#54)
- Added linting and formatting through ESLint and Prettier (#48)
- Added permission setting via Access Control List (or ACL) file by users (#38)
- Added cross-pod searching from one user to another (#38)
- Migrated PASS from vanilla JS to React.js (#19)
- Added upload/search/delete features to Solid Pod using Inrupt's JS/React libraries (#6, #19)
- Added login/logout features to PASS (#6, #19)

## Fixes

- Corrected HTML id property in JSX for Logout.jsx (#52)
- Corrected typo for GitHub Actions configuration file (#42)

## Dev Changes

- Refactored Form components with new FormSection component (#56)
- Included CHANGELOG for PASS project to root directory (#56)
- Refactored SessionProvider to index.jsx instead of App.jsx (#40)

## Others

- Automated GitHub build process using GitHub Actions (#31, #41)
- Reorganized project file structure with README, CONTRIBUTING, and /docs/README (#26)
- Included PASS' React Documentation to /docs (#24, #32, #33, #45)
- Included README and CONTRIBUTING for PASS project to root directory (#18)
