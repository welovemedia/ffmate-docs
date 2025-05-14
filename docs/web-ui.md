---
title: "FFmate Web UI Guide: Dashboard, Watchfolders, Presets & Logs Interface"
description: "Explore the FFmate Web UI: an intuitive interface to manage FFmpeg jobs, monitor tasks, configure watchfolders, create presets, and view real-time logs"
---

# FFmate Web UI

The FFmate Web UI offers a clean, intuitive way to manage and monitor your FFmpeg jobs in real time.

You can easily track active tasks, configure watchfolders, create presets, and access detailed logs—all from your browser, without needing to use the API or command line.

Whether you're a developer, media technician, or workflow specialist, the Web UI helps you stay in control of your transcoding operations from start to finish.

## Navigation Overview

The FFmate Web UI is divided into four main sections, each designed to simplify and streamline your media processing workflows:

1.  **`Dashboard`** – Monitor and manage all FFmpeg tasks in real time, including active, completed, and failed jobs.
2.  **`Watchfolders`** – Configure folders to automatically trigger tasks when new media files are detected.
3.  **`Presets`** – Define and reuse FFmpeg command templates for consistent, repeatable transcoding tasks.
4.  **`Logs`** – Access live system logs, including task execution, watchfolder activity, and background processing events.

<ZoomImg src="/src/ffmate-nav.webp" alt="FFmate navigation bar featuring Dashboard, Watchfolders, Presets, and Logs sections, each marked with numeric indicators to guide users through the interface"/>

## Dashboard

The Dashboard provides a real-time overview of all FFmpeg tasks—letting you monitor progress, manage jobs, and review task details at a glance.

### Monitoring Tasks

View all active and completed tasks in real time, including their status and progress.

<ZoomImg src="/src/ffmate-dashboard-task-statuses.webp" alt="FFmate task dashboard displaying a list of media processing tasks with columns for name, priority, status, progress, input file path, and output file path. Several tasks are queued at 0%, while others are running with real-time progress bars and estimated time remaining"/>

### Filtering Task Statuses

You can filter tasks by their current status to quickly focus on specific groups, such as running, failed, or completed jobs.

To filter the list, click the **cogwheel icon** in the status column header and select a status from the dropdown menu.

- **`QUEUED`** – Task is waiting to be processed.
- **`RUNNING`** – Task is currently being executed.
- **`DONE_SUCCESSFUL`** – Task completed without errors.
- **`DONE_ERROR`** – Task encountered an error.
- **`DONE_CANCELED`** – Task was manually canceled.

<ZoomImg src="src/ffmate-dashboard-task-filter-statuses.webp" alt="FFmate dashboard displaying a single active media processing task in RUNNING state with a live progress bar at 24.04%. The interface prominently highlights the status column filter icon, signaling support for filtering tasks by state such as queued, running, done_successful, done_error, done_canceled"/>

### Canceling Tasks

To stop a running task, hover over it to reveal the **cancel** icon on the right. Once clicked, the task will be halted immediately and marked as `DONE_CANCELED`.

<ZoomImg src="/src/ffmate-dashboard-cancel-task.webp" alt="FFmate dashboard showing multiple media processing tasks with progress indicators. One task is actively running at 54.76% completion. The interface highlights a circular cancel button on the right side of the row, indicating the ability to terminate individual tasks directly from the dashboard"/>

### Restarting Tasks

To re-run a completed or failed task, hover over it and click the **restart** icon. The task will be resubmitted with the same configuration and added back to the queue.

<ZoomImg src="/src/ffmate-dashboard-task-restart.webp" alt="FFmate dashboard displaying a completed media processing task with a status of DONE_SUCCESSFUL and a progress bar showing 100%. The interface highlights a circular restart icon on the right side of the task row, indicating the option to rerun or reprocess completed tasks directly from the dashboard"/>

### Deleting Tasks

To remove a task from the list, hover over it and click the **delete** icon. Deleting a task will permanently remove both the task and its logs from the database.

<ZoomImg src="/src/ffmate-dashboard-task-delete.webp" alt="FFmate dashboard displaying a successfully completed media processing task marked as DONE_SUCCESSFUL with a 100% progress bar. The interface highlights the trash bin icon on the right side of the row, indicating the option to delete completed tasks directly from the dashboard UI"/>

### Task Details

Click on any task to see its full execution details, including progress, FFmpeg command, input/output paths, and pre/post-processing information.

<ZoomImg src="/src/ffmate-dashboard-task-details.webp" alt="FFmate task details view displaying real-time information for an active media processing job. The interface shows UUID, priority, status, and progress bar at 64.82%, along with resolved FFmpeg command, input and output file paths, and pre/post-processing sidecar file locations using dynamic DATE_YEAR placeholders"/>

## Watchfolders

Watchfolders let you automate task creation by continuously monitoring specific folders and triggering jobs when new media files are detected.

### Creating a Watchfolder

Click the **plus (+) button** in the bottom-right corner of the Watchfolders page to create a new watchfolder.

<ZoomImg src="/src/ffmate-watchfolder-add-new.webp" alt="FFmate watchfolder interface with an empty state and a green circular plus button highlighted in the bottom-right corner, indicating the ability to add a new watchfolder for automated media ingestion and processing"/>

Specify the folder path, preset, scan interval, growth check duration, and optional file extension filters.

<ZoomImg src="/src/ffmate-watchfolder-add-new-form-input.webp" alt="FFmate interface displaying the 'New Watchfolder' form, allowing users to configure automated task creation by specifying folder path, preset, scan interval, growth check duration, and optional file extension filters. Form includes fields for name, description, and a Create button to finalize the setup"/>

### Checking Configured Watchfolders

The watchfolder list displays all configured watchfolders along with their current status, assigned preset, and monitored folder path.

<ZoomImg src="/src/ffmate-watchfolder-list.webp" alt="FFmate watchfolder overview displaying a single configured watchfolder with status OK, a 5-second scan interval, active file filtering, and an assigned preset named 'rotate'. The interface shows the folder path, last check timestamp, and a green plus button for adding additional watchfolders"/>

### Checking Watchfolder Details

Click on any watchfolder to view its full configuration, including assigned preset, filter rules, scan settings, and monitored folder path.

<ZoomImg src="/src/ffmate-watchfolder-details.webp" alt="FFmate interface showing expanded details of a configured watchfolder, including UUID, status, last check timestamp, assigned preset, scan interval, growth check value, folder path, and file extension filters. The watchfolder is active with status OK and filters configured to include .mp4 and exclude .xml files"/>

### Deleting Watchfolders

Click the **delete** icon next to a watchfolder to remove it. FFmate will immediately stop monitoring the associated folder.

<ZoomImg src="/src/ffmate-watchfolder-delete-watchfolder.webp" alt="FFmate watchfolder management interface showing a configured watchfolder with status OK and an active delete icon highlighted on the right side of the row, indicating the option to remove the watchfolder from the system. The UI includes path, scan interval, preset, and last check timestamp"/>

## Presets

Presets in FFmate are reusable templates that simplify task creation by letting you predefine FFmpeg commands, output naming patterns, priorities, and optional pre/post-processing scripts.

### Creating a Preset

Click the **plus (+) button** in the bottom-right corner of the Presets page to create a new Preset.

<ZoomImg src="/src/ffmate-presets-add-new.webp" alt="FFmate presets interface displaying an empty state with a green circular plus button highlighted in the bottom-right corner, indicating the option to create a new encoding preset for automated media processing workflow"/>

You can create your own custom preset or choose from a set of predefined, ready-to-use presets provided by the FFmate team.

<ZoomImg src="/src/ffmate-presets-add-new-form-input.webp" alt="FFmate preset creation interface displaying a form for defining a new encoding preset, with fields for name, description, FFmpeg command, output file, priority, and optional pre/post-processing script and sidecar paths. The left panel lists global presets like frame rate conversion, format changes, and audio extraction"/>

### List of Active Presets

View all configured presets along with their name, description, priority, and output file pattern.

<ZoomImg src="/src/ffmate-presets-list.webp" alt="FFmate presets interface displaying a custom encoding preset titled 'Convert to MOV', with a priority of 0, defined FFmpeg command using input/output placeholders, dynamic output filename, and active pre- and post-processing scripts. The UI includes a green plus button to add additional presets"/>

### Checking Preset Details

Click on any preset to view its full configuration, including the FFmpeg command, output pattern, priority, and any pre/post-processing settings.

<ZoomImg src="/src/ffmate-presets-details.webp" alt="FFmate interface showing expanded details of a configured watchfolder, including UUID, status, last check timestamp, assigned preset, scan interval, growth check value, folder path, and file extension filters. The watchfolder is active with status OK and filters configured to include .mp4 and exclude .xml files"/>

### Removing a Preset

Click the **delete** icon next to a preset to remove it.

<ZoomImg src="/src/ffmate-presets-delete-preset.webp" alt="FFmate interface showing expanded details of a configured watchfolder, including UUID, status, last check timestamp, assigned preset, scan interval, growth check value, folder path, and file extension filters. The watchfolder is active with status OK and filters configured to include .mp4 and exclude .xml files"/>

## Accessing Real-Time Logs

Click the **Logs** icon in the top-right navigation bar to open a real-time log window at the bottom of the screen.

<ZoomImg src="/src/ffmate-logs.webp" alt="FFmate dashboard interface showing a completed media processing task with a highlighted 'Logs' button in the top-right corner, indicating access to detailed execution logs for monitoring and debugging purposes. Task status is marked as DONE_SUCCESSFUL with a 100% progress bar and defined input/output paths"/>

This view shows live FFmate activity, including task execution, watchfolder events, and system messages.

<ZoomImg src="/src/ffmate-logs-details.webp" alt="FFmate dashboard displaying an empty task list with the logs panel expanded, showing system-level logs related to preset and watchfolder creation, deletion, and directory scan errors. Entries include UUID references, timestamps, and repeated errors indicating missing directories during watchfolder polling"/>