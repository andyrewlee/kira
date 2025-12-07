module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  ignorePatterns: [
    "node_modules",
    "dist",
    "build",
    "coverage",
    "convex/_generated",
    "apps/web/node_modules",
    "backend/dist",
    "packages/shared/dist",
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "prettier",
      ],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
      },
    },
    {
      files: ["**/*.{js,jsx}"],
      extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended", "prettier"],
      rules: {
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
      },
    },
  ],
};
