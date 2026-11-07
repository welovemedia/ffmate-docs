---
title: "FFmate Command-Line Flags: Server, Update & Global Options"
description: "Every flag of the FFmate server, update and version commands, with defaults and examples for host, port, basic auth, database, labels and debug output."
---

# Command-Line Interface (CLI)

The FFmate command-line interface starts and updates FFmate. Every call follows the pattern `ffmate [command] [flags]`. There are three commands. `server` starts FFmate. `update` checks for a newer version and installs it. `version` prints the installed version.

To see all commands and their flags, run:  
```bash
ffmate --help
ffmate <command> --help
```

## Server Command Flags

The `server` command starts FFmate. The flags in this section only apply to `server`.

*   **`--ffmpeg <path>`** or **`--ffmpeg="<path>"`**
    *   **Purpose:** Sets the path to the `ffmpeg` executable.
    *   **Value:** The full path to your `ffmpeg` binary.
    *   **Default:** `ffmpeg`. FFmate looks for `ffmpeg` in the folders listed in `PATH`.
    *   **Example:** `ffmate server --ffmpeg="/usr/local/bin/ffmpeg"`

*   **`--host <address>`** or **`--host="<address>"`**
    *   **Purpose:** Sets the network interface FFmate listens on.
    *   **Value:** An IP address or hostname. Use `127.0.0.1` to only accept connections from the same machine.
    *   **Default:** `0.0.0.0`. FFmate listens on all network interfaces, so other machines can reach it.
    *   **Example:** `ffmate server --host="127.0.0.1"`

    ::: danger Anyone who can reach FFmate can run commands on this machine
    With the default `0.0.0.0` and no `--basic-auth`, FFmate accepts API requests from any machine that can reach its port, without a password. Tasks and presets can define a [`scriptPath`](/docs/pre-post-prcessing.md), which FFmate runs as a system command. So anyone with network access can run any command, with the same permissions as the FFmate process.

    * Only using FFmate on this machine? Use `--host 127.0.0.1`.
    * Need access from other machines? Enable `--basic-auth`, and only allow the machines that need it through your firewall.
    * Never expose FFmate directly to the internet.
    * Run FFmate as a dedicated user without admin or `root` rights, so scripts can only touch what that user can.
    :::

*   **`--basic-auth <username:password>`** or **`--basic-auth="<username:password>"`**
    *   **Purpose:** Protects the API, Web UI, WebSocket, Swagger, `/health` and `/metrics` with HTTP basic authentication.
    *   **Value:** `username:password`. Everything after the first `:` is the password. FFmate exits on startup if the value has no `:`.
    *   **Default:** Disabled. FFmate asks for no username or password.
    *   **Example:** `ffmate server --basic-auth="admin:a-long-random-password"`
    *   **What's protected:** every route: the API, Web UI, WebSocket (`/api/v1/ws`), Swagger, `/health` and `/metrics`. Requests without valid credentials get `401 Unauthorized`.
    *   **Calling the API:** send the credentials with every request, e.g. `curl -u admin:a-long-random-password http://ffmate-host:3000/api/v1/tasks`.
    *   **Health checks and monitoring:** anything that calls FFmate automatically also needs the credentials. That includes Docker or Kubernetes health checks, load balancers, and the Prometheus scrape config (`basic_auth`).
    *   **Clusters:** set `--basic-auth` on **every** FFmate instance. All FFmate instances share one database, so a task created through one unprotected FFmate instance can be picked up by any other.

    ::: warning Basic auth doesn't encrypt anything
    FFmate serves plain HTTP, so the username and password travel unencrypted. If traffic leaves the machine, run FFmate with `--host 127.0.0.1` behind a reverse proxy that serves HTTPS, for example [nginx](https://nginx.org/), [Caddy](https://caddyserver.com/) or [Traefik](https://doc.traefik.io/traefik/).
    :::

    ::: info Note
    The Web UI receives live updates over a WebSocket connection (`/api/v1/ws`), so your proxy must allow WebSocket connections. Caddy and Traefik do this automatically; nginx needs [extra configuration](https://nginx.org/en/docs/http/websocket.html).
    :::

*   **`--port <port_number>`** or **`--port="<port_number>"`**
    *   **Purpose:** Sets the port FFmate listens on for the API and the Web UI.
    *   **Value:** A valid port number.
    *   **Default:** `3000`
    *   **Example:** `ffmate server --port="8080"`

* **`--database <value>`** or **`--database="<value>"`**

  * **Purpose:** Sets where FFmate stores its data, for example tasks, presets and webhooks. A single FFmate instance uses **SQLite** by default. A cluster of FFmate instances uses **PostgreSQL**.
  * **Value:**
    * **SQLite file path:** FFmate uses SQLite out of the box. By default, the database is created at:

        * Windows: `%APPDATA%\ffmate\db.sql`
        * macOS/Linux: `~/.ffmate/db.sqlite`
        * Docker: `/app/db/sqlite.db`

        You can specify an alternative location by passing the full file path with `--database`.

    * **Examples:**

        ```
        # Unix example
        ffmate server --database="~/ffmate/data/production.sqlite"

        # Windows example
        ffmate server --database="C:\Users\YourName\AppData\Roaming\ffmate\data.sqlite"
        ```

    * **PostgreSQL URI:** For a cluster of several FFmate instances, pass a PostgreSQL URI that starts with `postgresql://`. FFmate then runs in **cluster mode**, and all FFmate instances share the same database.
    
    * **Connection URI:**

        ```
        postgresql://user:password@host:port/dbname?options
        ```

        * `port` is optional and defaults to `5432`.
        * `options` are optional PostgreSQL connection parameters written as `key=value`, for example `sslmode=require` or `connect_timeout=10`. FFmate passes them to the PostgreSQL driver as they are.
        * Several options are joined with `&`.

        ```
        # Single option
        postgresql://ffuser:ffpass@db.internal/ffmatedb?sslmode=require

        # Several options
        postgresql://ffuser:ffpass@db.internal:6432/ffmatedb?sslmode=require&connect_timeout=10
        ```

        ::: tip
        If your password contains special characters such as `@`, `:`, `/` or `?`, URL-encode them. For example, `@` becomes `%40`.
        :::

        ::: info
        The PostgreSQL database must exist before connecting an FFmate instance to it. FFmate creates the required tables and schema at startup if they don't exist yet.
        :::

    * **Example:**

        ```
        ffmate server --database="postgresql://ffuser:ffpass@localhost:5432/ffmatedb"
        ```

*   **`--identifier <name>`** or **`--identifier="<name>"`**
    *   **Purpose:** Assigns a unique name to an FFmate instance. In a cluster, the identifier tells the FFmate instances apart. The Web UI shows which FFmate instance is running each task.
    *   **Value:** A string representing the unique name for the FFmate instance.
    *   **Default:** The machine's hostname.
    *   **Example:** `ffmate server --identifier="ffmate-a"`

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
    *   **Purpose:** Sets the maximum number of tasks FFmate runs at the same time.
    *   **Value:** A positive integer.
    *   **Default:** `3`
    *   **Example:** `ffmate server --max-concurrent-tasks="5"`. Up to 5 tasks run at the same time.

*   **`--send-telemetry <true|false>`** or **`--send-telemetry=<true|false>`**
    *   **Purpose:** Controls whether FFmate sends anonymous usage data to `https://telemetry.ffmate.io`.
    *   **Value:** `true` or `false`.
    *   **Default:** `true`. FFmate sends telemetry.
    *   **Example:** `ffmate server --send-telemetry=false`

*   **`--no-ui`**
    *   **Purpose:** Prevents FFmate from opening the Web UI in the default browser when the server starts.
    *   **Default:** `false`. On startup, FFmate opens `http://localhost:<port>/ui` in the default browser. In Docker, FFmate never opens the browser.
    *   **Example:** `ffmate server --no-ui`

* **`--debug <namespaces>`** or **`-d <namespaces>`**

  * **Purpose:** Selects which parts of FFmate print debug messages, for example `task` or `watchfolder`. FFmate uses namespaces instead of fixed levels such as `INFO` or `ERROR`. The namespace system is built on [yosev/debugo](https://github.com/yosev/debugo), a Go library inspired by [debug-js](https://github.com/debug-js/debug).
  * **Default:** `info:?,warn:?,error:?`.
  * **Example:**

    ```bash
    ffmate server --debug="*:task,*:watchfolder"
    ```
For details, see [Debugging](/docs/debugging.md).

## Update Command

Checks for and applies new versions of the FFmate binary.  

* **Purpose:** Replaces the FFmate binary with the newest release.  
* **Flags:**  
  * `--dry` – Checks for updates without installing them.  
    * **Result:** Prints either `no newer version found` or `found newer version: X.Y.Z`. The binary itself is not modified.  
  * `--dev` – Uses the development update channel instead of the stable one. Dev builds, for example `2.1.0-dev-19`, contain features that haven't been released yet and may be unstable. Don't use them in production.
    * Combine it with `--dry` to only check: `ffmate update --dev --dry`.  

* **Default behavior:**  
  If a newer version is available, FFmate downloads it and replaces its own binary. It prints `updated to version: X.Y.Z`. Restart FFmate to use the new version.  

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

## Version Command

Prints the currently installed FFmate version and exits.  

* **Purpose:** Shows which version of FFmate is installed.  
* **Flags:** None  
* **Result:** Prints a single line to the console.  

**Example:**  
```bash
ffmate version
Output:
version: 2.0.18
```