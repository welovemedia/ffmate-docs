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

*   **`--identifier <name>`** or **`--identifier="<name>"`**
    *   **Purpose:** Assigns a unique name to an FFmate instance. This is essential in a cluster setup to distinguish between different processing nodes and in the Web UI it makes it clear which node is running each task.
    *   **Value:** A string representing the unique name for the instance.
    *   **Default:** The machine's hostname.
    *   **Example:** `ffmate server --identifier=“node”-a`

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

*   **`--no-ui`**
    *   **Purpose:** Prevents FFmate from automatically opening the Web UI in your default web browser when the server starts.
    *   **Default:** `false` (The UI is opened by default when running on a desktop OS).
    *   **Example:** `ffmate server --no-ui`

* **`--debug <namespaces>`** or **`-d <namespaces>`**

  * **Purpose:** FFmate uses a **namespace system** instead of classic levels (INFO, DEBUG, ERROR). It’s built on our own lightweight Go library, [yosev/debugo](https://github.com/yosev/debugo), inspired by the popular [debug-js](https://github.com/debug-js/debug) package. This gives you fine-grained control over which parts of the app produce logs.  
  * **Default:** `info:?,warn:?,error:?`.
  * **Example:**

    ```bash
    ffmate server --debug="*:task,*:watchfolder"
    ```
The full debugging guide can be found [here](/docs/debugging.md).

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