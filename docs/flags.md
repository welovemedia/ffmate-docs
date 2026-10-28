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

*   **`--host <address>`** or **`--host="<address>"`**
    *   **Purpose:** Sets the network interface FFmate listens on.
    *   **Value:** An IP address or hostname. Use `127.0.0.1` to only accept connections from the same machine.
    *   **Default:** `0.0.0.0` (all network interfaces — FFmate is reachable from other machines).
    *   **Example:** `ffmate server --host="127.0.0.1"`

    ::: danger Anyone who can reach FFmate can run commands on this machine
    With the default `0.0.0.0` and no `--basic-auth`, FFmate accepts API requests from any machine that can reach its port, without a password. Tasks and presets can define a [`scriptPath`](/docs/pre-post-prcessing.md), which FFmate runs as a system command. So anyone with network access can run any command, with the same permissions as the FFmate process.

    * Only using FFmate on this machine? Use `--host 127.0.0.1`.
    * Need access from other machines? Enable `--basic-auth`, and only allow the machines that need it through your firewall.
    * Never expose FFmate directly to the internet.
    * Run FFmate as a dedicated user without admin or `root` rights, so scripts can only touch what that user can.

    On versions before v2.0.19, which always listen on `0.0.0.0`, use a firewall to restrict access to the port.
    :::

*   **`--basic-auth <username:password>`** or **`--basic-auth="<username:password>"`**
    *   **Purpose:** Protects the API, Web UI, WebSocket, Swagger, `/health` and `/metrics` with HTTP basic authentication.
    *   **Value:** `username:password`. Everything after the first `:` is the password. FFmate exits on startup if the value has no `:`.
    *   **Default:** Disabled (no authentication).
    *   **Example:** `ffmate server --basic-auth="admin:a-long-random-password"`
    *   **What's protected:** every route — the API, Web UI, WebSocket (`/api/v1/ws`), Swagger, `/health` and `/metrics`. Requests without valid credentials get `401 Unauthorized`.
    *   **Calling the API:** send the credentials with every request, e.g. `curl -u admin:a-long-random-password http://ffmate-host:3000/api/v1/tasks`.
    *   **Health checks and monitoring:** anything that calls FFmate automatically also needs the credentials. That includes Docker or Kubernetes health checks, load balancers, and the Prometheus scrape config (`basic_auth`).
    *   **Clusters:** set `--basic-auth` on **every** node. All nodes share one database, so a task created through a single unprotected node is picked up and run by any node.

    ::: warning Basic auth doesn't encrypt anything
    FFmate serves plain HTTP, so the username and password travel unencrypted. If traffic leaves the machine, run FFmate with `--host 127.0.0.1` behind a reverse proxy that serves HTTPS, for example [nginx](https://nginx.org/), [Caddy](https://caddyserver.com/) or [Traefik](https://doc.traefik.io/traefik/).
    :::

    ::: info Note
    The Web UI receives live updates over a WebSocket connection (`/api/v1/ws`), so your proxy must allow WebSocket connections. Caddy and Traefik do this automatically; nginx needs [extra configuration](https://nginx.org/en/docs/http/websocket.html).
    :::

*   **`--port <port_number>`** or **`--port="<port_number>"`**
    *   **Purpose:** Sets the port number on which the FFmate server (API and Web UI) will listen.
    *   **Value:** A valid port number.
    *   **Default:** `3000`
    *   **Example:** `ffmate server --port="8080"`

* **`--database <value>`** or **`--database="<value>"`**

  * **Purpose:** Sets where FFmate stores its data (tasks, presets, webhooks, etc.). FFmate supports **SQLite** for standalone instances (default out of the box) and **PostgreSQL** for clustered setups.
  * **Value:**
    * **SQLite file path:** FFmate uses SQLite out of the box. By default, the database is created at:

        * Windows: `%APPDATA%\ffmate\db.sql`
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
        postgresql://user:password@host:port/dbname?options
        ```

        * `port` is optional and defaults to `5432`.
        * `options` are optional PostgreSQL connection parameters written as `key=value`, for example `sslmode=require` or `connect_timeout=10`. FFmate passes them to the PostgreSQL driver as they are.
        * From **v2.0.19**, you can combine several options with `&`. On earlier versions, only pass **one** option.

        ```
        # Single option (all 2.x versions)
        postgresql://ffuser:ffpass@db.internal/ffmatedb?sslmode=require

        # Several options
        postgresql://ffuser:ffpass@db.internal:6432/ffmatedb?sslmode=require&connect_timeout=10
        ```

        ::: tip
        If your password contains special characters such as `@`, `:`, `/` or `?`, URL-encode them (for example, `@` becomes `%40`).
        :::

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

*   **`--labels <label,label,...>`** or **`--labels="<label,label,...>"`**
    *   **Purpose:** Controls which tasks and watchfolders the FFmate instance processes. For example, in a [cluster](/docs/clustering.md), GPU encoding tasks can be limited to the FFmate instance whose machine has a graphics card.

        A label is a short tag such as `gpu`, `4k` or `office-berlin`. This flag sets the labels of the **FFmate instance**. [Tasks](/docs/tasks.md), [presets](/docs/presets.md) and [watchfolders](/docs/watchfolder.md) get labels through their `labels` field. An FFmate instance only processes tasks and watchfolders whose labels match its own.
    *   **Value:** One or more labels, separated by commas. For example: `--labels="gpu,4k"`.
    *   **Default:** No labels.
    *   **Example:** Two FFmate instances, where only one machine has an NVIDIA graphics card:

        ```bash
        # FFmate instance A (machine with the graphics card)
        ffmate server --labels="gpu"

        # FFmate instance B (regular machine)
        ffmate server
        ```

        A task labelled `gpu` only runs on FFmate instance A. Tasks without labels run on whichever FFmate instance is free.
    *   **How matching works:**
        * Tasks and watchfolders **without** labels are processed by any FFmate instance.
        * Tasks and watchfolders **with** labels are only processed by an FFmate instance that has at least one of those labels.
        * An FFmate instance **without** labels only processes tasks and watchfolders that have no labels.
        * A task without its own labels inherits the labels of its preset.
        * A watchfolder is only watched by FFmate instances with a matching label. This is useful when the folder only exists on some machines.
        * Labels on tasks, presets and watchfolders can use `*` as a wildcard. For example, `gpu-*` matches an FFmate instance labelled `gpu-nvidia` or `gpu-amd`.

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
The full debugging guide can be found in the [debugging documentation](/docs/debugging.md).

# Update Command  

Checks for and applies new versions of the FFmate binary.  

* **Purpose:** Keep FFmate up to date with the latest release.  
* **Flags:**  
  * `--dry` — checks for updates without installing them.  
    * **Result:** Prints either `no newer version found` or `found newer version: X.Y.Z`. The binary itself is not modified.  
  * `--dev` — uses the **development** update channel instead of the stable one. Dev builds (for example `2.0.19-dev-19`) contain features that haven't been released yet and may be unstable. Don't use them in production.
    * Combine it with `--dry` to only check: `ffmate update --dev --dry`.  

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
version: 2.0.18
```