---
title: "FFmate Debugging: Log Namespaces, --debug Flag and REST API"
description: "Control which log messages FFmate prints with namespaces such as debug:task, set with the --debug flag, the DEBUGO variable in Docker or the REST API."
---

# Debugging

FFmate can print debug messages for single components, such as `task`, `webhook` or `watchfolder`. The `--debug` flag selects them.

## Enabling Debug Mode

Debug logging is turned on in two ways:

1.  **Using the Command-Line Flag:**
    *   The `--debug` flag sets the namespaces when starting `ffmate server`.
    *   **Syntax:** `ffmate server --debug="<namespaces>"`
    *   **Example:** `ffmate server --debug="error:?,*:task"`

2.  **Using the Docker Environment Variable:**
    *   In the FFmate Docker image, the `DEBUGO` environment variable sets `--debug`. Default: `info:?,warn:?,error:?`.
    *   **Example:** `docker run -e DEBUGO="*" ghcr.io/welovemedia/ffmate:latest`
    *   Outside Docker, FFmate doesn't read `DEBUGO`. Use `--debug` instead.

## Understanding Namespaces

Every log message in FFmate belongs to a **namespace**. A namespace is a label that describes two things:  

1. **Severity** – the log level: `info`, `debug`, `warn` or `error`.  
2. **Component** – the part of FFmate the message comes from, for example `task`, `ffmpeg` or `http`. Some messages have no component and use the severity alone, e.g. `info` or `error`.  

They're combined in a `severity:component` format. For example:  

- `error:task` → logs an error that occurred in task processing
- `debug:http` → logs debug information for each HTTP request

The `--debug` flag selects which of these namespaces FFmate prints.  

### Info Namespaces

* `info` – General messages without a component. They cover the startup steps, such as the version, the database connection and the port, and whether FFmpeg was found. They also log when tasks are canceled, restarted or deleted, when webhooks are created, updated or deleted, and when the debug namespaces change. In a [cluster](/docs/clustering.md), they log when the cluster listener and notifier start.
* `info:task` – Logs the major stages of a task's lifecycle: when it's created, when it's picked from the queue, when pre- and post-processing finish, and when it's canceled or finishes successfully.
* `info:watchfolder` – Logs when a new watchfolder is created, when its settings are updated, or when it is deleted.
* `info:preset` – Logs when a preset is created or deleted.

*   **Example:** Use `--debug="info:?"` to log only `info` and its children, such as `info:task`.

### Debug Namespaces

* `debug:service` – Logs each internal service as it starts, for example the task, webhook and watchfolder services. If FFmate stops during startup, the last service in the log shows where it stopped.
* `debug:http` – Logs every API request FFmate receives with its HTTP method and path, for example `GET "/api/v1/tasks"`.
* `debug:controller` – Logs the API endpoints, such as `/tasks` and `/presets`, as they become active during startup. This namespace is only needed when working on the FFmate source code.
* `debug:websocket` – Logs every time a client, such as the Web UI, connects to or disconnects from the WebSocket server. In a [cluster](/docs/clustering.md), it also logs every update sent to and received from the other FFmate instances. Use it to check that the FFmate instances in a cluster are communicating over the shared PostgreSQL database.
* `debug:client` – Logs the name the FFmate instance uses, for example `initiated client as 'ffmate-a'`. Every 15 seconds, the FFmate instance saves its entry in the database and logs `client info updated`.
* `debug:ffmpeg` – Logs the progress of a running FFmpeg process, with details such as frame number, FPS, bitrate and speed.
* `debug:task` – Logs each step of task processing. It logs every check of the queue for new tasks, for example `no queued tasks found`. It also logs when FFmpeg starts and finishes and when a task is retried. Turn it on when tasks stay `QUEUED` and no FFmate instance picks them up.
* `debug:watchfolder` – Logs each watchfolder scan and every task created for a new file. It also logs why a scan was skipped. For example, the watchfolder is suspended, its labels don't match or another FFmate instance is scanning it.
* `debug:webhook` – Logs every webhook FFmate sends and every delivery it records. If an application doesn't receive notifications, this log shows whether FFmate sends them.
* `debug:middleware` – Logs the registration of background request processors, like the compression or the `debug:http` logger itself. This namespace is only needed when working on the FFmate source code.

*   **Example:** To debug a failing task, use `--debug="debug:http,debug:task"`. It shows every incoming API call and each step of task processing.

### Warn Namespaces

* `warn:task` – Logs when a task has finished with a `DONE_ERROR` status, or when FFmate couldn't put a failed task back into the queue for a retry.
* `warn:websocket` – Logs when the internal message queue is full. A real-time update, such as a task progress change, is then dropped and not passed on to the Web UI.

*   **Example:** Use `--debug="warn:?"` to see only warnings, for example a task that ended as `DONE_ERROR` or an update that was dropped.

### Error Namespaces

* `error` – Most failures without a specific component, for example database errors, failed webhook deliveries or a failed server start.
* `error:ffmpeg` – Logs an error if FFmate fails to read the real-time progress output from a running FFmpeg process. This is an error in the monitoring of FFmpeg, not an error from the FFmpeg command itself.
* `error:task` – Logs when FFmpeg can't be found, and when FFmate fails to save a task, retry a task or clean up the tasks of a stopped FFmate instance.
* `error:watchfolder` – Logs when a watchfolder scan fails, for example because the folder doesn't exist.
* `error:preset` – Logs when updating or deleting a preset fails.
* `error:telemetry` – Logs any failure that occurs while FFmate tries to send anonymous usage data, such as a network error or a problem connecting to the telemetry server.
* `error:websocket` – Logs a critical failure in the cluster communication, most often caused by a lost connection to the PostgreSQL database or an issue with its `LISTEN/NOTIFY` feature.

*   **Example:** Use `--debug="error:?"` to log only errors, from every component.

### Filtering Rules

The value of `--debug` is a comma-separated list of rules.

*   **`*` – Match Everything**
    *   **Example:** `ffmate server --debug="*"`
    *   **Result:** Shows every log message from all namespaces.

*   **`name` – Match Only the Parent Namespace**
    *   **Example:** `ffmate server --debug="warn"`
    *   **Result:** Shows logs from the `warn` namespace itself, but not from its children, such as `warn:task` or `warn:websocket`.

*   **`name:*` – Match Only Child Namespaces**
    *   **Example:** `ffmate server --debug="debug:*"`
    *   **Result:** Shows all logs from every child of `debug`, such as `debug:http` and `debug:task`, but not from the parent `debug` namespace itself.

*   **`name:?` – Match a Parent and All Its Children**
    *   **Example:** `ffmate server --debug="info:?"`
    *   **Result:** Shows logs from the parent `info` namespace and all of its children, such as `info:task` and `info:preset`. This is the rule used in the default setting: `info:?,warn:?,error:?`.

*   **`-` – Exclude Namespaces**
    *   **Example:** `ffmate server --debug="*,-debug:?"`
    *   **Result:** Shows everything except logs from the `debug` parent and all of its children. That leaves `info`, `warn`, `error` and their children.

*   **`,` – Combine Multiple Rules**
    *   **Example:** `ffmate server --debug="error:?,*:task,debug:http"`
    *   **Result:** Creates a filter that shows:
        1.  All logs from the `error` namespace and its children.
        2.  All logs of the `task` component at every level: `info:task`, `debug:task`, `warn:task` and `error:task`.
        3.  All incoming HTTP requests from the `debug:http` namespace.


### Common Examples

| Goal                                                | Command                                                |
| --------------------------------------------------- | ------------------------------------------------------ |
| **Default: status, warnings and errors**            | `ffmate server` or `--debug="info:?,warn:?,error:?"`   |
| **See everything**                                  | `ffmate server --debug="*"`                            |
| **See all `info` + `error` logs**                   | `ffmate server --debug="info:?,error:?"`               |
| **Focus on tasks and watchfolders**                 | `ffmate server --debug="*:task,*:watchfolder"`         |
| **See all errors + API calls**                      | `ffmate server --debug="error:?,debug:http"`           |
| **Everything except debug noise**                   | `ffmate server --debug="*,-debug:?"`                   |
| **No logs**                                         | `ffmate server --debug=""`                             |


## Setting Debug from the API

Two API endpoints change the debug namespaces while FFmate runs. For example, detailed logging can be turned on for a live system without a restart:

*   **`PATCH /api/v1/debug/{namespace}`**
    *   **Purpose:** Sets the active debug namespaces. The [{namespace}](#understanding-namespaces) part of the URL should be your comma-separated filter string.
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

- **`HH:MM:SS.mmm`** – Timestamp with hours, minutes, seconds and milliseconds
- **`namespace`** – The severity and component that generated the message, e.g. `info:task`
- **`MESSAGE`** – The actual log content
- **`+TIME`** – Time since the previous message in the same namespace, e.g. `+12ms`

In a terminal, the namespace is shown in color.

**Example:**

```
10:05:15.123 info:task processing task (uuid: 9b3c1e2a-4f5d-4c6b-8a7e-1d2f3a4b5c6d) +3ms
```
