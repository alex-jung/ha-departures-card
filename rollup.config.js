import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";

const dev = process.env.ROLLUP_WATCH;

const plugins = [
  nodeResolve(),
  commonjs(),
  typescript(),
  json(),
  babel({
    exclude: "node_modules/**",
    babelHelpers: "bundled",
  }),
  terser(),
];

export default [
  {
    input: "src/departures-card.ts",
    output: {
      sourcemap: true,
      format: "es",
      file: "dist/ha-departures-card.js"
    },
    plugins: [...plugins],
  },
];
