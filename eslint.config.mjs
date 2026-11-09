import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    "public/swarm-intro.js", // Supplied standalone ES2017 engine; syntax and behavior checked separately.
    ".next/**",
    "out/**",
    "next-env.d.ts",
    "Microsoft/**",
    "test-results/**",
    "playwright-report/**",
  ]),
]);
