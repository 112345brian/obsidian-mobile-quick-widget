import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);

function readJson(path) {
  return JSON.parse(readFileSync(new URL(path, root), 'utf8'));
}

function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

function assert(condition, message) {
  if (!condition) {
    console.error(`release check failed: ${message}`);
    process.exitCode = 1;
  }
}

const packageJson = readJson('package.json');
const packageLock = readJson('package-lock.json');
const manifest = readJson('manifest.json');
const versions = readJson('versions.json');
const version = packageJson.version;

assert(manifest.version === version, `manifest.json version ${manifest.version} does not match package.json ${version}`);
assert(packageLock.version === version, `package-lock.json root version ${packageLock.version} does not match package.json ${version}`);
assert(packageLock.packages?.['']?.version === version, `package-lock package root version does not match package.json ${version}`);
assert(versions[version] === manifest.minAppVersion, `versions.json is missing ${version}: ${manifest.minAppVersion}`);

try {
  const tag = git(['describe', '--tags', '--exact-match', 'HEAD']);
  assert(tag === version, `HEAD tag ${tag} does not match package version ${version}`);
} catch {
  assert(false, `HEAD is not exactly tagged as ${version}`);
}

if (process.exitCode) {
  process.exit();
}

console.log(`release check passed for ${version}`);
