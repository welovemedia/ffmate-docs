---
url: /docs/debugging.md
---
# Debugging

`FFmate` offers powerful, fine-grained debugging options that allow you to capture detailed debug information from specific internal components, making it easier to trace issues and understand what’s happening under the hood.

### Enabling Debug Mode

You can enable debug logging in two primary ways:

1. **Using the Command-Line Flag:**
   * The most common way is to use the global `-d` or `--debug` flag when running any `ffmate` command (especially `ffmate server`).
   * **Syntax:** `ffmate <command> --debug="<namespaces>"`
   * **Example:** `ffmate server --debug="*"`

2. **Using OS Environment Variable:**
   * You can set the environment variable before running `FFmate`.
   * **Syntax (Linux/macOS):** `DEBUGO="<namespaces>" ffmate server`
   * **Syntax (Windows PowerShell):** `$env:DEBUGO="<namespaces>"; ffmate server`
   * If both the flag and the environment variable are set, the command-line flag will take precedence.

### Understanding Namespaces

The core of `FFmate`'s debugging system is **namespaces**. When you enable debugging, you specify which namespaces you're interested in.

* **Wildcards:**
  * `*`: The asterisk acts as a wildcard, matching any sequence of characters.
    * `--debug="*"`: Enables **all** debug messages from every component. This is very verbose but useful for a general overview.
    * `--debug="sev:*"`: Enables all debug messages from components within the `sev` namespace (the internal framework).
    * `--debug="*ffmpeg*"`: Enables debug messages from any namespace containing "ffmpeg".
* **Exclusion:**
  * `-`: Prefixing a namespace with a hyphen excludes it.
  * `--debug="*,-gin"`: Enables all debug messages *except* those from the `gin` namespace.
  * `--debug="sev:*,-sev:metrics"`: Enables all `sev` messages except those specifically from `sev:metrics`.
* **Multiple Namespaces:**
  * You can specify multiple namespaces by separating them with commas.
  * `--debug="queue,ffmpeg,watchfolder"`: Enables debug messages only from the `queue`, `ffmpeg`, and `watchfolder` components.

### Debug Namespaces in FFmate

Below are some of the key namespaces used for debugging. They help generate detailed log output from specific components within `FFmate`:

* **`*` (Global Wildcard):**
  * **What to expect:** Extremely verbose output covering every debug message from all parts of `ffmate`, including internal framework (`sev`) operations, Gin request handling, database interactions (if enabled at that level), queue processing, webhook firing, etc.
  * **Use when:** You're unsure where a problem lies and need a broad overview, or when tracing a complex interaction across multiple components. Be prepared for a lot of output.

* **`gin`:**
  * **What to expect:** Logs related to the Gin web framework, such as incoming HTTP requests, route matching, and middleware execution. Useful for debugging API call issues.
  * **Example Log:** `gin [GIN] 2025/02/14 - 10:00:00 | 200 | 1.23ms | 127.0.0.1 | POST /api/v1/tasks`

* **`queue`:**
  * **What to expect:** Detailed logs about the task queue processor. This includes finding new tasks, task state transitions (e.g., moving from QUEUED to RUNNING), maximum concurrent task checks, and pre/post-processing script execution steps.
  * **Example Log:** `queue no queued tasks found` or `queue processing task (uuid: ...)` or `queue triggered preProcessing script (uuid: ...)`

* **`ffmpeg`:**
  * **What to expect:** Logs specifically from `ffmate`'s interaction with the `ffmpeg` binary. This primarily includes the real-time progress parsing from `ffmpeg`'s stderr. You'll see lines showing frame counts, FPS, bitrate, time, and speed. This namespace **does not** show the raw `ffmpeg` stderr itself (that's part of the main application log if an error occurs), but rather `ffmate`'s interpretation of it for progress.
  * **Example Log:** `ffmpeg progress: 25.50 {Frame:123 FPS:29.97 Bitrate:1500k Time:4.10 Speed:1.5x} (uuid: ...)`

* **`watchfolder`:**
  * **What to expect:** Information about the watchfolder processing, such as initialization, directory scanning, file state tracking (growth checks), and new task creation from watched files.
  * **Example Log:** `watchfolder initialized new watchfolder watcher (uuid: ...)` or `watchfolder created new task for watchfolder (uuid: ...) file: ...`

* **`sev:<component>` (Internal Framework):**
  * The `sev` namespace is for `ffmate`'s internal framework. You might use these for deeper debugging if you suspect an issue within the core application logic.
  * **`sev:webhook`**: Logs related to firing webhooks (e.g., "fired webhook for event 'task:created'").
  * **`sev:metrics`**: Logs about Prometheus metrics registration.
  * **`sev:controller`**: Logs related to controller registration.
  * **`sev:telemetry`**: Logs about sending telemetry data.
  * **`sev:middleware`**: Logs related to middleware registration or execution.

* **`websocket:controller` / `websocket:service`:**
  * **What to expect:** Logs related to WebSocket connections, disconnections, and messages being broadcast.
  * **Example Log:** `websocket:controller new connection from 127.0.0.1 (uuid: ...)`

* **`prometheus:register`:**
  * **What to expect:** Logs specifically detailing the registration of Prometheus metrics.
  * **Example Log:** `prometheus:register registered prometheus gauge 'task_created'`

### Setting debug from the API

`ffmate` provides API endpoints to change the debug namespaces *while the server is running*, without needing to restart it:

* **`PATCH /api/v1/debug/namespace/{namespaces}`**
  * **Purpose:** Sets the active debug namespaces.
  * **Example:** `curl -X PATCH http://localhost:3000/api/v1/debug/namespace/queue,ffmpeg`
* **`DELETE /api/v1/debug/namespace`**
  * **Purpose:** Turns off all debug logging (sets namespaces to empty).
  * **Example:** `curl -X DELETE http://localhost:3000/api/v1/debug/namespace`

This is extremely useful for enabling targeted debugging on a live system without disrupting its normal operation more than necessary.

Sure! Here's the improved version formatted in clean Markdown:

### Debug Message Format

All debug messages follow a consistent structure:

```
HH:MM:SS.mmm <NAMESPACE> <MESSAGE>
```

* **`HH:MM:SS.mmm`** – Timestamp showing hours, minutes, seconds, and milliseconds
* **`<NAMESPACE>`** – Identifies the component that generated the message
* **`<MESSAGE>`** – The actual debug log content

**Example:**

```
10:05:15.123 queue processing task (uuid: abc-123-def-456)
```
