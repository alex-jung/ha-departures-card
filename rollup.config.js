import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import { string } from "rollup-plugin-string";
import clear from "rollup-plugin-clear";
import { terser } from "rollup-plugin-terser";

const outputDir = "dist";

export default (CLIArgs) => {
  const prod = !!CLIArgs.prod;
  const mini = !!CLIArgs.mini;

  let inputMap = { "ha-departures-card": "./src/components/ha-departures-card.ts" };

  if (!prod) {
    inputMap["dev"] = "./src/dev/debug-form.ts";
  }

  return {
    input: inputMap,

    output: {
      dir: `${outputDir}`,
      format: "es",
      sourcemap: !prod,

      entryFileNames: "[name].js",
      chunkFileNames: "chunks/[name].js",
      assetFileNames: "assets/[name][extname]",
    },

    plugins: [
      clear({
        targets: [`${outputDir}/esm`],
        watch: true,
      }),

      typescript({
        tsconfig: "./tsconfig.json",
      }),

      json(),
      nodeResolve(),
      commonjs(),

      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify(prod ? "production" : "development"),
      }),

      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
      }),

      string({
        include: "**/*.css",
      }),

      mini &&
        terser({
          compress: {
            drop_console: ["debug"],
            drop_debugger: prod,
          },
          format: {
            comments: false,
          },
        }),
    ],
  };
};
