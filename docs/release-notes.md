---
title: FFmate Release Notes
description: Explore the latest FFmate release notes including new features, API changes, improvements, and bug fixes. Stay updated with every version of the open-source FFmpeg automation tool.
---

# FFmate Release Notes

An overview of new features, enhancements, and bug fixes for each version.

## Version 2.0.0 (19-09-2025)

FFmate 2.0 is here — a **complete rewrite** of the project, now powered by the excellent [Goyave](https://goyave.dev/) framework.
This rewrite introduces a more structured, maintainable, and efficient codebase — making it easier for contributors to get involved and shape FFmate’s future.
While we’ve aimed to stay mostly backward-compatible with 1.x, some adjustments to existing setups may be necessary.

### Deprecated

- The short version of command line arguments (e.g. `-p` for `--port`) is now marked as deprecated. Switch to the long version to ensure forward compatibility. This decision has been made due to the growing number of command line arguments, which makes it challenging to avoid conflicts with single-letter flags.

### UI

The UI design has been refreshed as a preparation step for a larger upcoming redesign.

::: tip UI images outdated
The images shown in this documentation are temporarily outdated and will be updated once the full UI redesign is complete.

In the meantime, the existing images should still be relevant and applicable to the current, interim design.
:::


### Breaking changes

- **Batch** endpoint has changed from `/api/v1/tasks/batch` to `/api/v1/batch[/{uuid}]`.
- **Batch** object format has been updated: it is now an object containing a `tasks` array instead of an array itself. This allows for future enhancements to the Batch feature.
- **LogLevel** command line argument has been removed in favor of [Debugo](https://github.com/yosev/debugo).

### New Features

- **Cluster Mode**: FFmate can now run in cluster mode, with multiple instances sharing the same **Postgres** database.
  This enables efficient distribution of `tasks` across nodes.
  See the [cluster documentation](/docs/cluster.md) for details. (Single-instance setups with SQLite are still fully supported.)
  - Nodes communicate with each other through a dedicated **Postgres** database.
  - Uses Postgres PUB/SUB for real-time updates and notifications.
  - Maximum payload size: **8 KB**.
  - Messages are Brotli-compressed, reducing size by ~40%.
  - Messages can be added through any cluster member.
  - The web interface is available on every cluster member.

- **Clients Endpoint**: Added an endpoint to list all connected clients.
  See the [client documentation](/docs/client.md).
  - Clients use the `--identifier` flag (defaults to hostname).
  - Identifiers must be unique across a cluster.
  - The current instance’s client will include `"self": true`.

- **Identifier Argument**: New CLI argument to name an FFmate instance, especially useful in cluster mode.
  See the [command-line documentation](/docs/command-line.md).
  - Assigns a unique name to the client (falls back to hostname if not set).

- **UI Refresh**: The UI has been modernized as a first step toward a more polished and consistent experience, with additional improvements planned for future releases.

- **Logging Overhaul**: Logging now uses [Debugo](https://github.com/yosev/debugo) exclusively, enabling fine-grained log control.
  - Debugo is now the sole logging system.
  - Configure logging with the `--debug` flag.
  - Default namespace: `info:?,warn:?,error:?`.

- **Health Endpoint**: Added to support orchestration tools like Kubernetes.
  See the [health documentation](/docs/health.md).
  - Returns `{"status": "ok"}` (HTTP 200) if ready, or `{"status": "error"}` (HTTP 500) if not.

- **Extended Metrics**: Additional gauges have been added for better observability.
  - `webhook.executed.direct` — for direct webhooks.
  - `webhook.updated` — for webhook updates.
  - `websocket.broadcast` — for websocket broadcasts.
  - `websocket.connect` — for new websocket connections.
  - `websocket.disconnect` — for websocket disconnections.

- **Direct Webhooks**: You can now send individual direct webhooks with tasks and presets.
  See the [webhooks documentation](/docs/webhooks.md).
  - Presets can include direct webhooks of type: `PRESET_CREATE`, `PRESET_UPDATE`, `PRESET_DELETE`, `TASK_CREATE`, `TASK_UPDATE`, `TASK_DELETE`.
  - `TASK_*` webhooks apply to every task created with that preset (e.g., from a watchfolder).
  - Direct webhooks trigger **after** and **independently** of global webhooks.

- **Webhook Persistence & Retries**: Webhook executions are now stored in the database and visible in the frontend.
  Failed executions are retried automatically three times with 3s, 5s, and 10s delays.

- **Compression Support**: Added Brotli, Gzip, and Deflate compression for smaller HTTP responses.
  - Automatically compresses responses for clients that support it (such as browsers).
  - Compression method is chosen based on the `Accept-Encoding` header.

- **Watchfolder Enhancements**: Watchfolders now support locking for safer concurrent processing and restart-safe execution.
  See the [watchfolder documentation](/docs/watchfolder.md).
  - A watchfolder will only run on one cluster member at a time.
  - Files processed into tasks receive a persistent `.lock` file, preventing reprocessing after restarts.
  - Deleting the `.lock` file allows the watchfolder to process the file again.

- **Task Queue Improvements**: The task queue now fetches multiple files from the database until `maxConcurrentRequests` is reached, improving efficiency.

- **Client-Linked Tasks**: Tasks are now associated with the client that created and executed them.
  - Each task tracks the originating client.
  - The client that executes the task overrides the creator link.

- **Test Coverage**: Expanded and improved the test suite for more robust, reliable releases.

### Improvements

- **Config gathering** has been reworked to be more efficient and thread-safe.

### Bug Fixes

- Race conditions have been resolved for watchfolders, tasks, and config handling.

### Changes

- Once **FFmpeg** is detected, automatic **FFmpeg detection** is no longer repeated, saving ressources.

## Version 1.2.0 (08-09-2025)

### New Features

- **`${FFMPEG}` Wildcard**
  Added a wildcard that resolves to the configured FFmpeg binary path. For details, see the [wildcards](/docs/wildcards.md#ffmpeg-path).

- **FFmpeg Command Chaining with `&&`**
  You can now chain multiple FFmpeg commands in a single task using `&&`. For details, see the [task properties](/docs/tasks.md#task-properties).

- **Task Metadata Wildcard**
  Added `${METADATA_<json-path>}` to resolve values from the task’s `metadata` object across commands, inputs, outputs, and scripts. For details, see the [wildcards](/docs/wildcards.md#task-metadata).

- **Watchfolder Metadata**
  Tasks created by watchfolders now include file information under `metadata.ffmate.watchfolder` (fields include `path`, `relativeDir`, `relativePath`, and the watchfolder `uuid`). For details, see the [watchfolder](/docs/watchfolder.md#how-watchfolders-work).

- **Sidecar Re-Import in Pre-Processing**
  Added the option to re-import the task’s `sidecar` after the pre-processing script finishes. For details, see the [Pre-Post Processing](/docs//pre-post-prcessing.md#importing-a-task-s-sidecar).

- **Webhooks API: Get & Update**
  Added new REST endpoints to retrieve a single webhook and to update an existing webhook. For details, see the [webhooks](/docs/webhooks.md).

- **Webhooks in the Web UI**
  The web UI now supports creating, viewing, and updating webhooks. For details, see the [webui](/docs/web-ui.md#webhooks).

### Changes

- **Progress Output Throttling**
  FFmate now adds `-stats_period 1` to every FFmpeg command, limiting progress output to one update per second. For details, see the [task](/docs/tasks.md#task-properties).

- **Docker Image Tools**
  The Docker image now includes `bash` and `jq`.

- **Docker Environment Variable Rename**
  In the Dockerfile, the `DB` environment variable has been replaced with `DATABASE`.

- **Go Runtime Update**
  Updated Go to version `1.25.0`.

## Version 1.1.0 (14-07-2025)

### New Features

- **Automatic Output Folder Creation**
  FFmate now creates output directories automatically if they do not exist.

- **FFmpeg Detection**
  FFmate checks for FFmpeg in the system’s default PATH or the location specified by the `--ffmpeg` flag, and logs a warning in both the web UI and logs if it’s not found.

### Changes

- **Docker Debug Mode Disabled by Default**
  The Docker image now ships with debugging turned off by default.

- **Removed AI Endpoint and flag**
  The `/ai` endpoint and the `--ai` flag introduced in v1.0.8 have been removed in favor of a future database-driven configuration setting.

### Bug Fixes

- **Script Error Logging**
  FFmate now logs stderr output when a pre- or post-process script exits with a non-zero code.

## Version 1.0.8 (29-05-2025)

### New Features

- **Windows Support**
  FFmate is now fully compatible with Windows. A dedicated installer is available for download — [get it here](https://github.com/welovemedia/ffmate/releases/tag/1.0.8).

- **New API Endpoint: `/client`**
  Introduced a new endpoint that returns detailed information about the client environment, including system architecture, operating system, and FFmate version.

- **FFmate AI (Preview)**
  Initial support for the upcoming FFmate AI assistant is now available. This release includes:
  - A new `--ai` flag to enable AI-related features
  - A new `/ai` REST endpoint to retrieve model-related information

- **Suspend Watchfolder Scanning**
  A `suspended` flag has been added to enable temporary pausing of active watchfolders without removing or modifying their configuration.

### Improvements

- **Automatic Update Checks**
  FFmate now performs periodic checks for new releases. When an update is available, a notification appears in the web UI or is printed to the console in headless mode.

### Bug Fixes

- **Reduced CPU Usage in Queue Processing**
  Resolved an issue where the task update loop executed too frequently, resulting in high CPU usage.
