# workspace-tools

## Install

```bash
herdr plugin install tim-kuntz/workspace-tools
```

Or clone and link the plugin:

```bash
herdr plugin link <path-to-workspace-tools>
```

## Configure

In the `~/.config/herdr/config.toml` file, add the following configuration:

```toml
[[keys.command]]
key = "prefix+o"
type = "shell"
command = "herdr plugin action invoke workspace-tools.focus-workspace"
description = "focus workspace picker"
```

To toggle back and forth between the last two focused workspaces (like
tmux's `last-window`), bind `toggle-last-workspace`:

```toml
[[keys.command]]
key = "prefix+enter"
type = "shell"
command = "herdr plugin action invoke workspace-tools.toggle-last-workspace"
description = "toggle last workspace"
```

State is stored in this plugin's config directory
(`herdr plugin config-dir workspace-tools`) as `last-workspace.json`.
