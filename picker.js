const { spawnSync } = require("node:child_process");

const herdr = process.env.HERDR_BIN_PATH ?? "herdr";

function herdrJson(args) {
  const r = spawnSync(herdr, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  return JSON.parse(r.stdout);
}

const list = herdrJson(["workspace", "list"]);
const workspaces = list.result.workspaces;

// Build fzf input: "label\tworkspace_id"
const lines = workspaces.map((w) => `${w.label}\t${w.workspace_id}`).join("\n");

const fzf = spawnSync("fzf", ["--with-nth=1", "--delimiter=\t", "--prompt=workspace> "], {
  input: lines,
  encoding: "utf8",
  stdio: ["pipe", "pipe", "inherit"],
});

if (fzf.status !== 0) process.exit(0);

const workspaceId = fzf.stdout.trim().split("\t")[1];
if (!workspaceId) process.exit(0);

const focus = spawnSync(herdr, ["workspace", "focus", workspaceId], {
  encoding: "utf8",
  stdio: "inherit",
});

process.exit(focus.status ?? 0);
