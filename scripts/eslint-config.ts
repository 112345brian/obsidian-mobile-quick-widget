import type { Linter } from 'eslint';
import type { EslintConfigContext } from 'obsidian-dev-utils/script-utils/linters/eslint-config';

import { defineEslintConfigs } from 'obsidian-dev-utils/script-utils/linters/eslint-config';

function getRepoSourceOverrides(context: EslintConfigContext): Linter.Config[] {
  return [
    {
      files: context.sourceFiles,
      rules: {
        '@microsoft/sdl/no-inner-html': 'off',
        '@stylistic/max-statements-per-line': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/no-unnecessary-type-parameters': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        'complexity': 'off',
        'curly': ['error', 'multi-line'],
        'default-case': 'off',
        'func-style': 'off',
        'no-lonely-if': 'off',
        'no-magic-numbers': 'off',
        'no-negated-condition': 'off',
        'no-nested-ternary': 'off',
        'no-promise-executor-return': 'off',
        'no-restricted-syntax': 'off',
        'no-unsanitized/property': 'off',
        'no-useless-escape': 'off',
        'no-void': 'off',
        'obsidian-dev-utils/no-async-callback-to-unsafe-return': 'off',
        'obsidianmd/no-static-styles-assignment': 'off',
        'obsidianmd/prefer-active-doc': 'off',
        'obsidianmd/ui/sentence-case': 'off',
        'prefer-named-capture-group': 'off'
      }
    }
  ];
}

export const configs: Linter.Config[] = defineEslintConfigs({
  customConfigs: getRepoSourceOverrides
});
