// eslint.config.js
import pluginJs from "@eslint/js";
import globals from "globals";

export default [
  pluginJs.configs.recommended,
  {
    files: ["**/*.js"],
    ignores: ["docs/**", "node_modules/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser // inclui fetch, setTimeout, clearTimeout, etc.
      }
    },
    rules: {
      "no-unused-vars": ["warn", { "ignoreRestSiblings": true }],
      "no-console": "off"
    }
  }
];
