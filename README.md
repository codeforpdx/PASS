# PASS

PASS Project - React Experimental Build

This repository branch is an experimental build for the PASS project using React. It contains a demo of:

1. Logging into user's Pod
2. Creating data entered through a form and store them in user's Pod
3. Querying specific document from user's Pod if data exist (i.e. .ttl file exist for named document)
4. Deleting specific document from user's Pod if data exist (i.e. .ttl file exist for named document)
5. Logout the user

The current build is made with React 18 from the original packages from jk/solidPodBoilerplate. New additions to package.json besides React includes only react-dom, react-redux, redux-thunk, and Redux Toolkit (RTK). The current build is not built with create-react-app (CRA), instead, it's bundled with Parcel, in line with previous versions of this project.

As of this build (Feb 10, 2023), @inrupt/solid-ui-react has not been tested in any of the components. All features are developed with existing @inrupt/solid\* packages the previous package.json. CSS class names and id are lightly modified in JSX to accommodate for React. The existing CSS file has been lightly modified to use font family Arial as default.

To get a running version of this demo on a local client, clone from this branch and run the following to install node dependencies:

```shell
npm install
```

After installing the dependencies from package.json, run the following to start a local live server for the demo:

```shell
npx parcel ./src/index.html
```

The local live server would be located in port 1234, open it on a browser to view the demo:

```shell
http://localhost:1234/
```

Latest version of this build require users to login to their Pod through [https://opencommons.net](https://opencommons.net)
