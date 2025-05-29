---
title: FFmate Release Notes
description: Explore the latest FFmate release notes including new features, API changes, improvements, and bug fixes. Stay updated with every version of the open-source FFmpeg automation tool.
---
# FFmate Release Notes  
An overview of new features, enhancements, and bug fixes for each version.

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
