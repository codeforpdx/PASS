/* Simple script that removes all documents
 * within the docs folder except for all .md files */
const fs = require('fs-extra');
const path = require('path');

// Defining path for both /docs and /temp
const docsDir = path.join(__dirname, 'docs');
const tempDir = path.join(__dirname, 'temp');

// Creates at temp directory if it doesn't exist
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

/* Returns an array of strings which are the names
 * of all .md files within the docs directory */
const allMds = fs.readdirSync(docsDir).filter((file) => path.extname(file) === '.md');

// Copies all mdFiles over to the temp directory
allMds.forEach((mdFile) => {
  fs.copyFileSync(`${docsDir}/${mdFile}`, `${tempDir}/${mdFile}`);
});

/* Removes the docs directory and then renames
 * the temp directory as the docs directory,
 * now containing only the original .md files */
fs.removeSync(docsDir);
fs.renameSync(tempDir, docsDir, (err) => {
  if (err) {
    throw err;
  }
});
