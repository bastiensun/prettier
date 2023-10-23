module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "canonical/auto",
    "canonical/module",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "error",
    "arrow-body-style": ["error", "as-needed"],
    "import/no-unassigned-import": ["error", { allow: ["**/*.css"] }],
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "prefer-arrow-callback": "error",
    "prettier/prettier": "off",
    quotes: [
      "error",
      "double",
      { avoidEscape: true, allowTemplateLiterals: false },
    ],
  },
};
