---
title: FAQ
---

# FFmate FAQ

## Getting Started

<details>
<summary>What is FFmate?</summary>

FFmate is an automation layer built on top of FFmpeg to simplify media transcoding workflows.

Learn more → [What is FFmate?](/docs/what-is-ffmate)
</details>

<details>
<summary>What platforms does FFmate support?</summary>

FFmate runs on Windows, macOS, Linux, and Docker.

Learn more → [Downloading & Installing FFmate](/docs/getting-started#downloading-installing-ffmate)
</details>

<details>
<summary>How do I install FFmate on macOS?</summary>

The quickest path is Homebrew:

```bash
brew install ffmate
```
Learn more → [Downloading & Installing FFmate](/docs/getting-started#downloading-installing-ffmate)
</details>

<details>
<summary>Does FFmate need FFmpeg to be installed?</summary>

Yes. FFmate runs every task with FFmpeg. By default, it looks for `ffmpeg` in the system `PATH`. If FFmpeg isn't found, FFmate still starts, but tasks stay `QUEUED`. FFmate checks again every 10 seconds and starts processing as soon as FFmpeg is available.

The Docker image already includes FFmpeg.

Learn more → [Installing FFmpeg](/docs/getting-started#installing-ffmpeg)
</details>

<details>
<summary>What port does FFmate run on, and how do I change it?</summary>

FFmate’s API & Web UI listen on port **3000** by default. Add `--port <number>` when you start the server, e.g. `ffmate server --port 8080`. In Docker, set the `PORT` environment variable and change the `-p` port mapping to match.

Learn more → [Server Command Flags](/docs/flags#server-command-flags)
</details>

<details>
<summary>How do I point FFmate to a custom FFmpeg binary?</summary>

Use `--ffmpeg "/full/path/to/ffmpeg"` when launching `ffmate server`. FFmate will call that binary for every task.

Learn more → [Server Command Flags](/docs/flags#server-command-flags)
</details>

<details>
<summary>How do I stop FFmate from opening the Web UI on startup?</summary>

Start the server with `--no-ui`. The Web UI is still available at `http://localhost:3000/ui`; FFmate just doesn't open it in the browser. In Docker, FFmate never opens a browser.

Learn more → [Server Command Flags](/docs/flags#server-command-flags)
</details>

<details>
<summary>Where does FFmate store its data?</summary>

In a SQLite database. By default it's created at:

* Windows: `%APPDATA%\ffmate\db.sql`
* macOS/Linux: `~/.ffmate/db.sqlite`
* Docker: `/app/db/sqlite.db`

Use `--database` to choose another file, or a `postgresql://` URI to run several FFmate instances as a [cluster](/docs/clustering).

Learn more → [Server Command Flags](/docs/flags#server-command-flags)
</details>

## Security

<details>
<summary>Is it safe to make FFmate reachable from the network?</summary>

Only with protection. By default, FFmate listens on all network interfaces (`0.0.0.0`) and has no password. Anyone who can reach its port can create tasks and presets, and their [pre- and post-processing scripts](/docs/pre-post-prcessing) can run any command on the computer FFmate runs on.

* To keep FFmate on the local machine, start it with `--host 127.0.0.1`.
* To share it on a network, start it with `--basic-auth` and limit access with a firewall.
* Run FFmate as a user without admin or `root` rights.

Learn more → [Server Command Flags](/docs/flags#server-command-flags)
</details>

<details>
<summary>How do I protect FFmate with a username and password?</summary>

Start the server with `--basic-auth`, e.g. `ffmate server --basic-auth="admin:secret"`. Every request then needs the username and password: the API, the Web UI, the Swagger UI, `/health` and `/metrics`. The browser asks for them when opening the Web UI.

Learn more → [Server Command Flags](/docs/flags#server-command-flags)
</details>

## Tasks

<details>
<summary>How do I create a transcoding task via the API?</summary>

Send a `POST` to `/api/v1/tasks` with at least a `name`, plus a `command` or a `preset`. Example:

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

FFmate queues the task, returns it with its `uuid`, and fires a `task.created` webhook.

Learn more → [Creating a Task](/docs/tasks#creating-a-task)
</details>

<details>
<summary>How can I monitor the status of a task?</summary>

`GET /api/v1/tasks/{uuid}` returns a JSON payload including `status`, `progress`, and timestamps. 
You can also check the Web UI’s *Tasks* tab for live updates.

Learn more → [Monitoring a Task](/docs/tasks#monitoring-a-task)
</details>

<details>
<summary>Why does my task stay in QUEUED?</summary>

The most common reasons:

* FFmate can't find FFmpeg. Check the startup log, and set the path with `--ffmpeg` if needed.
* FFmate is already running as many tasks as [`--max-concurrent-tasks`](/docs/flags#server-command-flags) allows. The task starts when one of them finishes.
* The task has [labels](/docs/tasks#task-properties), but no FFmate instance has a matching label.

Learn more → [Tasks](/docs/tasks)
</details>

<details>
<summary>How do I cancel a running task?</summary>

`PATCH /api/v1/tasks/{uuid}/cancel` immediately stops queued or running tasks and marks them `DONE_CANCELED`.
The Web UI offers a one‑click “Cancel” button too.

Learn more → [Canceling a Task](/docs/tasks#canceling-a-task)
</details>

<details>
<summary>How do I restart a failed task?</summary>

`PATCH /api/v1/tasks/{uuid}/restart` resets the task to `QUEUED`, clears its error, progress and retry count, and puts it back in the processing queue.

Learn more → [Restarting a Task](/docs/tasks#restarting-a-task)
</details>

<details>
<summary>Can FFmate retry failed tasks automatically?</summary>

Yes. Set `retries` on the task or its preset, e.g. `"retries": 2`. If the task fails, FFmate puts it back into `QUEUED` after 3 seconds, up to that many times. Canceled tasks are not retried.

Learn more → [Task Properties](/docs/tasks#task-properties)
</details>

<details>
<summary>What happens to running tasks when FFmate stops or crashes?</summary>

When FFmate starts again, it sets the tasks it was running to `DONE_ERROR` with the error `client disconnected during execution`. In a [cluster](/docs/clustering), the other FFmate instances do this after about 60 seconds. Restart those tasks to run them again.

Learn more → [Clustering](/docs/clustering)
</details>

<details>
<summary>How do I submit a batch of tasks?</summary>

POST to `/api/v1/batches` with the tasks in a `tasks` array: `{"tasks": [ … ]}`. FFmate assigns a shared `batch` ID so you can track them as a group while each task still runs independently.

Learn more → [Submitting Multiple Tasks as a Batch](/docs/tasks#submitting-multiple-tasks-as-a-batch)
</details>

<details>
<summary>Can one task run several FFmpeg commands, e.g. for two-pass encoding?</summary>

Yes. Chain the commands with `&&` and start every command after an `&&` with the `${FFMPEG}` wildcard:

```
-y -i ${INPUT_FILE} -c:v libx264 -b:v 2M -pass 1 -f null /dev/null && ${FFMPEG} -y -i ${INPUT_FILE} -c:v libx264 -b:v 2M -pass 2 ${OUTPUT_FILE}
```

Learn more → [Task Properties](/docs/tasks#task-properties)
</details>

<details>
<summary>Why don't pipes or redirects work in my command or script?</summary>

FFmate runs commands and scripts directly, not through a shell. Shell features such as pipes (`|`), redirects (`>`) or `$VARIABLES` don't work. To use them, put them inside a script and call that script.

Learn more → [Pre and Post Processing](/docs/pre-post-prcessing)
</details>

<details>
<summary>How do I run tasks only on certain FFmate instances, e.g. ones with a GPU?</summary>

Give those FFmate instances a label with `--labels`, e.g. `ffmate server --labels="gpu"`, and add the same label to the tasks or presets: `"labels": ["gpu"]`. Tasks with labels only run on FFmate instances with a matching label. Tasks without labels run on any FFmate instance.

Learn more → [Server Command Flags](/docs/flags#server-command-flags)
</details>

## Presets, Wildcards and Scripts

<details>
<summary>How do I use presets to simplify recurring tasks?</summary>

Create a preset (Web UI or `/api/v1/presets`) once, then reference its UUID in future tasks or watchfolders using `"preset": "<uuid>"`. The command and settings are then managed in one place.

Learn more → [Presets](/docs/presets)
</details>

<details>
<summary>How can I use wildcards to include timestamps in output file names?</summary>

Embed placeholders like `${TIMESTAMP_SECONDS}` inside your `outputFile` or preset path. FFmate expands them at runtime so `clip_${TIMESTAMP_SECONDS}.mp4` becomes `clip_1717065600.mp4`.

Learn more → [Wildcards](/docs/wildcards)
</details>

<details>
<summary>How do I run a custom script before or after transcoding?</summary>

Add a `preProcessing` or `postProcessing` when creating a task or preset:

```json
"preProcessing": { "scriptPath": "/scripts/prepare.sh" },
"postProcessing": { "scriptPath": "/scripts/cleanup.sh" }
```

FFmate runs the script before or after FFmpeg. Add a `sidecarPath` to have FFmate write a JSON file with all task details that the script can read.

Learn more → [Pre and Post Processing](/docs/pre-post-prcessing)
</details>

## Watchfolders

<details>
<summary>How do I create a watchfolder that processes only .mov files?</summary>

POST to `/api/v1/watchfolders` with a filter:

```json
"filter": { "extensions": { "include": ["mov"] } }
```

Learn more → [Creating a Watchfolder](/docs/watchfolder#creating-a-watchfolder)
</details>

<details>
<summary>How does FFmate ensure a file is fully copied before processing?</summary>

Each detected file passes through **growth checks**: FFmate compares the file size across `growthChecks` successive scans. Only when the size remains constant does the task start. This way, FFmate never starts a task on a half-copied file.

Learn more → [How Watchfolders Work](/docs/watchfolder#how-watchfolders-work)
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

Learn more → [Watchfolders](/docs/watchfolder)
</details>

<details>
<summary>How do I process a file from a watchfolder again?</summary>

Delete its `.lock` file, e.g. `movie.mp4.lock`. At the next scan, FFmate treats the file as new and creates a task for it.

Learn more → [How Watchfolders Work](/docs/watchfolder#how-watchfolders-work)
</details>

## Server, Monitoring and Debugging

<details>
<summary>How do I run FFmate on a different port with five concurrent tasks?</summary>

```bash
ffmate server --port 8080 --max-concurrent-tasks 5
```

Learn more → [Server Command Flags](/docs/flags#server-command-flags)
</details>

<details>
<summary>How do I enable detailed debug logs for the task queue?</summary>

Start the FFmate server with `--debug="debug:task"`. To change the logs while FFmate is running, send `PATCH /api/v1/debug/debug:task`.

Learn more → [Debugging](/docs/debugging)
</details>

<details>
<summary>How do I check that FFmate is running, e.g. from Kubernetes or a load balancer?</summary>

Use `GET /health`. It returns `200` with `{"status":"ok"}` once FFmate is ready, and `500` otherwise. For Prometheus, FFmate also provides counters at `GET /metrics`.

Learn more → [Health Endpoint](/docs/ffmate-internals#health-endpoint)
</details>

<details>
<summary>How do I see whether my webhooks were delivered?</summary>

`GET /api/v1/webhooks/executions` lists every webhook delivery, newest first, with the request FFmate sent and the response your server returned.

Learn more → [Webhook logs](/docs/webhooks#webhook-logs)
</details>

<details>
<summary>Does FFmate send telemetry?</summary>

Yes, by default FFmate sends anonymous usage data, such as its version, operating system, settings and task counts. Turn it off with `--send-telemetry=false`.

Learn more → [Server Command Flags](/docs/flags#server-command-flags)
</details>

<details>
<summary>Where can I view API docs for FFmate?</summary>

Start FFmate and open `/swagger` in your browser (e.g., [http://localhost:3000/swagger/index.html](http://localhost:3000/swagger/index.html)) to access the OpenAPI UI.

Learn more → [Swagger](/docs/swagger)
</details>

<details>
<summary>How do I update FFmate to the latest version?</summary>

Run `ffmate update` for native installs. Homebrew users can run `brew upgrade ffmate`. For Docker, pull the newest image and restart the container, e.g. `docker compose pull && docker compose up -d`.

Learn more → [Updating FFmate](/docs/getting-started#updating-ffmate)
</details>

<details>
<summary>Where can I get help or report bugs?</summary>

Join the Discord community, file issues on GitHub, or reach out via the support links in the docs’ *Community & Support* page. Feedback on docs is welcome—every page has an “Edit this page” link!

Learn more → [Community & Support](/docs/ffmate-community)
</details>
