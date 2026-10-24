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
    // Vendored third-party Framer component (minified, external source):
    "src/lib/framer/**",
    // Vendored compiled GooeyNavbar (minified, external source):
    "src/components/ui/GooeyNavbar.jsx",
    // Tooling (not shipped):
    ".opencode/**",
    "scripts/**",
  ]),
]);

export default eslintConfig;
