import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { files: ["src/**/*.ts"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Turn off the standard JS rule to avoid conflicts
      "no-unused-vars": "off", 
      // Use the TypeScript-aware version
      "@typescript-eslint/no-unused-vars": "warn", 
      "no-console": "off",     
    },
  }
);