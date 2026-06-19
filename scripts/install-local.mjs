import {
  copyFileSync,
  mkdirSync,
  utimesSync,
  writeFileSync
} from 'node:fs';
import { join } from 'node:path';

const defaultVault = '/Users/bri/MEGA/LIBRARY/OBSIDIAN';
const vaultPath = process.argv[2] ?? process.env.READYBOARD_VAULT ?? defaultVault;
const pluginDir = join(vaultPath, '.obsidian', 'plugins', 'readyboard');
const buildDir = new URL('../dist/build/', import.meta.url);

mkdirSync(pluginDir, { recursive: true });

for (const file of ['main.js', 'manifest.json', 'styles.css']) {
  copyFileSync(new URL(file, buildDir), join(pluginDir, file));
}

const hotReloadFile = join(pluginDir, '.hotreload');
try {
  const now = new Date();
  utimesSync(hotReloadFile, now, now);
} catch {
  writeFileSync(hotReloadFile, '');
}

console.log(`Installed ReadyBoard into ${pluginDir}`);
console.log('Touched .hotreload');
