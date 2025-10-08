require("esbuild")
  .build({
    entryPoints: ["script.js"],
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile: "dist/script.js",
  })
  .catch(() => process.exit(1));
