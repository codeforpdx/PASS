# PASS Tech Stack & Development Resources

[![Javascript](https://badges.aleen42.com/src/javascript.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.JS](https://badges.aleen42.com/src/node.svg)](https://nodejs.org/en)
[![NPM](https://badges.aleen42.com/src/npm.svg)](https://www.npmjs.com/)
[![React](https://badges.aleen42.com/src/react.svg)](https://react.dev/)
[![Vite](https://badges.aleen42.com/src/vitejs.svg)](https://vitejs.dev/)
[![ESLint](https://badges.aleen42.com/src/eslint.svg)](https://eslint.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Git-Hub](https://badges.aleen42.com/src/github.svg)](https://github.com/codeforpdx/PASS)
[![Discord](https://badges.aleen42.com/src/discord.svg)](https://discord.com/)
[![Google Meet](https://img.shields.io/badge/Google%20Meet-00897B?style=for-the-badge&logo=google-meet&logoColor=white)](https://meet.google.com/)
[![Material UI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
<a href="https://solidproject.org"><img src="https://solidproject.org/assets/img/solid-emblem.svg" alt="SolidProjectIcon" width="18" height="18"> Solid Project
<a href="https://www.inrupt.com/"><img src="https://docs.inrupt.com/inrupt-logo-small.svg" alt="InruptIcon" width="18" height="18"> Inrupt(solid library)
🗒️  [JSDoc](https://jsdoc.app/)

---

  ![tech stack](https://drive.google.com/uc?id=1Vkn9hGlSyv6Y9tY_R6SfEGoj5MJTGDDy)

---
## Design Board
  - [Figma Design Board](https://www.figma.com/file/BfsGjGbFUVvtqNq18sykoY/Pass-Project?type=design&node-id=1216-2986&mode=design) contains UX design for the PASS project.

## Additional Resources

- [Google Slide intro to data management with solid](https://docs.google.com/presentation/d/1eMMB0Wd6lWin4BJPK4Vv3xwqAqVyURhvRlD8oxNi-3s/edit?usp=sharing)
- [Solid Data Pods](https://solidproject.org/developers/tutorials/getting-started)
- [Inrupt](https://docs.inrupt.com/developer-tools/javascript/client-libraries/) provides JavaScript client libraries to help developers create Solid applications. Will be used to upload and query data in pods. Data will be stored in `ttl` files.
- [Inrupt Access Requests and Grants](https://docs.inrupt.com/ess/latest/security/access-requests-grants/)
- [Access Authorization](https://solid.github.io/data-interoperability-panel/specification/#access-authorization%E2%91%A0) to a pod.
- [rdf-and-ttl](https://www.w3.org/TR/turtle/)
- [Using jsDocs in PASS](README.md)

   The Resource Description Framework (RDF) is a framework for expressing information about resources. Resources can be anything, including documents, people, physical objects, and abstract concepts. RDF is intended for situations in which information on the Web needs to be processed by applications, rather than being only displayed to people. Read more about RDF [here](https://www.w3.org/TR/rdf11-primer/). See how RDF is used within Solid [here](https://solidproject.org/developers/vocabularies/well-known/core).

   There is a textual syntax for RDF called Turtle that allows an RDF graph to be completely written in a compact and natural text form, with abbreviations for common usage patterns and data types.

   With PASS we are using RDF to link between pods and store metadata in turtle files. We are implementing ttl files enabling organizations to query into an individuals pod to see if certain documents are present, while restricting access to the documents themselves.

## Introductory PASS Readings

- [PASS Vision, Problem and Solution Statement](https://docs.google.com/document/d/1mK4-nFlpRtnsbDAuoDgSo3Fsoi2_JDfMyU4nuBjnAMo/edit?usp=share_link)
- [PASS Team, Scheduled Meetings and Current Tasks](https://docs.google.com/document/d/19U2QseBXbv_KmWSAjZvch5n-5L5E66dxPuUTiytDi3I/edit?usp=share_link)
- [PASS User Flow](https://docs.google.com/presentation/d/18tU0o2jW6bZUt8ayMk1Uju3Fe52O4hVl2Ii2JGmiORQ/edit?usp=share_link)
- [PASS Architecture](https://docs.google.com/document/d/19v5D-nhSGQYrjMkck64w0jmCgQtLcHQhUcmvJzUkbhg/edit?usp=share_link)

## Similar Projects

- [My Digital Data Locker](https://vimeo.com/mddl) — a similar project in Baltimore. [More info](https://www.aecf.org/blog/new-digital-data-locker-may-help-people-find-stable-housing). [GitHub](https://github.com/newamericafoundation/MDDL).
- [AWS Kiip Digital Locker](https://vimeo.com/762041743) — a similar project using AWS.
- [Digita](https://www.digita.ai/) — Brussels start-up providing Enterprise Pods to the Flemish government. 
- Also, read this [On-boarding with Solid](https://medium.com/@JacksonMorgan/the-full-complexity-of-onboarding-with-solid-7aeaa842358) article to help wrap your head around Solid infrastructure.
