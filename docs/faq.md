---
title: FAQ
---

# FFmate FAQ

<details>
<summary>What is FFmate?</summary>

FFmate is an automation layer built on top of FFmpeg to simplify media transcoding workflows.

Learn more → [What is FFmate?](/docs/what-is-ffmate)
</details>

<details>
<summary>What platforms does FFmate support?</summary>

FFmate runs on Windows, macOS, Linux, and Docker.

Learn more → [Platform Support](/docs/getting-started#platform-support)
</details>

<details>
<summary>How do I install FFmate on macOS?</summary>

The quickest path is Homebrew:

```bash
brew tap welovemedia/ffmate --no-quarantine
brew install ffmate
```
Learn more → [Download & Install FFmate](/docs/getting-started#download--install-ffmate)
</details>

<details>
<summary>What port does FFmate run on, and how do I change it?</summary>

FFmate’s API & Web UI listen on port **3000** by default. Add `--port <number>` (or `-p`) when you start the server, e.g. `ffmate server --port 8080`, or set the `PORT` env‑var in Docker.

Learn more → [Server Command Flags](/docs/flags#server-command-flags)
</details>

<details>
<summary>How do I point FFmate to a custom FFmpeg binary?</summary>

Use `--ffmpeg "/full/path/to/ffmpeg"` (or `-f`) when launching `ffmate server`. In containers, set the `FFMPEG` env‑var or bake the binary into the image. FFmate will call that binary for every task.

Learn more → [Server Command Flags](/docs/flags#server-command-flags)
</details>

<details>
<summary>How do I create a transcoding task via the API?</summary>

Send a `POST` to `/api/v1/tasks` with at minimum a `command` string. Example:

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
        "command": "-y -i ${INPUT_FILE} -c:v libx264 -crf 23 ${OUTPUT_FILE}",
        "inputFile": "videos/input.mp4",
        "outputFile": "videos/output.mp4",
        "priority": 50
      }'
```

FFmate queues the task, returns its UUID, and fires a `task.created` webhook.

Learn more → [Creating a Task](/docs/tasks#creating-a-task)
</details>

<details>
<summary>How can I monitor the status of a task?</summary>

`GET /api/v1/tasks/{taskId}` returns a JSON payload including `status`, `progress`, and timestamps. 
You can also check the Web UI’s *Tasks* tab for live updates.

Learn more → [Monitoring a Task](/docs/tasks#monitoring-a-task)
</details>

<details>
<summary>How do I cancel a running task?</summary>

`PATCH /api/v1/tasks/{taskId}/cancel` immediately stops queued or running jobs and marks them `DONE_CANCELED`.
The Web UI offers a one‑click “Cancel” button too.

Learn more → [Canceling a Task](/docs/tasks#canceling-a-task)
</details>

<details>
<summary>How do I submit a batch of tasks?</summary>

POST an array of task objects to `/api/v1/tasks/batch`. FFmate assigns a shared `batch` ID so you can track them as a group while each task still runs independently.

Learn more → [Submitting Multiple Tasks as a Batch](/docs/tasks#submitting-multiple-tasks-as-a-batch)
</details>

<details>
<summary>How do I restart a failed task?</summary>

`PATCH /api/v1/tasks/{taskId}/restart` resets the task to `QUEUED`, clears errors, and puts it back in the processing queue.

Learn more → [Restarting a Task](/docs/tasks#restarting-a-task)
</details>

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

Each detected file passes through a **growth checks**: FFmate compares file size across `growthChecks` successive scans. Only when the size remains constant does the task start. This prevents half‑copied media from breaking jobs.

Learn more → [How File Detection Works](/docs/watchfolder#how-file-detection-works)
</details>

<details>
<summary>How do I use presets to simplify recurring tasks?</summary>

Create a preset (Web UI or `/api/v1/presets`) once, then reference its UUID in future tasks or watchfolders using `"preset": "<uuid>"`. This keeps command‑lines DRY and centrally managed.

Learn more → [Presets](/docs/presets)
</details>

<details>
<summary>How can I use wildcards to include timestamps in output file names?</summary>

Embed placeholders like `${TIMESTAMP_SECONDS}` inside your `outputFile` or preset path. FFmate expands them at runtime so `clip_${TIMESTAMP_SECONDS}.mp4` becomes `clip_1717065600.mp4`.

Learn more → [Wildcards](/docs/wildcards)
</details>

<details>
<summary>How do I run a custom script before or after transcoding?</summary>

Add a `preProcessing` or `postProcessing` when creating a task or watchfolder:

```json
"preProcessing": { "scriptPath": "/scripts/prepare.sh" },
"postProcessing": { "scriptPath": "/scripts/cleanup.sh" }
```

FFmate executes them and passes a JSON sidecar with task metadata.

Learn more → [Pre and Post Processing](/docs/pre-post-processing)
</details>

<details>
<summary>How do I run FFmate on a different port with five concurrent tasks?</summary>

```bash
ffmate server --port 8080 --max-concurrent-tasks 5 --loglevel warn
```

Learn more → [Server Command Flags](/docs/flags#server-command-flags)
</details>

<details>
<summary>How do I enable detailed debug logs for the task queue?</summary>

Start the FFmate server with `--debug="queue"`

Learn more → [Global Flags](/docs/flags#global-flags)
</details>

<details>
<summary>Where can I view API docs for FFmate?</summary>

Start FFmate and open `/swagger` in your browser (e.g., [http://localhost:3000/swagger/index.html](http://localhost:3000/swagger/index.html)) to access the OpenAPI UI.

Learn more → [Swagger](/docs/swagger)
</details>

<details>
<summary>How do I update FFmate to the latest version?</summary>

Run `ffmate update` for native installs, or pull the newest Docker image (`ghcr.io/welovemedia/ffmate:latest && docker compose up -d`). Homebrew users can `brew upgrade ffmate`.

Learn more → [Updating FFmate](/docs/getting-started#updating-ffmate)
</details>

<details>
<summary>Where can I get help or report bugs?</summary>

Join the Discord community, file issues on GitHub, or reach out via the support links in the docs’ *Community & Support* page. Feedback on docs is welcome—every page has an “Edit this page” link!

Learn more → [Community & Support](/docs/ffmate-community)
</details>