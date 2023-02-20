# PASS

PASS Project - React Migration Test

This repository branch contains a bare-bones demo of:

1. Log into a user's Pod
2. Upload files through a form and store them in the user's Pod
3. Query for specific document from user's Pod if file exist (i.e. .ttl file exist for specific document type)
4. Delete specific document from user's Pod if file exist (i.e. .ttl file exist for specific document type)
5. Logout the user

The current build is made with React 18 from the original packages from jk/solidPodBoilerplate. New additions to package.json besides React include only react-dom. The current build is not built with create-react-app (CRA). Instead it's bundled with Parcel, in line with previous versions of this project.

As of this demo (Feb 7, 2023), @inrupt/solid-ui-react has not been tested in any of the components. All features are developed with existing @inrupt/solid\* packages the previous package.json. CSS class names and id are lightly modified in JSX to accommodate for React. The existing CSS file has been lightly modified to use font family Arial as default.

To get a running version of this demo, clone from this branch and run:

```shell
npm install
```

After installing the dependencies from package.json, run the following to start a local live server:

```shell
npx parcel ./src/index.html
```

The local live server would be located in port 1234:

```shell
http://localhost:1234/
```

Latest version of demo require user login to Pod at [https://opencommons.net](https://opencommons.net)
