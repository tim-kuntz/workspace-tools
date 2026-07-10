const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const herdr = process.env.HERDR_BIN_PATH ?? "herdr";
const pluginId = process.env.HERDR_PLUGIN_ID ?? "workspace-tools";

function herdrJson(args) {
  const r = spawnSync(herdr, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (r.status !== 0) return null;
  try {
    return JSON.parse(r.stdout);
  } catch {
    return null;
  }
}

const configDirResult = spawnSync(herdr, ["plugin", "config-dir", pluginId], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
});
const configDir = configDirResult.stdout.trim();
if (!configDir) process.exit(0);

const statePath = path.join(configDir, "last-workspace.json");

function readState() {
  try {
    const raw = fs.readFileSync(statePath, "utf8");
    const parsed = JSON.parse(raw);
    if (typeof parsed.current === "string" && typeof parsed.other === "string") return parsed;
  } catch {
    // missing/corrupt state file is fine, treated as no history
  }
  return null;
}

function writeState(state) {
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state));
}

const snapshot = herdrJson(["api", "snapshot"]);
const focused = snapshot?.result?.snapshot?.focused_workspace_id;
if (!focused) process.exit(0);

const state = readState();
if (!state) {
  // First run: nothing to toggle to yet, just anchor history on the current workspace.
  writeState({ current: focused, other: focused });
  process.exit(0);
}

// If the user switched workspaces some other way since the last toggle,
// re-anchor history around what's actually focused now.
const other = focused === state.current ? state.other : state.current;

if (other === focused) process.exit(0);

const list = herdrJson(["workspace", "list"]);
const exists = list?.result?.workspaces?.some((w) => w.workspace_id === other);
if (!exists) process.exit(0);

const focusResult = spawnSync(herdr, ["workspace", "focus", other], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
});
if (focusResult.status !== 0) process.exit(0);

writeState({ current: other, other: focused });
process.exit(0);
