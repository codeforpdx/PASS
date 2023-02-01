# PASS

PASS Project - React Migration Test

This repository branch contains a bare-bones demo of:

1. Logging into user's Pod
2. Creating data entered through a form and store them in user's Pod

The current build is made with React 18 from the original packages from jk/solidPodBoilerplate. New additions to package.json besides React include only react-dom. The current build is not built with create-react-app (CRA). Instead it's bundled with Parcel, in line with previous versions of this project.

As of this demo (Feb 1, 2023), @inrupt/solid-ui-react has not been tested in any of the component. All features are developed with existing @inrupt/solid* packages the previous package.json. CSS class names and id are lightly modified to accommodate for React. The existing CSS file has not been touched.

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

Latest version of demo requires login from pod at [https://opencommons.net](https://opencommons.net)
