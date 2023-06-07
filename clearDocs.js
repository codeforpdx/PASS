const fs = require("fs-extra");
const path = require("path");

// Defining path to /docs and /docs/README.md
const docsDir = path.join(__dirname, "docs");
const readmeFilePath = path.join(docsDir, "README.md");

// Defining path for temp file
const tempFilePath = path.join(__dirname, "temp.md");

// Rename /docs/README.md to /temp.md
fs.moveSync(readmeFilePath, tempFilePath);

// Removing everything from /docs and remake /docs
fs.removeSync(docsDir);
fs.mkdirSync(docsDir);

// Rename /temp.md to /docs/README.md
fs.renameSync(tempFilePath, readmeFilePath);
