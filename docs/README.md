# PASS

## PASS Project - React Documentation

This repository branch contains a ported version of the PASS project using React. Currently, this build can:

1. Log into a user's Pod
2. Upload files through a form and store them in the user's Pod
3. Query for specific document from user's Pod if file exist (i.e. .ttl file exist for specific document type)
4. Delete specific document from user's Pod if file exist (i.e. .ttl file exist for specific document type)
5. Logout the user

Newer features like Cross Pod interactions for querying and/or writing new files has yet to be implemented. However, components for these features are present as placeholders at this time.

## State of Build

The current build is made with React 18 and bundled with Vite. The solid-ui-react library has been incorporated to the application along with Solid's other client libraries (see CONTRIBUTING.md for links to solid react and client library documentation). CSS class names and id are lightly modified in JSX to accommodate for React and CSS-in-JS features (primarily React's style attribute) has been included. The existing CSS file has also been lightly modified to use font family Arial as default.

Documentation for the build is located under the docs directory and can be accessed locally using the follow command in the terminal:

```shell
npx serve docs
```

The local live server link to the documentation will be located at:

```shell
http://localhost:3000/
```

New documentation could be added via JSDoc syntax and produced by running the following npm script in the root directory:

```shell
npm run docs
```

Documentation for cross pod components has yet to be documented.

## How to get this running locally

To get a running version of this branch, clone from this branch into a directory and run the following within the directory containing the package.json:

```shell
npm install
```

After installing the dependencies from package.json, run the following to start a local live server to view the application:

```shell
npm run dev
```

The local live server would be located in port 5173:

```shell
http://localhost:5173/
```

Latest version of this build require users to login to their Pod through [https://opencommons.net](https://opencommons.net)
