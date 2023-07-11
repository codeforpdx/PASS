# PASS

## State of Build/Tech Stack

The current build is made with React 18 for the front-end and bundled using Vite. We have incorporated Inrupt's Javascript libraries for Solid into the application. See [RESOURCES.md](RESOURCES.md). Several node scripts have been setup for ease of development, namely for linting, formatting, and generating JSDoc documentation for the React version of the application. Vitest and jsdom are libraries being used for unit tests.

## PASS Terminal Commands 💻
To generate the full React development documentation of the application locally, the following command can be ran:

```shell
npm run docs
```
---

This will create the documentation within /docs via JSDoc. The documentation could easily be accessed locally by running:

```shell
npx serve docs
```
---

A local live server link to the documentation will be prepared at:

```shell
http://localhost:3000/
```
---

To clear the documentation from /docs, you can simply run the following command:

```shell
npm run docs:clear
```

This will clear all, but /docs/README.md and /docs/ZXING_barcode.md from your branch.

---

## Linting

Linting and formatting for this project has also been setup using ESlint and Prettier. To lint your changes with ESLint, you can run:

```shell
npm run lint
```
---

To fix potential lint errors, you can run:

```shell
npm run lint:fix
```
---

You can also check the formatting of the existing code using Prettier by running:

```shell
npm run prettier:check
```
---

This will enable Prettier to check if the existing code follows the rules for this project in .prettierrc.js. To format the project with existing Prettier settings, simply run:

```shell
npm run prettier:run
```

## Run PASS locally ⚙️

To get a running version of this branch, clone from this branch into a directory and run the following within the directory containing the package.json:

```shell
npm install
```
---

After installing the dependencies from package.json, run the following to start a local live server to view the application:

```shell
npm run dev
```
---

The local live server would be located in port 5173 and with the following URL:

```shell
http://localhost:5173/PASS/
```

From here you can access Solid servers online.

## Running with a local server ⚙️

PASS includes some dev tools that allow you to run a SOLID pod on your local machine for testing instead of an online provider.
To do so, you will need to edit the root `.env` file.

1. Set the `VITE_SOLID_IDENTITY_PROVIDER_DEV` to `localhost:3000` (or where ever else you wish to host the server). You can find a pre made example in `env_templates/dev.env`.

2. Start the SOLID server in a shell window

```shell
npm run dev:pod
```

---

3. In another shell, start PASS

```shell
npm run dev
```

You should now have a PASS application running at `localhost:5173`, which logs into a server located at `localhost:3000`

## Customizing the local server

PASS is intended to work with any server that implements the SOLID protocol. However, to make development easier, we include Community Solid Server in our dev tools. The defaults work in most cases, but here are some common customizations:

You can change the port the server is listening on by using the `--port` or `-p` flags:

```shell
npm run dev:pod -- -p 1234
```
---

By default, community solid server stores all data in memory (i.e. it does not save data when it's shut down). To have it store data to your filesystem, you can use the command

```shell
npm run dev:pod:stored
```

This will store all server files in the folder `PASS/local_temp_server_files`. This is a local testing directory, and the files within it should not be added to source control.

You can find more information on its configuration on the project's [github](https://github.com/CommunitySolidServer/CommunitySolidServer#configuring-the-server).

Latest version of this build allows for any Solid provider. However, it is recommended users to login through [https://solidcommunity.net](https://solidcommunity.net) or [https://opencommons.net](https://opencommons.net) if testing on a live Solid server, OR `localhost:3000` if testing in a local dev environment while it's still being worked on.

**[⬆️ Back to Top](#pass)**
