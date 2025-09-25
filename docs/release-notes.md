---
title: FFmate Release Notes
description: Explore the latest FFmate release notes including new features, API changes, improvements, and bug fixes. Stay updated with every version of the open-source FFmpeg automation tool.
---

# FFmate Release Notes

An overview of new features, enhancements, and bug fixes for each version.

## Version 2.0.0 (25-09-2025)

FFmate 2.0 is a **complete rewrite** of the project, powered by the amazing [Goyave](https://goyave.dev/) framework. This new version delivers a more structured, maintainable, and efficient codebase, paving the way for community members to get involved and shape FFmate’s future.  
While we’ve aimed to remain mostly backward-compatible with 1.x, some adjustments to existing setups may be necessary.

### Breaking Changes

- **Task Batch**  
  The endpoint has changed from `/api/v1/tasks/batch` to `/api/v1/batch[/{uuid}]`. For details, see [Batch Task](/docs/tasks.md#submitting-multiple-tasks-as-a-batch).

- **Task Batch Format**  
  The batch object format has been updated: it is now an object containing a `tasks` array instead of being an array itself. This change allows for future enhancements to the Batch feature. For details, see [Batch Task](/docs/tasks.md#submitting-multiple-tasks-as-a-batch).

- **Log Level**  
  The command-line argument for log level has been removed in favor of [Debugo](https://github.com/yosev/debugo). For details, see [Debugging](/docs/debugging.md).

### Deprecated

- **Command-Line Arguments**  
  The short version of command-line arguments (e.g., `-p` for `--port`) is now deprecated. Switch to the long version to ensure forward compatibility.  
  This change was made due to the growing number of arguments, which makes it difficult to avoid conflicts with single-letter flags. For details, see [CLI](/docs/flags.md).

### New Features

- **Cluster Mode**  
  FFmate can now run in cluster mode with multiple instances sharing the same **Postgres** database. For details, see [Clustering](/docs/clustering.md).

- **Clients Endpoint**  
  Added an endpoint to list all FFmate instances connected to the cluster. For details, see [Listing Cluster Clients](/docs/ffmate-internals.md#client-endpoint).

- **Identifier Argument**  
  Added a new CLI argument to set the name for each FFmate instance, making it easier to recognize. For details, see [--identifier](/docs/flags.md#server-command-flags).

- **Health Endpoint**  
  Added a new `/health` endpoint that orchestration tools like Kubernetes can use to monitor the health of an FFmate instance. For details, see [Health Endpoint](/docs/ffmate-internals.md#health-endpoint).

- **Extended Metrics**  
  Added new gauges for `webhooks` and `websocket`. For details, see [Metrics](/docs/ffmate-internals.md#metrics).

- **Direct Webhooks**  
  Added support for fine-grained webhooks in tasks and presets. For details, see [Global and Direct Webhooks](/docs/webhooks.md).

- **Webhook Logs & Retries**  
  Webhook executions are now persistently stored in the database, and failed deliveries are retried automatically. For details, see [Webhook Logs](/docs/webhooks.md#webhook-logs) and [Webhook Retries](/docs/webhooks.md#setting-up-your-webhook-endpoint).

- **Watchfolder Lock**  
  Watchfolders now create `.lock` files for processed items. These prevent files from being reprocessed after restarts. For details, see [Watchfolder Lock](/docs/watchfolder.md#how-watchfolders-work).

- **UI Refresh**  
  The UI has been modernized as a first step toward a more polished and consistent experience, with more improvements planned.  
  Images in this [documentation](/docs/web-ui.md) are temporarily outdated and will be updated once the full UI redesign is complete.

### Improvements

- **Test Coverage**  
  Test coverage has been expanded to cover all major core components of the codebase.

### Bug Fixes

- **Race Conditions**  
  Multiple race conditions have been resolved in watchfolders, tasks, and config handling.

### Changes

- **FFmpeg Detection**  
  In version 2.0, **FFmpeg** detection now runs once and is not repeated, saving resources.

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
