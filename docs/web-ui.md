---
title: "FFmate Web UI Guide"
description: "How to use the FFmate Web UI to follow tasks, manage presets, watchfolders and webhooks, check sent webhooks and FFmate instances and read live logs."
---

# FFmate Web UI

The FFmate Web UI is the browser interface of FFmate. It shows tasks while they run and opens the live logs. Presets, watchfolders and webhooks can be created and changed there without the REST API or the command line.

## Navigation Overview

The Web UI is served at `http://localhost:3000/ui`. The sidebar on the left has these sections:

1.  **`Dashboard`** – Monitor and manage all `FFmpeg` tasks in real time, including active, completed and failed tasks.
2.  **`Watchfolder`** – Configure folders that create a task for every new media file.
3.  **`Presets`** – Define and reuse `FFmpeg` command templates for transcoding tasks.
4.  **`Webhooks`** – Send real-time notifications to external systems whenever events occur, such as task progress, completion or failure.
5.  **`Sent hooks`** – See every webhook FFmate has sent, with the request and your server's response.
6.  **`Clients`** – See all FFmate instances connected to the database and whether they're online.
7.  **`Logs`** – Open live system logs, including task execution, watchfolder activity and background processing events.

<ZoomImg src="/img/ffmate-nav.webp" alt="FFmate Web UI sidebar with numbers 1 to 7 on Dashboard, Watchfolder, Presets, Webhooks, Sent hooks, Clients and Logs."/>

FFmate checks whether `FFmpeg` is installed. It looks for `FFmpeg` in the system's default `PATH` or in the location set with the `--ffmpeg` flag. If `FFmpeg` is not found, the Web UI shows a red **FFmpeg not found** notice in the sidebar, below the FFmate logo. The notice links to [Installing FFmpeg](/docs/getting-started.md#installing-ffmpeg), which has the steps for each supported operating system.

> [!NOTE]
> FFmate runs every task with FFmpeg. If FFmpeg isn't found, FFmate doesn't process any tasks.

If FFmate can't find the `ffmpeg` executable at startup, a warning appears in both the logs and the Web UI. FFmate then checks again every 10 seconds, on the system `PATH` or at the location set with the `--ffmpeg` flag. As soon as it finds FFmpeg, FFmate starts processing tasks.

<ZoomImg src="/img/ffmate-dashboard-ffmpeg-not-found.webp" alt="FFmate Web UI with an FFmpeg not found link highlighted in the sidebar, below the FFmate logo."/>

## Dashboard

The Dashboard shows all `FFmpeg` tasks in real time. From the Dashboard, tasks can be canceled, restarted, deleted and opened for details.

### Monitoring Tasks

View all active and completed tasks in real time, including their status, progress, input file and the FFmate instance running them. Tasks submitted together as a [batch](/docs/tasks.md#submitting-multiple-tasks-as-a-batch) are grouped under one **Batch** row, and tasks created by a watchfolder have a folder icon.

<ZoomImg src="/img/ffmate-dashboard-task-statuses.webp" alt="FFmate Dashboard with running tasks, three tasks grouped under a Batch row and a watchfolder task with a folder icon."/>

### Filtering Task Statuses

The Dashboard can show only the tasks with one status, for example only failed tasks.

To filter the list, click the **cogwheel icon** in the status column header and select a status from the dropdown menu. Select **All** to show every task again.

- **Queued** (`QUEUED`) – Task is waiting to be processed.
- **Running** (`RUNNING`) – Task is currently being executed.
- **Successful** (`DONE_SUCCESSFUL`) – Task completed without errors.
- **Error** (`DONE_ERROR`) – Task encountered an error.
- **Canceled** (`DONE_CANCELED`) – Task was manually canceled.

<ZoomImg src="/img/ffmate-dashboard-task-filter-statuses.webp" alt="FFmate Dashboard with the status filter dropdown highlighted in the Status column header."/>

### Canceling Tasks

To stop a running task, hover over it and click the **cancel** icon on the right. FFmate sets the task to `DONE_CANCELED` and stops FFmpeg. The icon only appears while the task is `RUNNING`.

<ZoomImg src="/img/ffmate-dashboard-cancel-task.webp" alt="FFmate Dashboard with the cancel icon highlighted on the right of a running task."/>

### Restarting Tasks

To run a finished task again, hover over it and click the **restart** icon. The icon appears for successful, failed and canceled tasks. FFmate puts the task back into the queue with the same settings.

<ZoomImg src="/img/ffmate-dashboard-task-restart.webp" alt="FFmate Dashboard with the restart icon highlighted on the right of a finished task."/>

### Deleting Tasks

To remove a task, hover over it and click the **delete** icon. The icon appears for queued and finished tasks. Cancel a running task first to delete it.

<ZoomImg src="/img/ffmate-dashboard-task-delete.webp" alt="FFmate Dashboard with the delete icon highlighted on the right of a finished task."/>

### Task Details

Click on any task to see its full execution details, including progress, errors, `FFmpeg` command, input/output paths, pre/post-processing information, webhooks and the FFmate instance that ran it. The details also show the task's labels and how many retries have run.

<ZoomImg src="/img/ffmate-dashboard-task-details.webp" alt="FFmate task details opened below a finished task, showing the command, files, scripts and the FFmate instance that ran it."/>

## Watchfolders

A watchfolder creates a task for every new media file in a folder. Each task uses the preset of the watchfolder.

### Creating a Watchfolder

Click the **plus (+) button** in the bottom-right corner of the Watchfolders page to create a new watchfolder.

<ZoomImg src="/img/ffmate-watchfolder-add-new.webp" alt="Empty FFmate Watchfolder page with the plus button highlighted in the bottom-right corner."/>

Specify the name, folder path, preset, scan interval, number of growth checks and optional file extension filters. Turn off **Enabled** to create the watchfolder in a suspended state. You can also add labels.

<ZoomImg src="/img/ffmate-watchfolder-add-new-form-input.webp" alt="FFmate New watchfolder form filled in, with the Enabled switch turned on."/>

### Checking Configured Watchfolders

The watchfolder list displays all configured watchfolders along with their current status, assigned preset and monitored folder path.

<ZoomImg src="/img/ffmate-watchfolder-list.webp" alt="FFmate Watchfolder page listing two watchfolders with status OK, interval, path, preset, filter and last check."/>

### Checking Watchfolder Details

Click on any watchfolder to view its full configuration, including assigned preset, filter rules, scan settings and monitored folder path.

<ZoomImg src="/img/ffmate-watchfolder-details.webp" alt="FFmate watchfolder details opened below a watchfolder, showing status, preset, interval, path and file filters."/>

### Updating a Watchfolder

Hover over a watchfolder on the Watchfolders page and click the **pencil** icon. Change any field in the Edit Watchfolder form, for example the path, preset, scan interval, growth checks or filters, then click **Save**. FFmate uses the new settings from the next scan.

<ZoomImg src="/img/ffmate-watchfolder-edit-watchfolder.webp" alt="FFmate Watchfolder page with the pencil icon highlighted on the right of a watchfolder."/>

### Deleting Watchfolders

Hover over a watchfolder in Watchfolder and click the **delete** icon to remove it. FFmate stops monitoring the folder.

<ZoomImg src="/img/ffmate-watchfolder-delete-watchfolder.webp" alt="FFmate Watchfolder page with the delete icon highlighted on the right of a watchfolder."/>

## Presets

A preset saves an `FFmpeg` command with its output naming pattern, priority and optional pre- and post-processing scripts. Tasks that use the preset take these settings from it.

### Creating a Preset

Click the **plus (+) button** in the bottom-right corner of the Presets page to create a new preset.

<ZoomImg src="/img/ffmate-presets-add-new.webp" alt="Empty FFmate Presets page with the plus button highlighted in the bottom-right corner."/>

A new preset can start empty or from one of the global presets provided by the FFmate team. The list of global presets is loaded from the internet, so it's empty without an internet connection.

The form covers the name, description, `FFmpeg` command, output file and priority, plus the pre- and post-processing settings, including **Import sidecar**. It also has fields for retries and labels.

<ZoomImg src="/img/ffmate-presets-add-new-form-input.webp" alt="FFmate New preset form filled in with a post-processing script, and the global presets to start from listed on the left."/>

### List of Active Presets

View all configured presets along with their name, description, priority and output file pattern.

<ZoomImg src="/img/ffmate-presets-list.webp" alt="FFmate Presets page listing three presets with priority, command, output file and whether pre- and post-processing are set."/>

### Checking Preset Details

Click on any preset to view its full configuration, including the `FFmpeg` command, output pattern, priority and any pre/post-processing settings.

<ZoomImg src="/img/ffmate-presets-details.webp" alt="FFmate preset details opened below a preset, showing priority, command, output file and pre- and post-processing settings."/>

### Updating a Preset

Hover over a preset on the Presets page and click the **pencil** icon. Change any field in the Edit Preset form, for example the name, `FFmpeg` command, output pattern, priority or scripts, then click **Save**.

<ZoomImg src="/img/ffmate-presets-edit-preset.webp" alt="FFmate Presets page with the pencil icon highlighted on the right of a preset."/>

### Removing a Preset

Hover over a preset in Presets and click the **delete** icon to remove it.

<ZoomImg src="/img/ffmate-presets-delete-preset.webp" alt="FFmate Presets page with the delete icon highlighted on the right of a preset."/>

## Webhooks

A webhook makes FFmate send a `POST` request to a URL when an event happens, for example when a task changes.

### Creating a Webhook

Click the **plus (+) button** in the bottom-right corner of the Webhooks page to create a new webhook.

<ZoomImg src="/img/ffmate-webhook-add-new.webp" alt="Empty FFmate Webhooks page with the plus button highlighted in the bottom-right corner."/>

Specify the **event** you want to subscribe to and the target **URL** where notifications should be delivered.

<ZoomImg src="/img/ffmate-webhook-add-new-form-input.webp" alt="FFmate New webhook form with the task.updated event selected and a webhook URL entered."/>

### Checking Configured Webhooks

The Webhooks list displays all configured webhooks with their subscribed event, target URL, and when they were last changed.

<ZoomImg src="/img/ffmate-webhook-list.webp" alt="FFmate Webhooks page listing three webhooks with their event, URL and when they were last modified."/>

### Updating a Webhook

Hover over a webhook in the list and click the **pencil** icon. Change the event or URL in the Edit Webhook form, then click **Save**. FFmate uses the new settings for the next event.

<ZoomImg src="/img/ffmate-webhook-edit-webhook.webp" alt="FFmate Webhooks page with the pencil icon highlighted on the right of a webhook."/>

### Deleting Webhooks

Hover over a webhook in the list and click the **delete** icon to remove it. FFmate no longer fires the webhook.

<ZoomImg src="/img/ffmate-webhook-delete-webhook.webp" alt="FFmate Webhooks page with the delete icon highlighted on the right of a webhook."/>

## Sent Hooks

The **Sent hooks** page lists every webhook FFmate has sent, newest first, with the HTTP status your server returned, the event, the URL and the time. Click an entry to see the full request and response. For details, see [Webhook logs](/docs/webhooks.md#webhook-logs).

<ZoomImg src="/img/ffmate-sent-hooks.webp" alt="FFmate Sent webhooks page listing sent webhooks with HTTP status, event and URL, with one entry opened to show its request."/>

## Clients

The **Clients** page lists every FFmate instance connected to the database, with its identifier, version, whether it's online and when it was last seen. Every FFmate instance updates its last seen time in the database every 15 seconds. It counts as online if it did so in the last 60 seconds. The FFmate instance the Web UI is connected to is listed first.

<ZoomImg src="/img/ffmate-clients.webp" alt="FFmate Clients page listing one FFmate instance with identifier, version, operating system, online dot and last seen time."/>

Click an FFmate instance to see its details: FFmpeg path, operating system, architecture and labels.

## Accessing Real-Time Logs

Click **Logs** at the bottom of the sidebar to open a real-time log window at the bottom of the screen. Click it again to close the window, or click **Clear all entries** to empty it.

<ZoomImg src="/img/ffmate-logs.webp" alt="FFmate Dashboard with Logs highlighted at the bottom of the sidebar."/>

This view shows live FFmate activity, including task execution, watchfolder events, and system messages. In a [cluster](/docs/clustering.md), it only shows the logs of the FFmate instance the Web UI is connected to.

<ZoomImg src="/img/ffmate-logs-details.webp" alt="FFmate Dashboard with the log window open at the bottom, with entries for a created preset, tasks and watchfolder activity."/>