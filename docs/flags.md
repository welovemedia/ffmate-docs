---
title: "FFmate Command-Line Flags: Server, Update & Global Options"
description: "Comprehensive guide to all FFmate command-line flags. Learn to configure FFmate's server settings (FFmpeg path, port, DB), manage updates, enable debug logs, and more"
---

# Command-Line Interface (CLI)

FFmate’s command-line interface is the main way to start and manage the application. It follows a standard `ffmate [command] [flags]` pattern and provides three distinct commands:

* `server:` This is the main command that runs FFmate.
* `update:` This is a utility command used to check for and install new versions of the FFmate binary.
* `version:` This is a simple utility command that prints the currently installed version number.

To see all commands and their flags, run:  
```bash
ffmate --help
ffmate <command> --help
```

## Server Command Flags

The `server` command starts FFmate. All flags listed in this section are specific to this command and allow you to configure everything from ports, database path, logging, and other configuration options.

*   **`--ffmpeg <path>`** or **`--ffmpeg="<path>"`**
    *   **Purpose:** Set the path to the `ffmpeg` executable.
    *   **Value:** The full path to your `ffmpeg` binary.
    *   **Default:** `ffmpeg` (assumes `ffmpeg` is in your system's `PATH`).
    *   **Example:** `ffmate server --ffmpeg="/usr/local/bin/ffmpeg"`

*   **`--port <port_number>`** or **`--port="<port_number>"`**
    *   **Purpose:** Sets the port number on which the FFmate server (API and Web UI) will listen.
    *   **Value:** A valid port number.
    *   **Default:** `3000`
    *   **Example:** `ffmate server --port="8080"`

*   **`--tray`**
    *   **Purpose:** Enables the system tray icon (experimental). When enabled, FFmate will show an icon in your system tray with status information and basic controls.
    *   **Default:** `false` (tray icon is disabled).
    *   **Example:** `ffmate server --tray`

* **`--database <value>`** or **`--database="<value>"`**

  * **Purpose:** Sets where FFmate stores its data (tasks, presets, webhooks, etc.). FFmate supports **SQLite** for standalone instances (default out of the box) and **PostgreSQL** for clustered setups.
  * **Value:**
    * **SQLite file path:** FFmate uses SQLite out of the box. By default, the database is created at:

        * Windows: `%APPDATA%\ffmate\db.sqlite`
        * macOS/Linux: `~/.ffmate/db.sqlite`
        * Docker: `/app/db/sqlite.db`

        You can specify an alternative location by passing the full file path with `--database`.

    * **Examples:**

        ```
        # Unix example
        FFmate server --database="~/ffmate/data/production.sqlite"

        # Windows example
        FFmate server --database="C:\Users\YourName\AppData\Roaming\ffmate\data.sqlite"
        ```

    * **PostgreSQL URI:** FFmate supports **PostgreSQL** for multi-node setups. If you pass a `URI` starting with `postgresql://` to `--database`, FFmate automatically switches into **cluster mode**, allowing all FFmate instances to share the same database.
    
    * **Connection URI:**

        ```
        postgresql://user:password@host:port/dbname
        ```

        ::: info
        The PostgreSQL database must exist before connecting a FFmate node to it. FFmate will create the required tables and schema at startup if they are not already present
        :::

    * **Example:**

        ```
        ffmate server --database="postgresql://ffuser:ffpass@localhost:5432/ffmatedb"
        ```

*   **`--max-concurrent-tasks <number>`** or **`--max-concurrent-tasks="<number>"`**
    *   **Purpose:** Sets the maximum number of `ffmpeg` tasks that FFmate will run simultaneously.
    *   **Value:** A positive integer.
    *   **Default:** `3`
    *   **Example:** `ffmate server --max-concurrent-tasks="5"` (allows up to 5 tasks to run at once)

*   **`--send-telemetry <true|false>`** or **`--send-telemetry=<true|false>`**
    *   **Purpose:** Enables or disables the sending of anonymous usage telemetry data to `telemetry.FFmate.io`.
    *   **Value:** `true` or `false`.
    *   **Default:** `true` (telemetry is enabled).
    *   **Example:** `ffmate server --send-telemetry=false`

* **`--debug <namespaces>`** or **`-d <namespaces>`**

  * **Purpose:** FFmate uses a **namespace system** instead of classic levels (INFO, DEBUG, ERROR). It’s built on our own lightweight Go library, [yosev/debugo](https://github.com/yosev/debugo), inspired by the popular [debug-js](https://github.com/debug-js/debug) package. This gives you fine-grained control over which parts of the app produce logs.  

  * **Default:** `info:?,warn:?,error:?`.
  * **Example:**

    ```bash
    ffmate server --debug="*:task,*:watchfolder"
    ```

    ### Namespaces  

    Every log message in FFmate belongs to a **namespace**. You can think of these namespaces as structured labels that describe two things:  

    1. **Severity** – the log level (`info`, `debug`, `warn`, `error`).  
    2. **Component** – the part of the system the message comes from (`task`, `ffmpeg`, `http`, etc.).  

    They’re combined in a `severity:component` format. For example:  

    - `error:task` → logs an error that occurred in task processing
    - `debug:http` → logs debug information for each HTTP request

    The `--debug` flag lets you filter by these labels, so you control exactly what shows up in your logs.  

    #### **info** – general, high-level messages

    * `info:task` – Logs the major stages of the tasks' lifecycle: when it's created, when it's picked from the queue to start processing, when it's restarted, when it's canceled, when it's deleted, and when it finishes successfully.
    * `info:watchfolder` – Logs when a new watchfolder is created, when its settings are updated, or when it is deleted.
    * `info:cluster` – Logs when the components responsible for communication between different FFmate instances (the "listener" and "notifier") have started successfully

    *   **Example:** Use `--debug="info"` to get a high-level overview of what the application is doing without low-level details.

    #### **debug** – detailed messages for troubleshooting

    * `debug:service` – Logs each major internal component (like the Task processor, Webhook sender, etc.) as it starts up. Use this if FFmate fails to start. The last service logged before the crash can help pinpoint the problem.
    * `debug:http` – Logs every single API request that FFmate receives, including the HTTP method (GET, POST) and the path (e.g., /api/v1/tasks).
    * `debug:controller` – Logs the API endpoints (like /tasks, /presets) as they become active during startup. This is primarily for debugging the FFmate application itself. You generally won't need this unless you are modifying the source code.
    * `debug:websocket` –  Logs every time a client (like the Web UI) connects to or disconnects from the WebSocket server.
    * `debug:client` – Logs the "heartbeat" of the FFmate instance. It logs the unique name the instance is using and a confirmation message every 15 seconds that it's connected to the database.
    * `debug:ffmpeg` – Logs the real-time progress of an active FFmpeg job, showing details like frame number, FPS, bitrate, and speed.
    * `debug:task` –  Provides the most detailed, step-by-step view of the entire task processing system. It shows when the queue is checked for new jobs, when a task is picked up, and when its status changes. Turn this on when jobs seem to be "stuck" in the queue or are not being picked up as expected.
    * `debug:watchfolder` – Logs when a watchfolder is scanned, what files are found, and whether a file is ready to be processed.
    * `debug:webhook` – Logs the entire lifecycle of webhooks. It shows when you successfully register a new webhook URL and when FFmate attempts to send a notification to that URL. Enable this to confirm your webhooks are set up correctly. If your application isn't receiving notifications, this log will tell you if FFmate is successfully sending them.
    * `debug:cluster` – Logs the raw broadcast messages being sent and received between different FFmate instances when running in cluster mode. This is an advanced log for verifying that your clustered FFmate instances are communicating correctly over the shared PostgreSQL database.
    * `debug:middleware` – Logs the registration of background request processors, like the Gzip compressor or the debug:http logger itself.This is primarily for debugging the FFmate application itself. You generally won't need this unless you are modifying the source code.

    *   **Example:** Use `--debug="debug:http,debug:task"` to see every incoming API call and all the detailed, verbose steps of the task processing queue, which is ideal for debugging a failing task.

    #### **warn** – warnings about possible issues

    * `warn:task` – Logs when a task has finished with a `DONE_ERROR` status.
    * `warn:cluster` – Logs when the internal message queue for cluster communication is full, which means a real-time update (like a task progress change) had to be dropped and was not broadcast to other FFmate instances

    *   **Example:** Use `--debug="warn"` to see only potential problems, like a task that failed but didn't crash the system, or a cluster message that was dropped.

    #### **error** – errors and failures

    * `error:ffmpeg` – Logs an error if FFmate fails to read or parse the real-time progress output from a running FFmpeg process. This is an error in the monitoring of FFmpeg, not an error from the FFmpeg command itself.
    * `error:task` – Logs a critical error if the task processor fails to fetch queued jobs from the database.
    * `error:telemetry` – Logs any failure that occurs while FFmate tries to send anonymous usage data, such as a network error or a problem connecting to the telemetry server.
    * `error:cluster` –  Logs a critical failure in the cluster communication system, most often caused by a lost connection to the PostgreSQL database or an issue with its `LISTEN/NOTIFY` feature.

    *   **Example:** Use `--debug="error"` in a production environment to log only critical failures, ensuring you capture every error from any part of the application for immediate attention.

    ### Filtering Rules

    The value for `--debug` is a comma-separated string of rules that you can combine to create a precise logging output.

    *   **`*` – Match Everything**
        *   **Example:** `ffmate server --debug="*"`
        *   **Result:** Shows every single log message from all namespaces. This is the best option for maximum verbosity.

    *   **`name` (e.g., `debug`) – Match a Parent Namespace ONLY**
        *   **Example:** `ffmate server --debug="warn"`
        *   **Result:** Shows logs from the `warn` namespace itself, but will **not** show logs from its children, like `warn:task` or `warn:cluster`.

    *   **`name:*` (e.g., `debug:*`) – Match Child Namespaces ONLY**
        *   **Example:** `ffmate server --debug="debug:*"`
        *   **Result:** Shows all logs from every child of `debug` (e.g., `debug:http`, `debug:task`) but will **not** show logs from the parent `debug` namespace itself.

    *   **`name:?` (e.g., `debug:?`) – Match a Parent AND All Its Children**
        *   **Example:** `ffmate server --debug="info:?"`
        *   **Result:** Shows logs from the parent `info` namespace **and** all of its children (`info:task`, `info:ffmpeg`, etc.). This is the rule used in the default setting: `info:?,warn:?,error:?`.

    *   **`-` – Exclude Namespaces**
        *   **Example:** `ffmate server --debug="*,-debug:?"`
        *   **Result:** Shows everything (`info`, `warn`, `error`, and all their children) *except* for logs from the `debug` parent and all of its children.

    *   **`,` – Combine Multiple Rules**
        *   **Example:** `ffmate server --debug="error:?,*:task,debug:http"`
        *   **Result:** Creates a highly specific filter that shows:
            1.  All logs from the `error` namespace and its children.
            2.  *All* logs (info, debug, warn, error) from the `task` namespace's children only (e.g., `debug:task`).
            3.  All incoming HTTP requests from the `debug:http` namespace.


        ### Common Examples

        | Goal                                                | Command                                                |
        | --------------------------------------------------- | ------------------------------------------------------ |
        | **Default (status, warnings, errors)**              | `ffmate server` (or `--debug="info:?,warn:?,error:?"`)  |
        | **See everything**                                  | `ffmate server --debug="*"`                            |
        | **See all `info` + `error` logs**                   | `ffmate server --debug="info:?,error:?"`                |
        | **Focus on tasks and watch folders**                | `ffmate server --debug="*:task,*:watchfolder"`         |
        | **See all errors + API calls**                      | `ffmate server --debug="error:?,debug:http"`           |
        | **Everything except debug noise**                   | `ffmate server --debug="*,-debug:?"`                   |
        | **No logs**                                         | `ffmate server --debug=""`                             |

# Update Command  

Checks for and applies new versions of the FFmate binary.  

* **Purpose:** Keep FFmate up to date with the latest release.  
* **Flags:**  
  * `--dry` — checks for updates without installing them.  
    * **Result:** Prints either `no newer version found` or `found newer version: X.Y.Z`. The binary itself is not modified.  

* **Default behavior:**  
  If a newer version is available, FFmate downloads and replaces its own binary. You’ll see a success message, and you’ll need to restart the application to use the new version.  

**Examples:**  
```bash
# Check if an update is available (no install)  
ffmate update --dry  
```

```bash
# Check for and apply the update if one is found  
ffmate update
```

::: info  
If you installed FFmate with **Homebrew**, use `brew upgrade ffmate` to update instead of the built-in `update` command.
:::

# Version Command  

Prints the currently installed FFmate version and exits.  

* **Purpose:** Quickly check which version of FFmate you’re running.  
* **Flags:** None  
* **Result:** Prints a single line to the console.  

**Example:**  
```bash
ffmate version
Output:
version: 2.0.0
```