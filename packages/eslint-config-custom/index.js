/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["prettier", "eslint:recommended", "turbo"],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: "latest",
  },
  env: {
    es6: true,
  },
  overrides: [
    {
      extends: [
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:react/recommended",
        "plugin:prettier/recommended"
      ],
      files: ["**/*.ts", "**/*.tsx"],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["../apps/*/tsconfig.json", "../packages/*/tsconfig.json"]
      },
      rules: {
        "@next/next/no-img-element": "off",
        "@next/next/no-html-link-for-pages": "off",
        "react/jsx-key": "off",
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "react/prop-types": 0,
        "react/jsx-uses-react": 0,
        "react/react-in-jsx-scope": 0,
        "react/require-default-props": 0,
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
          },
        ],
      },
    }
  ],
  root: true,
  reportUnusedDisableDirectives: true
};

module.exports = config;