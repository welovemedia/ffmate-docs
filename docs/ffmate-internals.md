---
title: "FFmate Architecture: Internals of API, Database, UI, Webhooks & Task Queue"
description: "Explore FFmate's internal architecture. Understand how its REST API, SQLite DB, Web UI, Webhooks, Watchfolders & Task Queue interact for FFmpeg automation & integration"
---

# FFmate Internals

This section provides a more in-depth look at some of `FFmate`'s key internal components and how they interact. Understanding these is key for advanced troubleshooting, fine-tuning configurations, and integrating ffmate into your workflows.

### High-Level Component Diagram

```mermaid
graph TD
    %% ─── UI & API ─────────────────────────
    WebUI["Web UI"]:::ui
    REST_API["REST API"]:::api
    WebUI --> REST_API

    %% ─── Services (single row) ───────────
    subgraph Services ["Services"]
        direction LR
        TaskSvc["Task Service"]:::svc
        PresetSvc["Preset Service"]:::svc
        WatchfolderSvc["Watchfolder Service"]:::svc
        WebhookSvc["Webhook Service"]:::svc
    end
    REST_API --> TaskSvc
    REST_API --> PresetSvc
    REST_API --> WatchfolderSvc
    REST_API --> WebhookSvc

    %% ─── Core & DB side-by-side ───────────
    subgraph Core ["Core"]
        direction LR
        FFMate["FFmate"]:::core
        DB[(SQLite DB)]:::db
    end
    TaskSvc --> FFMate
    PresetSvc --> FFMate
    WatchfolderSvc --> FFMate
    WebhookSvc --> FFMate
    FFMate --> DB

    %% ─── ffmpeg binary in dashed box ─────
    subgraph FFmpegBlock [" "]
        direction LR
        FFmpeg["ffmpeg Binary"]:::ffbin
    end
    style FFmpegBlock stroke-dasharray:5 5,stroke:#555,fill:none
    FFMate --> FFmpeg

    %% ─── Stronger colour palette + black text ──────────
    classDef ui     fill:#99d6ff,stroke:#2060a0,stroke-width:1.2px,color:#000000;
    classDef api    fill:#b3e0ff,stroke:#2060a0,stroke-width:1.2px,color:#000000;
    classDef svc    fill:#bdb4ff,stroke:#4b44a0,stroke-width:1.2px,color:#000000;
    classDef core   fill:#99ff99,stroke:#2d7a2d,stroke-width:1.2px,color:#000000;
    classDef db     fill:#ffcc80,stroke:#b36b00,stroke-width:1.2px,color:#000000;
    classDef ffbin  fill:#ff99cc,stroke:#b3366b,stroke-width:1.2px,color:#000000;
```

## REST API

The [REST API](/docs/swagger.md), is the primary way external clients (including the FFmate Web UI, scripts, or other services) interact with and control FFmate.

*   **Functionality:** Provides endpoints for CRUD (Create, Read, Update, Delete) operations on:
    *   Tasks (e.g., create single/batch, list, get status, cancel, restart, delete)
    *   Presets
    *   Watchfolders
    *   Webhooks

## SQLite Database

FFmate uses SQLite as its backend database to store all persistent data.
*   **Data Stored:**
    *   Tasks: All details about transcoding jobs, including their status, progress, input/output files, commands, priority, pre/post-processing info, timestamps, and any errors.
    *   Presets: Definitions for reusable transcoding templates.
    *   Webhooks: Configurations for URLs to be notified on specific events.
    *   Watchfolders: Settings for monitored directories, including paths, intervals, associated presets, and filters.

## Web UI

FFmate includes a modern [web-based user interface](/docs/web-ui.md)for managing and monitoring tasks, presets, watchfolders, and webhooks.

*   **Access:** When FFmate server starts, the web ui is served from the `/ui` path (e.g., `http://localhost:3000/ui`)
*   **Backend Communication:** The Web UI communicates with the FFmate service via:
    *   `REST API`: For actions like creating tasks, fetching lists, deleting presets, etc.
    *   `WebSockets`: For receiving real-time updates like task progress, new log messages, and status changes.

## Webhooks

[Webhooks](/docs/webhooks.md) allow FFmate to automatically notify external systems about specific events by sending HTTP POST requests to configured URLs.

*   **Configuration:**
    *   Users define webhooks via the `REST API` (`/api/v1/webhooks`).
    *   Each webhook configuration includes:
        *   **Event (`event`):** The specific FFmate event that will trigger this webhook (e.g., `task.created`, `task.updated`, `batch.finished`, `preset.deleted`).
        *   **URL (`url`):** The external HTTP(S) endpoint to which FFmate will send the notification.
*   **Triggering:** When a configured event occurs within FFmate:
    *   FFmate automatically sends an HTTP POST request.
    *   This request is sent to the `URL` defined in the webhook configuration.
    *   The body of the request contains a JSON payload detailing the `event` that occurred and relevant `data` associated with it.
*   **Payload Structure:**
    ```json
    {
      "event": "event.name.here",
      "data": { ... }
    }
    ```

## Watchfolder

The [Watchfolder](/docs/watchfolder.md) feature allows FFmate to monitor directories for new files and automatically create transcoding tasks for them based on a specified preset.

*   **Configuration:** Watchfolders are configured via the `REST API` or `Web UI`. Each configuration includes:
    *   **Path (`path`):** The directory to monitor.
    *   **Preset (`preset`):** The name of the preset to apply to newly detected files.
    *   **Interval (`interval`):** How often the directory is scanned (e.g., `10s`).
    *   **Filters (`filters`):** (Optional) Rules to include or exclude specific files (e.g., by extension).
    *   **Growth Checks (`growthChecks`):** (Optional) How many scan intervals a file must remain stable in size before being processed.
*   **Monitoring Process:**
    *   FFmate starts monitoring configured directories upon startup or configuration changes.
    *   Directories are scanned periodically based on the configured `interval`.
    *   New files are detected.
    *   Files must remain the same size for the number of scans defined by `growthChecks` before they are considered ready for processing.
    *   Configured `filters` are applied to the relevant files.
        - If a file matches an extension in `exclude`, it will be skipped—even if it also matches `include`.
    *   A new task is automatically created for each stable, filtered file.
    *   The `preset` is applied to the new task.
    *   FFmate keeps track of processed files to avoid creating duplicate tasks.
*   **Dynamic Updates:** Changes to Watchfolder configurations (creation, updates, deletion) via the API or UI are dynamically loaded and applied without needing a FFmate restart.

## Task Queue

This is the core process where your transcoding jobs are managed and processed from submission to completion.

*   **Queueing:**
    *   New tasks (submitted via `API`, `Web UI`, or `Watchfolders`) are added to a queue.
    *   Tasks are processed based on their **Priority** (higher priority first) and then by creation time.
    *   Initially, tasks are in the `QUEUED` status.
*   **Concurrency Control:**
    *   FFmate limits the number of tasks running simultaneously.
    *   This limit is controlled by the `--max-concurrent-tasks` server setting.
    *   When a slot becomes available, the next task from the queue starts processing.
*   **Task Lifecycle:** Once a task is selected from the queue:
    *   Its status is updated to `RUNNING`.
    *   **Pre-processing:** If a pre-processing script is defined, it is executed before `ffmpeg`.
    *   **`ffmpeg` Execution:** The primary transcoding command (`ffmpeg`) is executed.
    *   **Progress Monitoring:** FFmate monitors `ffmpeg`'s output to track progress (e.g., percentage complete, time remaining). This progress is updated in the database and pushed via `WebSockets`.
    *   **Post-processing:** If a post-processing script is defined and `ffmpeg` completed successfully, the post-processing script is executed.
    *   **Completion:** The task status is updated to reflect the outcome: `DONE_SUCCESSFUL`, `DONE_ERROR`, or `DONE_CANCELED`. Error details are captured if applicable.
*   **Notifications:** Throughout a task's lifecycle, status changes and progress updates are broadcast via `WebSockets` (used by the `Web UI`) and can trigger configured `Webhooks`.


## Metrics

FFmate exposes real-time Prometheus metrics via **GET `/metrics`**, emitting internal counters in standard exposition format the moment the events occur. By default, access all metrics at `http://localhost:3000/metrics`.  

* **Batch Gauges**  
  - `ffmate_batch_created` – total batches created  
  - `ffmate_batch_finished` – batches whose all tasks have completed (successful, failed, or canceled)  

#### Example

  ```plain
  # HELP ffmate_batch_created Number of created batches
  # TYPE ffmate_batch_created gauge
  ffmate_batch_created 3
  ffmate_batch_finished 2
```

* **Task Gauges**

  * `ffmate_task_created` – tasks added (individual or batch)
  * `ffmate_task_deleted` – tasks removed
  * `ffmate_task_updated` – task entry saved in the db (status, progress, errors, etc.)
  * `ffmate_task_canceled` – tasks canceled by user
  * `ffmate_task_restarted` – tasks restarted

#### Example

  ```plain
  # HELP ffmate_task_created Number of created tasks
  # TYPE ffmate_task_created gauge
  ffmate_task_created 18
  ffmate_task_deleted 4
  ffmate_task_updated 155
  ffmate_task_canceled 1
  ffmate_task_restarted 1
  ```

* **Preset Gauges**

  * `ffmate_preset_created` – presets created
  * `ffmate_preset_updated` – presets updated
  * `ffmate_preset_deleted` – presets deleted

#### Example

  ```plain
  # HELP ffmate_preset_created Number of created presets
  # TYPE ffmate_preset_created gauge
  ffmate_preset_created 5
  ffmate_preset_updated 2
  ffmate_preset_deleted 1
  ```

* **Webhook Gauges**

  * `ffmate_webhook_created` – webhooks created
  * `ffmate_webhook_executed` – webhooks fired
  * `ffmate_webhook_deleted` – webhooks deleted

#### Example

  ```plain
  # HELP ffmate_webhook_created Number of created webhooks
  # TYPE ffmate_webhook_created gauge
  ffmate_webhook_created 4
  ffmate_webhook_executed 12
  ffmate_webhook_deleted 1
  ```

* **Watchfolder Gauges**

  * `ffmate_watchfolder_created` – watchfolders created
  * `ffmate_watchfolder_executed` – scan cycles run
  * `ffmate_watchfolder_updated` – watchfolders updated
  * `ffmate_watchfolder_deleted` – watchfolders deleted

#### Example

  ```plain
  # HELP ffmate_watchfolder_created Number of created watchfolders
  # TYPE ffmate_watchfolder_created gauge
  ffmate_watchfolder_created 3
  ffmate_watchfolder_executed 27
  ffmate_watchfolder_updated 1
  ffmate_watchfolder_deleted 0
  ```

* **REST API GaugeVec**

  * `ffmate_rest_api{method, path}` – counts all incoming HTTP requests, labeled by HTTP method and matched route path

#### Example

  ```plain
  # HELP ffmate_rest_api Number of requests against the REST API
  # TYPE ffmate_rest_api gauge
  ffmate_rest_api{method="GET",path="/v1/tasks"} 5
  ffmate_rest_api{method="POST",path="/v1/tasks"} 10
  ```