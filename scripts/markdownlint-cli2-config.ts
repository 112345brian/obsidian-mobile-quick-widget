import { obsidianDevUtilsConfig } from 'obsidian-dev-utils/script-utils/linters/markdownlint-cli2-config';

export const config = {
  ...obsidianDevUtilsConfig,
  config: {
    ...(obsidianDevUtilsConfig.config as object),
    MD022: false,
    MD032: false,
    MD036: false,
    MD058: false,
    MD060: false
  }
};
