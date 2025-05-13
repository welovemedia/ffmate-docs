---
title: "FFmate Command-Line Flags: Server, Update & Global Options"
description: "Comprehensive guide to all FFmate command-line flags. Learn to configure FFmate's server settings (FFmpeg path, port, DB), manage updates, enable debug logs, and more"
---

# Command-Line Flags and Options

The FFmate binary offers several command-line flags to customize its behavior when starting the server or performing other actions. These flags allow you to configure paths, ports, operational parameters, and debugging options.

You can see a list of available commands and their flags by running `ffmate --help` or `ffmate <command> --help`.

## Global Flags

These flags can usually be used with any FFmate command (like `server`, `update`, `reset`).

*   **`-d, --debug <namespaces>`** or **`--debug="<namespaces>"`**
    *   **Purpose:** Enables detailed debug logging for specific parts of the application. FFmate uses the `debugo` library for this.
    *   **Value:** A comma-separated list of namespaces or wildcards.
        *   `"*"`: Enables all debug messages.
        *   `"gin"`: Enables debug messages specifically from the Gin web framework components.
        *   `"queue"`: Enables debug messages from the task queue processing logic.
        *   `"sev:webhook"`: Enables debug messages for webhook firing from the internal `sev` framework.
        *   You can combine them: `"*,-gin"` (all except gin) or `"queue,ffmpeg"` (only queue and ffmpeg).
    *   **Environment Variable:** Debug namespaces can also be set using the `DEBUGO` environment variable. If both are set, the command-line flag usually takes precedence.
    *   **Default:** Debug logging is off by default.

## Server Command Flags

These flags are specific to the `FFmate server` command, which starts the main FFmate application (API, Web UI, queue processor, etc.).

*   **`-f, --ffmpeg <path>`** or **`--ffmpeg="<path>"`**
    *   **Purpose:** Specifies the path to the `ffmpeg` executable.
    *   **Value:** The full path to your `ffmpeg` binary.
    *   **Default:** `ffmpeg` (assumes `ffmpeg` is in your system's `PATH`).
    *   **Example:** `ffmate server --ffmpeg="/usr/local/bin/ffmpeg"`

*   **`-p, --port <port_number>`** or **`--port="<port_number>"`**
    *   **Purpose:** Sets the port number on which the FFmate server (API and Web UI) will listen.
    *   **Value:** A valid port number.
    *   **Default:** `3000`
    *   **Example:** `ffmate server --port="8080"`

*   **`-t, --tray`**
    *   **Purpose:** Enables the system tray icon (experimental). When enabled, FFmate will show an icon in your system tray with status information and basic controls.
    *   **Value:** Not applicable (flag is either present or absent).
    *   **Default:** `false` (tray icon is disabled).
    *   **Example:** `ffmate server --tray`

*   **`-b, --database <path>`** or **`--database="<path>"`**
    *   **Purpose:** Specifies the path to the SQLite database file where FFmate stores its data (tasks, presets, webhooks, etc.).
    *   **Value:** A file path.
        *   If prefixed with `~/` (e.g., `~/.ffmate/data.sqlite`), `~` will be expanded to your home directory.
    *   **Default:** `~/.ffmate/db.sqlite`
    *   **Example:** `ffmate server --database="/var/lib/ffmate/production.db"`

*   **`-m, --max-concurrent-tasks <number>`** or **`--max-concurrent-tasks="<number>"`**
    *   **Purpose:** Defines the maximum number of `ffmpeg` tasks that FFmate will run simultaneously.
    *   **Value:** A positive integer.
    *   **Default:** `3`
    *   **Example:** `ffmate server --max-concurrent-tasks="5"` (allows up to 5 tasks to run at once)

*   **`-l, --loglevel <info|warn|error|debug|none>`** or **`--loglevel=<info|warn|error|debug|none>`**
    *   **Purpose:** Set the log level or disables the logging completely.
    *   **Value:** `info`, `warn`, `error`, `debug` or `none` to disable logging.
    *   **Default:** `info` (log level is info).
    *   **Example:** `ffmate server --loglevel=error`

*   **`-s, --send-telemetry <true|false>`** or **`--send-telemetry=<true|false>`**
    *   **Purpose:** Enables or disables the sending of anonymous usage telemetry data to `telemetry.ffmate.io`.
    *   **Value:** `true` or `false`.
    *   **Default:** `true` (telemetry is enabled).
    *   **Example:** `ffmate server --send-telemetry=false`

## Update Command Flags

These flags are specific to the `ffmate update` command, which checks for and applies updates to the FFmate binary itself.

*   **`--dry`**
    *   **Purpose:** Performs a "dry run" of the update check. It will report if an update is available but will not actually download or install it.
    *   **Value:** Not applicable (flag is either present or absent).
    *   **Default:** `false` (updates are applied if available).
    *   **Example:** `ffmate update --dry`

## Reset Command Flags

These flags are specific to the `ffmate reset` command, which is used to reset the status of any tasks that were marked as `RUNNING` to `DONE_CANCELED`. This can be useful if FFmate was shut down unexpectedly while tasks were in progress.

## How Flags are Processed

FFmate uses the Viper library for configuration management. This means that flag values can often be overridden by environment variables. Command-line flags generally have the highest precedence.

## Example

Starting the FFmate server with a custom port, a specific `ffmpeg` binary, and disabling telemetry:
`ffmate server --port="3030" --ffmpeg="/opt/custom_ffmpeg/bin/ffmpeg" --send-telemetry=false --debug="queue,api"`