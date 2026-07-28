import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Agent worktrees are separate checkouts; linting them double-reports everything.
    ".claude/**",
  ]),
  {
    // Vendored WebGL/canvas sources pulled from the reactbits registry
    // (see components.json). Linting them to our standards means forking
    // upstream code, which makes future re-pulls harder than it is worth.
    // They are decorative, self-contained, and carry no app logic.
    files: [
      "components/animations/**",
      "components/soft-aurora/**",
    ],
    rules: {
      "prefer-const": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
]);

export default eslintConfig;
