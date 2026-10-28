---
title: "FFmate Debugging Guide: CLI Flags, Environment Variables, API & Key Log Namespaces"
description: "Troubleshoot FFmate with this debugging guide. Control log verbosity using namespaces, command-line flags, environment variables, or dynamically via the REST API"
---

# Debugging

FFmate offers powerful, fine-grained debugging options that allow you to capture detailed debug information from specific internal components, making it easier to trace issues and understand what’s happening under the hood.

## Enabling Debug Mode

You can enable debug logging in two ways:

1.  **Using the Command-Line Flag:**
    *   The most common way is to use the global `--debug` flag when running any `ffmate` command (especially `ffmate server`).
    *   **Syntax:** `ffmate server --debug="<namespaces>"`
    *   **Example:** `ffmate server --debug="error:?,*:task"`

2.  **Using OS Environment Variable:**
    *   You can set the environment variable before running FFmate.
    *   **Syntax (Linux/macOS):** `export DEBUGO="*"; ffmate server`
    *   **Syntax (Windows PowerShell):** `$env:DEBUGO="*"; ffmate server`
    *   If both the flag and the environment variable are set, the command-line flag will take precedence.

## Understanding Namespaces

Every log message in FFmate belongs to a **namespace**. You can think of these namespaces as structured labels that describe two things:  

1. **Severity** – the log level (`info`, `debug`, `warn`, `error`).  
2. **Component** – the part of the system the message comes from (`task`, `ffmpeg`, `http`, etc.). Some messages have no component and use the severity alone, e.g. `info` or `error`.  

They’re combined in a `severity:component` format. For example:  

- `error:task` → logs an error that occurred in task processing
- `debug:http` → logs debug information for each HTTP request

The `--debug` flag lets you filter by these labels, so you control exactly what shows up in your logs.  

#### **info** – general, high-level messages

* `info` – General messages without a component: startup steps (version, database connection, port), whether FFmpeg was found, when tasks are canceled, restarted or deleted, when webhooks are created, updated or deleted, when the debug namespaces change, and, in a [cluster](/docs/clustering.md), when the cluster listener and notifier start.
* `info:task` – Logs the major stages of a task's lifecycle: when it's created, when it's picked from the queue, when pre- and post-processing finish, and when it's canceled or finishes successfully.
* `info:watchfolder` – Logs when a new watchfolder is created, when its settings are updated, or when it is deleted.
* `info:preset` – Logs when a preset is created or deleted.

*   **Example:** Use `--debug="info:?"` to get a high-level overview of what the application is doing without low-level details.

#### **debug** – detailed messages for troubleshooting

* `debug:service` – Logs each major internal component (like the Task processor, Webhook sender, etc.) as it starts up. Use this if FFmate fails to start. The last service logged before the crash can help pinpoint the problem.
* `debug:http` – Logs every single API request that FFmate receives, including the HTTP method (GET, POST) and the path (e.g., /api/v1/tasks).
* `debug:controller` – Logs the API endpoints (like /tasks, /presets) as they become active during startup. This is primarily for debugging the FFmate application itself. You generally won't need this unless you are modifying the source code.
* `debug:websocket` – Logs every time a client (like the Web UI) connects to or disconnects from the WebSocket server. In a [cluster](/docs/clustering.md), it also logs every update sent to and received from the other FFmate instances. Use it to check that the FFmate instances in a cluster are communicating over the shared PostgreSQL database.
* `debug:client` – Logs the "heartbeat" of the FFmate instance. It logs the unique name the instance is using and a confirmation message every 15 seconds that it's connected to the database.
* `debug:ffmpeg` – Logs the real-time progress of an active FFmpeg job, showing details like frame number, FPS, bitrate, and speed.
* `debug:task` –  Provides the most detailed, step-by-step view of the entire task processing system. It shows when the queue is checked for new jobs, when a task is picked up, and when its status changes. Turn this on when jobs seem to be "stuck" in the queue or are not being picked up as expected.
* `debug:watchfolder` – Logs each watchfolder scan, why a scan was skipped (suspended, labels don't match, or another FFmate instance is scanning it), and every task created for a new file.
* `debug:webhook` – Logs every webhook FFmate sends and every delivery it records. If your application isn't receiving notifications, this log will tell you if FFmate is sending them.
* `debug:middleware` – Logs the registration of background request processors, like the compression or the `debug:http` logger itself. This is primarily for debugging the FFmate application itself. You generally won't need this unless you are modifying the source code.

*   **Example:** Use `--debug="debug:http,debug:task"` to see every incoming API call and all the detailed, verbose steps of the task processing queue, which is ideal for debugging a failing task.

#### **warn** – warnings about possible issues

* `warn:task` – Logs when a task has finished with a `DONE_ERROR` status, or when FFmate couldn't put a failed task back into the queue for a retry.
* `warn:websocket` – Logs when the internal message queue is full, which means a real-time update (like a task progress change) had to be dropped and was not passed on to the Web UI.

*   **Example:** Use `--debug="warn:?"` to see only potential problems, like a task that failed but didn't crash the system, or an update that was dropped.

#### **error** – errors and failures

* `error` – Most failures without a specific component, e.g. database errors, failed webhook deliveries, or a failed server start.
* `error:ffmpeg` – Logs an error if FFmate fails to read or parse the real-time progress output from a running FFmpeg process. This is an error in the monitoring of FFmpeg, not an error from the FFmpeg command itself.
* `error:task` – Logs when FFmpeg can't be found, and when FFmate fails to save a task, retry a task, or clean up the tasks of a stopped FFmate instance.
* `error:watchfolder` – Logs when a watchfolder scan fails, e.g. because the folder doesn't exist.
* `error:preset` – Logs when updating or deleting a preset fails.
* `error:telemetry` – Logs any failure that occurs while FFmate tries to send anonymous usage data, such as a network error or a problem connecting to the telemetry server.
* `error:websocket` – Logs a critical failure in the cluster communication, most often caused by a lost connection to the PostgreSQL database or an issue with its `LISTEN/NOTIFY` feature.

*   **Example:** Use `--debug="error:?"` in a production environment to log only critical failures, ensuring you capture every error from any part of the application for immediate attention.

### Filtering Rules

The value for `--debug` is a comma-separated string of rules that you can combine to create a precise logging output.

*   **`*` – Match Everything**
    *   **Example:** `ffmate server --debug="*"`
    *   **Result:** Shows every single log message from all namespaces. This is the best option for maximum verbosity.

*   **`name` (e.g., `debug`) – Match a Parent Namespace ONLY**
    *   **Example:** `ffmate server --debug="warn"`
    *   **Result:** Shows logs from the `warn` namespace itself, but will **not** show logs from its children, like `warn:task` or `warn:websocket`.

*   **`name:*` (e.g., `debug:*`) – Match Child Namespaces ONLY**
    *   **Example:** `ffmate server --debug="debug:*"`
    *   **Result:** Shows all logs from every child of `debug` (e.g., `debug:http`, `debug:task`) but will **not** show logs from the parent `debug` namespace itself.

*   **`name:?` (e.g., `debug:?`) – Match a Parent AND All Its Children**
    *   **Example:** `ffmate server --debug="info:?"`
    *   **Result:** Shows logs from the parent `info` namespace **and** all of its children (`info:task`, `info:preset`, etc.). This is the rule used in the default setting: `info:?,warn:?,error:?`.

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


## Setting debug from the API

FFmate provides API endpoints to change the debug namespaces *while the server is running*, which is extremely useful for enabling detailed logging on a live system without a restart:

*   **`PATCH /api/v1/debug/{namespaces}`**
    *   **Purpose:** Sets the active debug namespaces. The [{namespaces}](#understanding-namespaces) part of the URL should be your comma-separated filter string.
    *   **Example:** To see only task and webhook logs:

        ```sh
        curl -X 'PATCH' \
        'http://localhost:3000/api/v1/debug/*:task,*:webhook' \
        -H 'accept: application/json'
        ```
        FFmate responds with a `204` No Content status.

*   **`DELETE /api/v1/debug`**
    *   **Purpose:** Turns off all logging by resetting the namespace filter to an empty string.
    *   **Example:** 

        ```sh
        curl -X 'DELETE' \
        'http://localhost:3000/api/v1/debug' \
        -H 'accept: application/json'
        ```
        FFmate responds with a `204` No Content status.

## Debug Message Format

All debug messages follow a consistent structure:

```
HH:MM:SS.mmm namespace MESSAGE +TIME
```

- **`HH:MM:SS.mmm`** – Timestamp (hours, minutes, seconds, and milliseconds)
- **`namespace`** – The severity and component that generated the message, e.g. `info:task`
- **`MESSAGE`** – The actual log content
- **`+TIME`** – Time since the previous message, e.g. `+12ms`

In a terminal, the namespace is shown in color.

**Example:**

```
10:05:15.123 info:task processing task (uuid: 9b3c1e2a-4f5d-4c6b-8a7e-1d2f3a4b5c6d) +3ms
```
