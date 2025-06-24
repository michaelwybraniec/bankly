#!/usr/bin/env node

/**
 * update-readme-version.js
 *
 * Replaces the <!-- VERSION_PLACEHOLDER --> in README.md with the version from package.json.
 * Can be run as a prepublish, precommit, or CI/CD step.
 * Idempotent: If the version is already present, it will update it. If restoring, it can revert to the placeholder.
 */

const fs = require('fs');
const path = require('path');

const readmePath = path.resolve(__dirname, '../README.md');
const pkgPath = path.resolve(__dirname, '../package.json');

function getVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.version;
  } catch (err) {
    console.error('Error reading package.json:', err);
    process.exit(1);
  }
}

function updateReadme(version) {
  try {
    let readme = fs.readFileSync(readmePath, 'utf8');
    const versionLineRegex = /\*\*Version:\*\* (<!-- VERSION_PLACEHOLDER -->|[0-9]+\.[0-9]+\.[0-9]+)/;
    const newLine = `**Version:** ${version}`;
    if (versionLineRegex.test(readme)) {
      readme = readme.replace(versionLineRegex, newLine);
    } else {
      console.error('VERSION_PLACEHOLDER not found in README.md');
      process.exit(1);
    }
    fs.writeFileSync(readmePath, readme, 'utf8');
    console.log(`README.md version updated to ${version}`);
  } catch (err) {
    console.error('Error updating README.md:', err);
    process.exit(1);
  }
}

function restorePlaceholder() {
  try {
    let readme = fs.readFileSync(readmePath, 'utf8');
    const versionLineRegex = /\*\*Version:\*\* [0-9]+\.[0-9]+\.[0-9]+/;
    const placeholderLine = '**Version:** <!-- VERSION_PLACEHOLDER -->';
    if (versionLineRegex.test(readme)) {
      readme = readme.replace(versionLineRegex, placeholderLine);
      fs.writeFileSync(readmePath, readme, 'utf8');
      console.log('README.md version placeholder restored.');
    } else {
      console.log('No version line to restore.');
    }
  } catch (err) {
    console.error('Error restoring placeholder in README.md:', err);
    process.exit(1);
  }
}

// CLI usage: node update-readme-version.js [restore]
if (process.argv[2] === 'restore') {
  restorePlaceholder();
} else {
  const version = getVersion();
  updateReadme(version);
} 