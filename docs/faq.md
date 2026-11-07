---
title: FFmate FAQ
description: Answers to common FFmate questions about installing, tasks, presets, watchfolders, webhooks, clustering and security, each linked to its page.
---

# FFmate FAQ

## Getting Started

<details>
<summary>What is FFmate?</summary>

FFmate is an automation layer on top of FFmpeg. It runs FFmpeg commands as tasks and offers a REST API to create and track them.

See [What is FFmate?](/docs/what-is-ffmate.md).
</details>

<details>
<summary>What platforms does FFmate support?</summary>

FFmate runs on Windows, macOS, Linux and Docker.

See [Downloading & Installing FFmate](/docs/getting-started.md#downloading-installing-ffmate).
</details>

<details>
<summary>How do I install FFmate on macOS?</summary>

Install FFmate with Homebrew:

```bash
brew install ffmate
```
See [Downloading & Installing FFmate](/docs/getting-started.md#downloading-installing-ffmate).
</details>

<details>
<summary>Does FFmate need FFmpeg to be installed?</summary>

Yes. FFmate runs every task with FFmpeg. By default, it looks for `ffmpeg` in the system `PATH`. If FFmpeg isn't found, FFmate still starts, but tasks stay `QUEUED`. FFmate checks again every 10 seconds and starts processing as soon as FFmpeg is available.

The Docker image already includes FFmpeg.

See [Installing FFmpeg](/docs/getting-started.md#installing-ffmpeg).
</details>

<details>
<summary>What port does FFmate run on, and how do I change it?</summary>

FFmate's API & Web UI listen on port **3000** by default. Add `--port <number>` when you start the server, e.g. `ffmate server --port 8080`. In Docker, set the `PORT` environment variable and change the `-p` port mapping to match.

See [`--port`](/docs/flags.md#port).
</details>

<details>
<summary>How do I point FFmate to a custom FFmpeg binary?</summary>

Use `--ffmpeg "/full/path/to/ffmpeg"` when launching `ffmate server`. FFmate runs that binary for every task.

See [`--ffmpeg`](/docs/flags.md#ffmpeg).
</details>

<details>
<summary>How do I stop FFmate from opening the Web UI on startup?</summary>

Start the server with `--no-ui`. The Web UI is still available at `http://localhost:3000/ui`, but FFmate doesn't open it in the browser. In Docker, FFmate never opens a browser.

See [`--no-ui`](/docs/flags.md#no-ui).
</details>

<details>
<summary>Where does FFmate store its data?</summary>

In a SQLite database. By default it's created at:

* Windows: `%APPDATA%\ffmate\db.sql`
* macOS/Linux: `~/.ffmate/db.sqlite`
* Docker: `/app/db/sqlite.db`

Use `--database` to choose another file, or a `postgresql://` URI to run several FFmate instances as a [cluster](/docs/clustering.md).

See [`--database`](/docs/flags.md#database).
</details>

## Security

<details>
<summary>Is it safe to make FFmate reachable from the network?</summary>

Only with protection. By default, FFmate has no password and listens on `0.0.0.0`, which means all network interfaces. Anyone who can reach its port can create tasks and presets with [pre- and post-processing scripts](/docs/pre-post-prcessing.md). Anyone who can create a task, preset or watchfolder can run commands on the computer FFmate runs on.

To keep FFmate on the local machine, start it with `--host 127.0.0.1`. To share it on a network, start it with `--basic-auth` and limit access with a firewall. Run FFmate as a user without admin or `root` rights.

See [`--host`](/docs/flags.md#host) and [`--basic-auth`](/docs/flags.md#basic-auth).
</details>

<details>
<summary>How do I protect FFmate with a username and password?</summary>

Start the server with `--basic-auth`, e.g. `ffmate server --basic-auth="admin:secret"`. Every request then needs the username and password: the API, the Web UI, the Swagger UI, `/health` and `/metrics`. The browser asks for them when opening the Web UI.

See [`--basic-auth`](/docs/flags.md#basic-auth).
</details>

## Tasks

<details>
<summary>How do I create a transcoding task via the API?</summary>

To create a task, send a `POST` request to `/api/v1/tasks` with at least a `name`, plus a `command` or a `preset`:

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Convert input.mp4",
        "command": "-y -i ${INPUT_FILE} -c:v libx264 -crf 23 ${OUTPUT_FILE}",
        "inputFile": "/videos/input.mp4",
        "outputFile": "/videos/output.mp4",
        "priority": 50
      }'
```

FFmate queues the task and returns it with its `uuid`. FFmate also fires a `task.created` webhook.

See [Creating a Task](/docs/tasks.md#creating-a-task).
</details>

<details>
<summary>How can I monitor the status of a task?</summary>

`GET /api/v1/tasks/{uuid}` returns the task as JSON, including `status`, `progress` and timestamps. The Dashboard in the Web UI shows the status and progress of every task live.

See [Monitoring a Task](/docs/tasks.md#monitoring-a-task).
</details>

<details>
<summary>Why does my task stay in <code>QUEUED</code>?</summary>

Possible reasons:

* FFmate can't find FFmpeg. Check the startup log, and set the path with `--ffmpeg` if needed.
* FFmate is already running as many tasks as [`--max-concurrent-tasks`](/docs/flags.md#max-concurrent-tasks) allows. The task starts when one of them finishes.
* The task has [labels](/docs/tasks.md#task-properties), but no FFmate instance has a matching label.

See [Tasks](/docs/tasks.md).
</details>

<details>
<summary>How do I cancel a running task?</summary>

`PATCH /api/v1/tasks/{uuid}/cancel` sets a queued or running task to `DONE_CANCELED` right away. A running FFmpeg command is stopped. In the Web UI, hover over a running task and click the **cancel** icon.

See [Canceling a Task](/docs/tasks.md#canceling-a-task).
</details>

<details>
<summary>How do I restart a failed task?</summary>

`PATCH /api/v1/tasks/{uuid}/restart` resets the task to `QUEUED`, clears its error, progress and retry count, and puts it back in the processing queue.

See [Restarting a Task](/docs/tasks.md#restarting-a-task).
</details>

<details>
<summary>Can FFmate retry failed tasks automatically?</summary>

Yes. Set `retries` on the task or its preset, e.g. `"retries": 2`. If the task fails, FFmate puts it back into `QUEUED` after 3 seconds, up to that many times. Canceled tasks are not retried.

See [Task Properties](/docs/tasks.md#task-properties).
</details>

<details>
<summary>What happens to running tasks when FFmate stops or crashes?</summary>

When FFmate starts again, it sets its tasks with the status `RUNNING` to `DONE_ERROR` with the error `client disconnected during execution`. In a [cluster](/docs/clustering.md), the other FFmate instances do this after about 60 seconds. Restart those tasks to run them again.

A task that was in `PRE_PROCESSING` or `POST_PROCESSING` keeps that status. To run it again, restart it.

See [Clustering](/docs/clustering.md).
</details>

<details>
<summary>How do I submit a batch of tasks?</summary>

To submit a batch, send a `POST` request to `/api/v1/batches` with the tasks in a `tasks` array: `{"tasks": [ … ]}`. FFmate gives each batch a `uuid`. Each task in the batch still runs on its own.

See [Submitting Multiple Tasks as a Batch](/docs/tasks.md#submitting-multiple-tasks-as-a-batch).
</details>

<details>
<summary>Can one task run several FFmpeg commands, e.g. for two-pass encoding?</summary>

Yes. Chain the commands with `&&` and start every command after an `&&` with the `${FFMPEG}` wildcard:

```
-y -i ${INPUT_FILE} -c:v libx264 -b:v 2M -pass 1 -f null /dev/null && ${FFMPEG} -y -i ${INPUT_FILE} -c:v libx264 -b:v 2M -pass 2 ${OUTPUT_FILE}
```

See [Task Properties](/docs/tasks.md#task-properties).
</details>

<details>
<summary>Why don't pipes or redirects work in my command or script?</summary>

FFmate runs commands and scripts directly, not through a shell. Shell features such as pipes (`|`), redirects (`>`) or `$VARIABLES` don't work. To use them, put them inside a script and call that script.

See [Pre and Post Processing](/docs/pre-post-prcessing.md).
</details>

<details>
<summary>How do I run tasks only on certain FFmate instances, e.g. ones with a GPU?</summary>

Give those FFmate instances a label with `--labels`, e.g. `ffmate server --labels="gpu"`, and add the same label to the tasks or presets: `"labels": ["gpu"]`. Tasks with labels only run on FFmate instances with a matching label. Tasks without labels run on any FFmate instance.

See [`--labels`](/docs/flags.md#labels).
</details>

## Presets, Wildcards and Scripts

<details>
<summary>How do I use presets to simplify recurring tasks?</summary>

Create a preset once, in the Web UI or with `POST /api/v1/presets`. Tasks and watchfolders reference the preset by its `uuid`: `"preset": "<uuid>"`. The command and settings are then managed in one place.

See [Presets](/docs/presets.md).
</details>

<details>
<summary>How can I use wildcards to include timestamps in output file names?</summary>

Put a wildcard such as `${TIMESTAMP_SECONDS}` in the `outputFile` of a task or preset. FFmate replaces it when the task runs, so `clip_${TIMESTAMP_SECONDS}.mp4` becomes `clip_1717065600.mp4`.

See [Wildcards](/docs/wildcards.md).
</details>

<details>
<summary>How do I run a custom script before or after transcoding?</summary>

Add a `preProcessing` or `postProcessing` object when creating a task or preset:

```json
{
  "preProcessing": { "scriptPath": "/scripts/prepare.sh" },
  "postProcessing": { "scriptPath": "/scripts/cleanup.sh" }
}
```

FFmate runs the script before or after FFmpeg. Add a `sidecarPath` to have FFmate write a JSON file with all task details that the script can read.

See [Pre and Post Processing](/docs/pre-post-prcessing.md).
</details>

## Watchfolders

<details>
<summary>How do I create a watchfolder that processes only .mov files?</summary>

To create the watchfolder, send a `POST` request to `/api/v1/watchfolders` with a `filter`:

```json
{
  "filter": { "extensions": { "include": ["mov"] } }
}
```

See [Creating a Watchfolder](/docs/watchfolder.md#creating-a-watchfolder).
</details>

<details>
<summary>How does FFmate ensure a file is fully copied before processing?</summary>

FFmate compares the size of each new file across `growthChecks` scans. If the size stays the same in all of them, FFmate creates the task. If the file is still growing, the count starts again.

See [How Watchfolders Work](/docs/watchfolder.md#how-watchfolders-work).
</details>

<details>
<summary>Why wasn't a file in my watchfolder picked up?</summary>

Check these:

* A `.lock` file with the same name exists next to it, so FFmate has already processed it.
* The file name starts with `.`. Hidden files are skipped.
* The file's extension doesn't pass the watchfolder's `filter`.
* The file is still growing, or the `growthChecks` scans haven't finished yet.
* The watchfolder is `suspended`.
* The watchfolder has `labels`, and no FFmate instance has a matching label.

See [Watchfolders](/docs/watchfolder.md).
</details>

<details>
<summary>How do I process a file from a watchfolder again?</summary>

Delete its `.lock` file, e.g. `movie.mp4.lock`. At the next scan, FFmate treats the file as new and creates a task for it.

See [How Watchfolders Work](/docs/watchfolder.md#how-watchfolders-work).
</details>

## Server, Monitoring and Debugging

<details>
<summary>How do I run FFmate on a different port with five concurrent tasks?</summary>

```bash
ffmate server --port 8080 --max-concurrent-tasks 5
```

See [Server Command Flags](/docs/flags.md#server-command-flags).
</details>

<details>
<summary>How do I enable detailed debug logs for the task queue?</summary>

Start the FFmate server with `--debug="debug:task"`. To change the logs while FFmate is running, send `PATCH /api/v1/debug/debug:task`.

See [Debugging](/docs/debugging.md).
</details>

<details>
<summary>How do I check that FFmate is running, e.g. from Kubernetes or a load balancer?</summary>

Use `GET /health`. It returns `200` with `{"status":"ok"}` once FFmate is ready, and `500` otherwise. For Prometheus, FFmate also provides counters at `GET /metrics`.

See [Health Endpoint](/docs/ffmate-internals.md#health-endpoint).
</details>

<details>
<summary>How do I see whether my webhooks were delivered?</summary>

`GET /api/v1/webhooks/executions` lists every webhook delivery, newest first, with the request FFmate sent and the response your server returned.

See [Webhook logs](/docs/webhooks.md#webhook-logs).
</details>

<details>
<summary>Where can I find the API docs and the Postman collection?</summary>

Start FFmate and open `/swagger` in the browser, for example [http://localhost:3000/swagger/index.html](http://localhost:3000/swagger/index.html). It shows the Swagger UI for the FFmate REST API.

The official [FFmate Postman collection](https://www.postman.com/welovemedia/ffmate) has ready-made requests for the FFmate API and needs no setup.

See [Swagger](/docs/swagger.md) and [Postman Collection](/docs/swagger.md#postman-collection).
</details>

<details>
<summary>How do I update FFmate to the latest version?</summary>

Run `ffmate update` for native installs. Homebrew users can run `brew upgrade ffmate`. For Docker, pull the newest image and restart the container, e.g. `docker compose pull && docker compose up -d`.

See [Updating FFmate](/docs/getting-started.md#updating-ffmate).
</details>

<details>
<summary>Where can I get help or report bugs?</summary>

Ask on the [FFmate Discord server](https://discord.gg/NzfeHn37jT) or open an issue in the [FFmate GitHub repository](https://github.com/welovemedia/ffmate/issues). To suggest a change to the docs, click **Edit this page on GitHub** at the bottom of any page.

See [Community & Support](/docs/ffmate-community.md).
</details>
