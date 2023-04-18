# Changelog

## v0.0.3 (April 16, 2023)

## Features

- Included basic dialog modal for logout confirmation (#85)
- Allow users to log back into PASS when browser is accidentally refreshed when users have not explicitly logged out (#81)
- (Coming soon) Major UI updates with Material UI (#75)

## Fixes

## Dev Changes

- Functions and components for users list is refactored to loaded asynchronously from one another (#84)
- Moved Router from App.jsx to index.jsx (#81)
- Created useEffect for "session restore" with PASS, current solution involves a workaround that logs users into a new Solid session when browser refreshes (#81)
- Refactored UserSection, Login, and Forms component to include AppHeader (#81)
- Replaced routerContext with custom useRedirectUrl hook (#81)
- Streamlined and simplified routing with React Router (#81)

## Others

- Included dependencies for rollup-plugin-visualizer to check build bundle size
- (Coming soon) Merging UI with existing functionality (#75)

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
