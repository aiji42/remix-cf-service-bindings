const { withEsbuildOverride } = require("remix-esbuild-override");
const fs = require("fs");
const path = require("path");
const { Project, VariableDeclarationKind } = require("ts-morph");

const project = new Project({
  tsConfigFilePath: path.join(process.cwd(), "tsconfig.json"),
});

const plugin = (isEdge, active = false) => ({
  name: "RemixServiceBindingPlugin",
  setup(build) {
    if (!active) return;
    console.log(
      `Building service bindings; service ${isEdge ? "edge" : "child"}`
    );
    build.onLoad(
      { filter: /app\/routes\/.*\.(ts|js|tsx|jsx)$/ },
      async (args) => {
        const { ext } = path.parse(args.path);
        const src = project.createSourceFile(
          `tmp${ext}`,
          fs.readFileSync(args.path, "utf8"),
          { overwrite: true }
        );

        if (isEdge) {
          const replaced = [];
          src.getExportedDeclarations().forEach((node, key) => {
            if (["loader", "action"].includes(key)) {
              node.forEach((n) => n.remove());
              replaced.push(key);
            }
          });
          src.getExportDeclarations().forEach((node) => {
            node.getNamedExports().forEach((node) => {
              if (["action", "loader"].includes(node.getName())) node.remove();
            });
          });

          if (replaced.length > 0) {
            src.addVariableStatement({
              declarationKind: VariableDeclarationKind.Const,
              declarations: replaced.map((key) => ({
                name: key,
                initializer: `async ({ context }) => await CHILD.fetch(context.event.request.clone())`,
              })),
              isExported: true,
            });
          }
        }

        if (!isEdge) {
          src.getExportedDeclarations().forEach((node, key) => {
            if (key === "default") node.forEach((n) => n.remove());
          });
          src.removeDefaultExport();
        }

        console.log(args.path);
        console.log(src.getFullText());

        return {
          contents: src.getFullText(),
          loader: ext.replace(/^\./, ""),
          resolveDir: path.dirname(args.path),
        };
      }
    );
  },
});

withEsbuildOverride((option, { isServer }) => {
  if (isServer) {
    option.plugins = [
      plugin(!process.env.CHILD, !!process.env.DEPLOY),
      ...option.plugins,
    ];
  }

  return option;
});

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverBuildTarget: "cloudflare-workers",
  server: "./server.js",
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
