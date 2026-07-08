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
