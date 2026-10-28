---
title: "FFmate Web UI Guide: Dashboard, Watchfolders, Presets & Logs Interface"
description: "Explore the FFmate Web UI: an intuitive interface to manage FFmpeg jobs, monitor tasks, configure watchfolders, create presets, and view real-time logs"
---

# FFmate Web UI

The FFmate Web UI offers a clean, intuitive way to manage and monitor your `FFmpeg` jobs in real time.

You can easily track active tasks, configure watchfolders, create presets, and access detailed logs—all from your browser, without needing to use the API or command line.

Whether you're a developer, media technician, or workflow specialist, the Web UI helps you stay in control of your transcoding operations from start to finish.

## Navigation Overview

The Web UI is served at `http://localhost:3000/ui`. The sidebar on the left has these sections:

1.  **`Dashboard`** – Monitor and manage all `FFmpeg` tasks in real time, including active, completed, and failed jobs.
2.  **`Watchfolder`** – Configure folders to automatically trigger tasks when new media files are detected.
3.  **`Presets`** – Define and reuse `FFmpeg` command templates for consistent, repeatable transcoding tasks.
4.  **`Webhooks`** – Send real-time notifications to external systems whenever events occur, such as task progress, completion, or failure.
5.  **`Sent hooks`** – See every webhook FFmate has sent, with the request and your server's response.
6.  **`Clients`** – See all FFmate instances connected to the database and whether they're online.
7.  **`Logs`** – Open live system logs, including task execution, watchfolder activity, and background processing events.

<ZoomImg src="/img/ffmate-nav.webp" alt="FFmate Web UI with the sidebar on the left. Numbers 1 to 7 mark Dashboard, Watchfolder, Presets, Webhooks, Sent hooks, Clients and, at the bottom, Logs"/>

FFmate includes a built-in mechanism to check whether `FFmpeg` is installed and accessible. It looks for `FFmpeg` in the system’s default `PATH` or in the custom location specified via the `--ffmpeg` flag. If `FFmpeg` is not found, the Web UI shows a red **FFmpeg not found** notice in the sidebar, below the FFmate logo. This notice includes a direct link to the [documentation](/docs/getting-started#installing-ffmpeg) with step-by-step instructions on how to install `FFmpeg` on all supported operating systems.

> [!NOTE]
> FFmate requires **FFmpeg** to function. If **FFmpeg** is not accessible, FFmate will not be able to process any tasks.

If FFmate can't find the `ffmpeg` executable at startup, a warning appears in both the logs and the Web UI. FFmate then checks again every 10 seconds, on the system `PATH` or at the location set with the `--ffmpeg` flag, and starts processing tasks as soon as it finds FFmpeg.

<ZoomImg src="/img/ffmate-dashboard-ffmpeg-not-found.webp" alt="FFmate Web UI with an FFmpeg not found link highlighted in the sidebar, below the FFmate logo"/>

## Dashboard

The Dashboard provides a real-time overview of all `FFmpeg` tasks—letting you monitor progress, manage jobs, and review task details at a glance.

### Monitoring Tasks

View all active and completed tasks in real time, including their status, progress, input file and the FFmate instance running them. Tasks submitted together as a [batch](/docs/tasks.md#submitting-multiple-tasks-as-a-batch) are grouped under one **Batch** row, and tasks created by a watchfolder have a folder icon.

<ZoomImg src="/img/ffmate-dashboard-task-statuses.webp" alt="FFmate Dashboard listing tasks with name, priority, status, progress, input file and client. Running tasks show a progress bar and the time remaining, three tasks are grouped under a Batch row, and a watchfolder task has a folder icon"/>

### Filtering Task Statuses

You can filter tasks by their current status to quickly focus on specific groups, such as **running**, **failed**, or **completed** jobs.

To filter the list, click the **cogwheel icon** in the status column header and select a status from the dropdown menu. Select **All** to show every task again.

- **Queued** (`QUEUED`) – Task is waiting to be processed.
- **Running** (`RUNNING`) – Task is currently being executed.
- **Successful** (`DONE_SUCCESSFUL`) – Task completed without errors.
- **Error** (`DONE_ERROR`) – Task encountered an error.
- **Canceled** (`DONE_CANCELED`) – Task was manually canceled.

<ZoomImg src="/img/ffmate-dashboard-task-filter-statuses.webp" alt="FFmate Dashboard with the status filter dropdown highlighted in the Status column header"/>

### Canceling Tasks

To stop a running task, hover over it to reveal the **cancel** icon on the right. Once clicked, the task will be halted immediately and marked as `DONE_CANCELED`. The icon only appears while the task is `RUNNING`.

<ZoomImg src="/img/ffmate-dashboard-cancel-task.webp" alt="FFmate Dashboard with the cancel icon highlighted on the right of a running task"/>

### Restarting Tasks

To re-run a finished task (successful, failed or canceled), hover over it and click the **restart** icon. The task will be resubmitted with the same configuration and added back to the queue.

<ZoomImg src="/img/ffmate-dashboard-task-restart.webp" alt="FFmate Dashboard with the restart icon highlighted on the right of a finished task"/>

### Deleting Tasks

To remove a task, hover over it and click the **delete** icon. The icon appears for queued and finished tasks. Cancel a running task first to delete it.

<ZoomImg src="/img/ffmate-dashboard-task-delete.webp" alt="FFmate Dashboard with the delete icon highlighted on the right of a finished task"/>

### Task Details

Click on any task to see its full execution details, including progress, errors, `FFmpeg` command, input/output paths, pre/post-processing information, webhooks and the FFmate instance that ran it. The details also show the task's labels and how many retries have run.

<ZoomImg src="/img/ffmate-dashboard-task-details.webp" alt="FFmate task details opened below a finished task, showing UUID, priority, status, progress, the command, input and output files with their resolved values, pre- and post-processing scripts and sidecar paths, and the client that ran the task"/>

## Watchfolders

Watchfolders let you automate task creation by continuously monitoring specific folders and triggering jobs when new media files are detected.

### Creating a Watchfolder

Click the **plus (+) button** in the bottom-right corner of the Watchfolders page to create a new watchfolder.

<ZoomImg src="/img/ffmate-watchfolder-add-new.webp" alt="Empty FFmate Watchfolder page with the plus button highlighted in the bottom-right corner"/>

Specify the name, folder path, preset, scan interval, number of growth checks, and optional file extension filters. Turn off **Enabled** to create the watchfolder in a suspended state. You can also add labels.

<ZoomImg src="/img/ffmate-watchfolder-add-new-form-input.webp" alt="FFmate New watchfolder form filled in with name, description, path, preset, interval, growth check, include and exclude extensions, and the Enabled switch turned on"/>

### Checking Configured Watchfolders

The watchfolder list displays all configured watchfolders along with their current status, assigned preset, and monitored folder path.

<ZoomImg src="/img/ffmate-watchfolder-list.webp" alt="FFmate Watchfolder page listing two watchfolders with status OK, interval, path, preset, filter and last check"/>

### Checking Watchfolder Details

Click on any watchfolder to view its full configuration, including assigned preset, filter rules, scan settings, and monitored folder path.

<ZoomImg src="/img/ffmate-watchfolder-details.webp" alt="FFmate watchfolder details opened below a watchfolder, showing UUID, status, last check, preset, interval, growth check, path and the include and exclude filters"/>

### Updating a Watchfolder

Hover over a watchfolder in Watchfolders, click the **pencil** icon, adjust any field in the Edit Watchfolder form (path, preset, scan interval, growth check, filters), then click Save. The watchfolder will restart with the new configuration shortly after the update.

<ZoomImg src="/img/ffmate-watchfolder-edit-watchfolder.webp" alt="FFmate Watchfolder page with the pencil icon highlighted on the right of a watchfolder"/>

### Deleting Watchfolders

Hover over a watchfolder in Watchfolder and click the **delete** icon to remove it. FFmate will stop monitoring the associated folder.

<ZoomImg src="/img/ffmate-watchfolder-delete-watchfolder.webp" alt="FFmate Watchfolder page with the delete icon highlighted on the right of a watchfolder"/>

## Presets

Presets in FFmate are reusable templates that simplify task creation by letting you predefine `FFmpeg` commands, output naming patterns, priorities, and optional pre/post-processing scripts.

### Creating a Preset

Click the **plus (+) button** in the bottom-right corner of the Presets page to create a new Preset.

<ZoomImg src="/img/ffmate-presets-add-new.webp" alt="Empty FFmate Presets page with the plus button highlighted in the bottom-right corner"/>

You can create your own custom preset or choose from a set of predefined, ready-to-use presets provided by the FFmate team. The list of ready-to-use presets is loaded from the internet, so it's empty without an internet connection.

The form covers the name, description, `FFmpeg` command, output file, priority, and pre- and post-processing settings, including **Import sidecar**. It also has fields for retries and labels.

<ZoomImg src="/img/ffmate-presets-add-new-form-input.webp" alt="FFmate New preset form filled in with name, description, command, output file, priority and a post-processing script. The global presets to start from are listed on the left"/>

### List of Active Presets

View all configured presets along with their name, description, priority, and output file pattern.

<ZoomImg src="/img/ffmate-presets-list.webp" alt="FFmate Presets page listing three presets with priority, command, output file and whether pre- and post-processing are set"/>

### Checking Preset Details

Click on any preset to view its full configuration, including the `FFmpeg` command, output pattern, priority, and any pre/post-processing settings.

<ZoomImg src="/img/ffmate-presets-details.webp" alt="FFmate preset details opened below a preset, showing UUID, priority, command, output file and the pre- and post-processing settings"/>

### Updating a Preset

Hover over a preset in Presets, click the **pencil** icon, modify any fields in the Edit Preset form (name, `FFmpeg` command, output pattern, priority, scripts), then click Save.

<ZoomImg src="/img/ffmate-presets-edit-preset.webp" alt="FFmate Presets page with the pencil icon highlighted on the right of a preset"/>

### Removing a Preset

Hover over a preset in Presets and click the **delete** icon to remove it.

<ZoomImg src="/img/ffmate-presets-delete-preset.webp" alt="FFmate Presets page with the delete icon highlighted on the right of a preset"/>

## Webhooks

Webhooks let you integrate FFmate with other systems by sending real-time event notifications whenever something happens in your workflow — for example, when a task starts, finishes, or fails.

### Creating a Webhook

Click the **plus (+) button** in the bottom-right corner of the Webhooks page to create a new webhook.

<ZoomImg src="/img/ffmate-webhook-add-new.webp" alt="Empty FFmate Webhooks page with the plus button highlighted in the bottom-right corner"/>

Specify the **event** you want to subscribe to and the target **URL** where notifications should be delivered.

<ZoomImg src="/img/ffmate-webhook-add-new-form-input.webp" alt="FFmate New webhook form with the task.updated event selected and a webhook URL entered"/>

### Checking Configured Webhooks

The Webhooks list displays all configured webhooks with their subscribed event, target URL, and when they were last changed.

<ZoomImg src="/img/ffmate-webhook-list.webp" alt="FFmate Webhooks page listing three webhooks with their event, URL and when they were last modified"/>


### Updating a Webhook

Hover over a webhook in the list, click the **pencil** icon, adjust any field in the Edit Webhook form (event, url), then click Save. Changes take effect immediately, and new events will be delivered according to the updated configuration.

<ZoomImg src="/img/ffmate-webhook-edit-webhook.webp" alt="FFmate Webhooks page with the pencil icon highlighted on the right of a webhook"/>

### Deleting Webhooks

Hover over a webhook in the list and click the **delete** icon to remove it. FFmate will immediately stop sending notifications to that URL.

<ZoomImg src="/img/ffmate-webhook-delete-webhook.webp" alt="FFmate Webhooks page with the delete icon highlighted on the right of a webhook"/>

## Sent Hooks

The **Sent hooks** page lists every webhook FFmate has sent, newest first, with the HTTP status your server returned, the event, the URL and the time. Click an entry to see the full request and response. For details, see [Webhook logs](/docs/webhooks.md#webhook-logs).

<ZoomImg src="/img/ffmate-sent-hooks.webp" alt="FFmate Sent webhooks page listing sent webhooks with method, HTTP status, event, URL and time. One entry is opened and shows its status and request"/>

## Clients

The **Clients** page lists every FFmate instance connected to the database, with its identifier, version, whether it's online, and when it was last seen. An FFmate instance counts as online if it has sent a heartbeat in the last 60 seconds. The FFmate instance the Web UI is connected to is listed first.

<ZoomImg src="/img/ffmate-clients.webp" alt="FFmate Clients page listing one FFmate instance with its identifier, version, operating system, architecture, online dot and last seen time"/>

Click an FFmate instance to see its details: FFmpeg path, operating system, architecture and labels.

## Accessing Real-Time Logs

Click **Logs** at the bottom of the sidebar to open a real-time log window at the bottom of the screen. Click it again to close the window, or click **Clear all entries** to empty it.

<ZoomImg src="/img/ffmate-logs.webp" alt="FFmate Dashboard with Logs highlighted at the bottom of the sidebar"/>

This view shows live FFmate activity, including task execution, watchfolder events, and system messages. In a [cluster](/docs/clustering.md), it only shows the logs of the FFmate instance the Web UI is connected to.

<ZoomImg src="/img/ffmate-logs-details.webp" alt="FFmate Dashboard with the log window open at the bottom of the screen, showing timestamped entries for a created preset, created tasks and watchfolder activity"/>