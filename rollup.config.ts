import ts from "rollup-plugin-ts";
import replace from "@rollup/plugin-replace";
import uglify from "rollup-plugin-uglify-es";
import path from "path";

const pkgJson = require(path.join(__dirname, "package.json"));

const config = [
  {
    input: "./src/index.ts",
    // transpiled typescript in umd and es format
    output: [
      { file: "dist/atlas-tool.js", name: "atlas-tool", format: "umd", sourcemap: true },
      { file: "dist/atlas-tool.mjs", format: "es", sourcemap: true }
    ],
    plugins: [ ts({
      'tsconfig': (resolvedConfig) => {
        const config = Object.assign({}, resolvedConfig);
        config.declarationDir = path.join(__dirname, 'dist');
        return config;
      }
    }), replace({
      preventAssignment: true,
      __buildVersion: pkgJson.version
    })]
  },
  {
    input: "./src/index.ts",
    // uglified transpiled typescript in commonjs
    output: [
      { file: "dist/atlas-tool.min.js", format: "cjs", sourcemap: false }
    ],
    plugins: [ uglify(), ts(), replace({
      preventAssignment: true,
      __buildVersion: pkgJson.version
    }) ]
  }
];
export default config;
