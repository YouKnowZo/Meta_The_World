import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
};
