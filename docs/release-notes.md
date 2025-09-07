---
title: FFmate Release Notes
description: Explore the latest FFmate release notes including new features, API changes, improvements, and bug fixes. Stay updated with every version of the open-source FFmpeg automation tool.
---
# FFmate Release Notes  
An overview of new features, enhancements, and bug fixes for each version.

## Version 1.2.0 (08-09-2025)

### New Features

  -  **`${FFMPEG}` Wildcard**  
      Added a wildcard that resolves to the configured FFmpeg binary path. For details, see the [wildcards](/docs/wildcards.md#ffmpeg-path).

-  **FFmpeg Command Chaining with `&&`**  
  You can now chain multiple FFmpeg commands in a single task using `&&`. For details, see the [task properties](/docs/tasks.md#task-properties).

-  **Task Metadata Wildcard**  
  Added `${METADATA_<json-path>}` to resolve values from the task’s `metadata` object across commands, inputs, outputs, and scripts. For details, see the [wildcards](/docs/wildcards.md#task-metadata).

-  **Watchfolder Metadata**  
  Tasks created by watchfolders now include file information under `metadata.ffmate.watchfolder` (fields include `path`, `relativeDir`, `relativePath`, and the watchfolder `uuid`). For details, see the [watchfolder](/docs/watchfolder.md#how-watchfolders-work).

-  **Sidecar Re-Import in Pre-Processing**  
  Added the option to re-import the task’s `sidecar` after the pre-processing script finishes. For details, see the [Pre-Post Processing](/docs//pre-post-prcessing.md#importing-a-task-s-sidecar).

-  **Webhooks API: Get & Update**  
  Added new REST endpoints to retrieve a single webhook and to update an existing webhook. For details, see the [webhooks](/docs/webhooks.md).

-  **Webhooks in the Web UI**  
  The web UI now supports creating, viewing, and updating webhooks. For details, see the [webui](/docs/web-ui.md#webhooks).

### Changes

-  **Progress Output Throttling**  
  FFmate now adds `-stats_period 1` to every FFmpeg command, limiting progress output to one update per second. For details, see the [task](/docs/tasks.md#task-properties).

-  **Docker Image Tools**  
  The Docker image now includes `bash` and `jq`.

-  **Docker Environment Variable Rename**  
  In the Dockerfile, the `DB` environment variable has been replaced with `DATABASE`.

-  **Go Runtime Update**  
  Updated Go to version `1.25.0`.


## Version 1.1.0 (14-07-2025)

### New Features

-  **Automatic Output Folder Creation**  
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
