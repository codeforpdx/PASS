# Changelog

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
