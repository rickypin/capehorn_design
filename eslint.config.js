import { createConfigForNuxt } from "@nuxt/eslint-config/flat"

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: {
      semi: false,
      quotes: "single",
    },
  },
}).append({
  rules: {
    // Style rules only - no logic enforcement
    "@typescript-eslint/semi": ["error", "never"],
    "@typescript-eslint/quotes": ["error", "single"],
    "@typescript-eslint/comma-dangle": ["error", "never"],

    // Vue 3 specific rules
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "always",
          component: "always",
        },
      },
    ],
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: 3,
        multiline: 1,
      },
    ],
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "vue/component-definition-name-casing": ["error", "PascalCase"],
    "vue/prop-name-casing": ["error", "camelCase"],
    "vue/attribute-hyphenation": ["error", "always"],
    "vue/v-on-event-hyphenation": ["error", "always"],

    // TypeScript specific rules
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",

    // Import organization
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "never",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],

    // General code quality
    "no-console": "warn",
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",
  },
})
