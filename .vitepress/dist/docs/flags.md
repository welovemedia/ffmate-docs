---
url: /docs/flags.md
---
# Command-Line Flags and Options

The `ffmate` binary offers several command-line flags to customize its behavior when starting the server or performing other actions. These flags allow you to configure paths, ports, operational parameters, and debugging options.

You can typically see a list of available commands and their flags by running `ffmate --help` or `ffmate <command> --help`.

### Global Flags

These flags can usually be used with any `ffmate` command (like `server`, `update`, `reset`).

* **`-d, --debug <namespaces>`** or **`--debug="<namespaces>"`**
  * **Purpose:** Enables detailed debug logging for specific parts of the application. `ffmate` uses the `debugo` library for this.
  * **Value:** A comma-separated list of namespaces or wildcards.
    * `"*"`: Enables all debug messages.
    * `"gin"`: Enables debug messages specifically from the Gin web framework components.
    * `"queue"`: Enables debug messages from the task queue processing logic.
    * `"sev:webhook"`: Enables debug messages for webhook firing from the internal `sev` framework.
    * You can combine them: `"*,-gin"` (all except gin) or `"queue,ffmpeg"` (only queue and ffmpeg).
  * **Environment Variable:** Debug namespaces can also be set using the `DEBUGO` environment variable. If both are set, the command-line flag usually takes precedence.
  * **Default:** Debug logging is off by default.

### `server` Command Flags

These flags are specific to the `ffmate server` command, which starts the main `ffmate` application (API, Web UI, queue processor, etc.).

* **`-f, --ffmpeg <path>`** or **`--ffmpeg="<path>"`**
  * **Purpose:** Specifies the path to the `ffmpeg` executable.
  * **Value:** The full path to your `ffmpeg` binary.
  * **Default:** `ffmpeg` (assumes `ffmpeg` is in your system's `PATH`).
  * **Example:** `ffmate server --ffmpeg="/usr/local/bin/ffmpeg"`

* **`-p, --port <port_number>`** or **`--port="<port_number>"`**
  * **Purpose:** Sets the port number on which the `ffmate` server (API and Web UI) will listen.
  * **Value:** A valid port number.
  * **Default:** `3000`
  * **Example:** `ffmate server --port="8080"`

* **`-t, --tray`**
  * **Purpose:** Enables the system tray icon (experimental). When enabled, `ffmate` will show an icon in your system tray with status information and basic controls.
  * **Value:** Not applicable (flag is either present or absent).
  * **Default:** `false` (tray icon is disabled).
  * **Example:** `ffmate server --tray`

* **`-b, --database <path>`** or **`--database="<path>"`**
  * **Purpose:** Specifies the path to the SQLite database file where `ffmate` stores its data (tasks, presets, webhooks, etc.).
  * **Value:** A file path.
    * If prefixed with `~/` (e.g., `~/.ffmate/data.sqlite`), `~` will be expanded to your home directory.
  * **Default:** `~/.ffmate/db.sqlite`
  * **Example:** `ffmate server --database="/var/lib/ffmate/production.db"`

* **`-m, --max-concurrent-tasks <number>`** or **`--max-concurrent-tasks="<number>"`**
  * **Purpose:** Defines the maximum number of `ffmpeg` tasks that `ffmate` will run simultaneously.
  * **Value:** A positive integer.
  * **Default:** `3`
  * **Example:** `ffmate server --max-concurrent-tasks="5"` (allows up to 5 tasks to run at once)

* **`-s, --send-telemetry <true|false>`** or **`--send-telemetry=<true|false>`**
  * **Purpose:** Enables or disables the sending of anonymous usage telemetry data to `telemetry.ffmate.io`. This data helps the developers understand how `ffmate` is used and improve the product.
  * **Value:** `true` or `false`.
  * **Default:** `true` (telemetry is enabled).
  * **Example:** `ffmate server --send-telemetry=false`

### `update` Command Flags

These flags are specific to the `ffmate update` command, which checks for and applies updates to the `ffmate` binary itself.

* **`--dry`**
  * **Purpose:** Performs a "dry run" of the update check. It will report if an update is available but will not actually download or install it.
  * **Value:** Not applicable (flag is either present or absent).
  * **Default:** `false` (updates are applied if available).
  * **Example:** `ffmate update --dry`

### `reset` Command Flags

These flags are specific to the `ffmate reset` command, which is used to reset the status of any tasks that were marked as `RUNNING` to `DONE_CANCELED`. This can be useful if `ffmate` was shut down unexpectedly while tasks were in progress.

### How Flags are Processed

`ffmate` uses the Viper library for configuration management. This means that flag values can often be overridden by environment variables or configuration files if `ffmate` were set up to use them (though the provided code primarily focuses on flags and defaults). Command-line flags generally have the highest precedence.

### Example Usage

Starting the `ffmate` server with a custom port, a specific `ffmpeg` binary, and disabling telemetry:
`ffmate server --port="3030" --ffmpeg="/opt/custom_ffmpeg/bin/ffmpeg" --send-telemetry=false --debug="queue,api"`

Checking for updates without applying them:
`ffmate update --dry`
