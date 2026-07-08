const { spawnSync } = require("node:child_process");

const herdr = process.env.HERDR_BIN_PATH ?? "herdr";
const pluginId = process.env.HERDR_PLUGIN_ID ?? "workspace-tools";

// Open the picker as a split pane (no focus yet)
const open = spawnSync(
  herdr,
  ["plugin", "pane", "open", "--plugin", pluginId, "--entrypoint", "workspace-picker", "--placement", "split", "--no-focus"],
  { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
);

const paneId = JSON.parse(open.stdout).result.plugin_pane.pane.pane_id;

// Zoom it to fill the screen, which focuses it
spawnSync(herdr, ["pane", "zoom", paneId, "--on"], { stdio: "ignore" });
