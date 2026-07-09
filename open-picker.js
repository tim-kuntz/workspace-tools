const { spawnSync } = require("node:child_process");

const herdr = process.env.HERDR_BIN_PATH ?? "herdr";
const pluginId = process.env.HERDR_PLUGIN_ID ?? "workspace-tools";

// Open the picker as a floating overlay pane, focused immediately
spawnSync(
  herdr,
  ["plugin", "pane", "open", "--plugin", pluginId, "--entrypoint", "workspace-picker", "--placement", "overlay", "--focus"],
  { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
);
