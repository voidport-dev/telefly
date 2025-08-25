module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    project: false,
  },
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      typescript: {},
    },
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "import",
    "unused-imports",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-console": [
      "error",
      { allow: ["warn", "error", "info"] }
    ],

    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],

    "import/order": [
      "error",
      {
        groups: [
          ["builtin", "external"],
          ["internal"],
          ["parent", "sibling", "index"],
          ["type"],
        ],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],

    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
  overrides: [
    {
      files: ["electron/**/*.ts"],
      env: { node: true, browser: false },
      rules: {
        "no-console": ["error", { allow: ["warn", "error", "info"] }],
      },
    },
    {
      files: ["*.config.*", "*.cjs"],
      env: { node: true },
    },
  ],
};


