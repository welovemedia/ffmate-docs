---
title: "FFmate Presets: Reusable FFmpeg Commands"
description: "Create, list, update and delete FFmate presets: saved FFmpeg commands with output path, priority, retries, labels, scripts and webhooks that tasks reuse."
---

# Presets

A **preset** in FFmate saves an `FFmpeg` command together with its output file pattern, priority and optional pre- and post-processing scripts. Every task that uses the preset takes these settings from it, so they don't have to be repeated in each task.

FFmate ships with 20 built-in presets covering the most common media tasks, including format conversion, frame rate adjustment, audio extraction and platform-specific encodes for YouTube, TikTok, Instagram, Facebook and Twitch.

The built-in presets are maintained in an [open GitHub repository](https://github.com/welovemedia/ffmate-presets), where changes and new presets can be suggested through pull requests. Custom presets can be created through the REST API or in the [Web UI](/docs/web-ui.md#creating-a-preset).

## Creating a Preset

To create a preset, send a `POST` request to the FFmate API:

```sh
curl -X POST http://localhost:3000/api/v1/presets \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Analyze and Transcode MP4",
       "description": "Runs an analysis script to determine the best CRF value, which is then used in the transcode command.",
       "command": "-y -stats_period 5 -i ${INPUT_FILE} -c:v libx264 -preset medium -crf ${METADATA_crf_value} -c:a aac -b:a 128k ${OUTPUT_FILE}",
       "outputFile": "${INPUT_FILE_BASENAME}_analyzed.mp4",
       "priority": 5,
       "preProcessing": {
         "scriptPath": "/opt/ffmate/scripts/analyze_bitrate.sh --input ${INPUT_FILE} --sidecar /var/tmp/${INPUT_FILE_BASENAME}.json",
         "sidecarPath": "/var/tmp/${INPUT_FILE_BASENAME}.json",
         "importSidecar": true
       },
       "postProcessing": {
         "scriptPath": "/opt/ffmate/scripts/cleanup.sh --file ${OUTPUT_FILE} --status success"
       },
       "webhooks": [
         {
           "event": "task.updated",
           "url": "https://workflow-engine.example.com/api/ffmate/job-status-update"
         }
       ]
     }'
```

FFmate returns a JSON object that contains the newly created preset, including its `uuid`. A `preset.created` event is also fired via [Global webhooks](/docs/webhooks.md#preset-events-1) and [Direct webhooks](/docs/webhooks.md#preset-events).

💡 Tip: To create a preset in the Web UI, see [Creating a Preset](/docs/web-ui.md#creating-a-preset).

## Preset Properties

The properties below apply to every task that uses the preset.

-   **`name`** *[mandatory]* – The name of the preset, for example "Convert to MP4 1080p" or "Extract Audio as MP3".

-   **`description`** *[optional]* – A short note about what the preset is for, for example "Converts ProRes to H.264 for review copies".
  
- **`command`** *[mandatory]* – The `FFmpeg` command FFmate runs for tasks that use this preset. It sets how the media is processed, for example the codec, the resolution or the filters.

**How `command` works:**

  - Leave `ffmpeg` out at the start of the command. FFmate adds it when the task runs. By default, FFmate uses the `ffmpeg` binary on the system's `PATH`. To use a different FFmpeg, set its path with the [`--ffmpeg`](/docs/flags.md#server-command-flags) flag.

  - FFmate also adds the `-stats_period 1` [option](https://ffmpeg.org/ffmpeg-all.html#Advanced-options) to every command, so FFmpeg reports progress once per second.

    A `-stats_period` in the command replaces it, for example `-stats_period 5`. The value sets how often `task.updated` [Global webhooks](/docs/webhooks.md#task-events-1) and [Direct webhooks](/docs/webhooks.md#task-events) fire and how often the Dashboard updates the progress.

  - [Wildcards](/docs/wildcards.md) like `${INPUT_FILE}` and `${OUTPUT_FILE}` can be used inside the command string. FFmate replaces them with the actual file paths when the task runs.

  - The `command` field also supports chaining several `FFmpeg` commands with `&&`, for example for two-pass encoding. Start every command after an `&&` with the `${FFMPEG}` wildcard. See [FFmpeg Path](/docs/wildcards.md#ffmpeg-path).

  - If a [task](/docs/tasks.md) uses a preset, FFmate always runs the preset's `command`. A `command` in the task itself is ignored.

::: tip Not sure which `FFmpeg` commands to use?

- [OSTechNix – 20+ FFmpeg Commands For Beginners](https://ostechnix.com/20-ffmpeg-commands-beginners/)
- [Abyssale – Top 20 best commands for FFmpeg](https://www.abyssale.com/blog/top-20-best-commands-for-ffmpeg)
- [VideoProc – 31 Must-Haves FFmpeg Commands for Beginners](https://www.videoproc.com/resource/ffmpeg-commands.htm)
- [GorillaSun – A Simple Guide to FFMPEG](https://www.gorillasun.de/blog/a-simple-guide-to-ffmpeg/)
- [Bannerbear – Top 10 FFmpeg Command Options You Need to Know](https://www.bannerbear.com/blog/ffmpeg-101-top-10-command-options-you-need-to-know-with-examples/)
- <a href="https://chat.openai.com/?model=gpt-4&prompt=You%20are%20a%20senior%20media-encoding%20engineer%20and%20%60ffmpeg%60%20power-user.%0AFollow%20the%20outlined%20thinking%20steps%20**before**%20you%20answer.%0A%0A%5BTHINKING%20STEPS%5D%20%20%0A1.%20Draft%20the%20full%20%60ffmpeg%60%20command%3B%20include%3A%20%20%0A%C2%A0%C2%A0%E2%80%A2%20Explicit%20input%28s%29%20and%20output%28s%29%20%0A%C2%A0%C2%A0%E2%80%A2%20All%20necessary%20options%20in%20a%20logical%20order%20%0A%C2%A0%C2%A0%E2%80%A2%20Comments%20%28%23%29%20explaining%20non-obvious%20flags%0A2.%20Double-check%20every%20flag%20against%20typical%20pitfalls%20%28stream-copy%20vs.%20re-encode%2C%20color-matrix%2C%20time-bases%2C%20VFR%2C%20ProRes%20profile%2C%20CRF%20ranges%2C%20hardware%20encoders%29.%0A3.%20Provide%20a%20**single-line%20copy-pasteable%20command**%20plus%20a%20bullet%20list%20of%20key%20decisions.%0A%0A%5BOUTPUT%20FORMAT%5D%0A%60%60%60bash%0A%23%20Command%20%E2%94%80%20ready%20to%20copy%0Affmpeg%20-i%20INPUT%20%E2%80%A6%20-c%3Av%20%E2%80%A6%20-c%3Aa%20%E2%80%A6%20-vf%20%E2%80%A6%20-preset%20%E2%80%A6%20-crf%20%E2%80%A6%20OUTPUT%0A%0A%23%20Explanation%0A%E2%80%A2%20%E2%80%A6%0A%E2%80%A2%20%E2%80%A6%0A%60%60%60%0A%0A%5BUSER%20REQUEST%5D" target="_blank" rel="noopener noreferrer">Ask ChatGPT</a>
:::

- **`outputFile`** *[optional]* – The path of the transcoded file. It can be a full path or contain [wildcards](/docs/wildcards.md), for example `/exports/${INPUT_FILE_BASENAME}_1080p.mp4`. If the folder doesn't exist, FFmate creates it. A task with its own `outputFile` uses that instead.

- **`priority`** *[optional]* – Sets the priority of tasks in the queue. A task with priority `100` runs before one with `10`. Tasks with the same priority run in the order they were created. A task with its own `priority` uses that instead. Default: `0`.

- **`labels`** *[optional]* – Up to 5 labels, each 1 to 32 characters long. They decide which FFmate instance processes tasks created from this preset. A task without its own labels inherits these. See [`--labels`](/docs/flags.md#server-command-flags).

- **`retries`** *[optional]* – How many times a failed task created from this preset is retried. A task without its own `retries` inherits this value. See [task properties](/docs/tasks.md#task-properties). Default: `0`.

- **`preProcessing`** *[optional]* – Defines a [Pre-Processing Script](/docs/pre-post-prcessing.md) to run before the task starts, for example to prepare files or check the input. A task with its own `preProcessing` uses that instead.
    *   **`scriptPath`**: The full path to the script or executable to run.
    *   **`sidecarPath`**: The full path to the JSON file that contains all task data.
    *   **`importSidecar`**: Defines if FFmate [re-imports the sidecar](/docs/pre-post-prcessing.md#importing-a-task-s-sidecar) JSON after the pre-processing script finishes.
     
- **`postProcessing`** *[optional]* – Defines a [Post-Processing Script](/docs/pre-post-prcessing.md) to run after the task completes, for example to move output files or clean up. A task with its own `postProcessing` uses that instead.
    *   **`scriptPath`**: The full path to the script or executable to run.
    *   **`sidecarPath`**: The full path to the JSON file that contains all task data. 

- **`webhooks`** *[optional]* – Direct webhook targets for this preset. Each entry needs an `event` and a `url`.
    *   Entries for `preset.created`, `preset.updated` or `preset.deleted` fire when this preset changes.
    *   Entries for `task.created`, `task.updated` or `task.deleted` are copied into every task created from this preset. For example, they can notify a project management tool whenever the task's status changes.

### How to Use Presets in Tasks

A new [task](/docs/tasks.md) can use a [built-in preset](/docs/web-ui.md#creating-a-preset) or a custom preset. Set the task's `preset` to the preset's `uuid` instead of writing a command. See [Using a Preset](/docs/tasks.md#using-a-preset) for which settings the task takes from the preset.

This request creates a task from a preset named ProRes HQ for Archive:

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Archive Raw Footage",
    "inputFile": "/path/to/raw_footage_01.mxf",
    "preset": "uuid-of-ProRes-HQ-for-Archive-preset",
    "metadata": {
      "project-id": "project_alpha_123",
      "shot_number": "005"
    }
  }'
```

The task runs the command of the ProRes HQ for Archive preset on `/path/to/raw_footage_01.mxf`.

## Listing Presets

To get a list of all presets, send a `GET` request to the FFmate API:

```sh
curl -X GET 'http://localhost:3000/api/v1/presets?page=0&perPage=10'
```

FFmate returns a JSON array of presets. The `X-Total` response header holds the total number of presets.

**Query parameters:**

- **`page`** *[optional]* – Specifies which page of results to retrieve. Default: `0`.
- **`perPage`** *[optional]* – Defines how many presets should be included in each page. Default: `100`.

💡 Tip: To see all presets in the Web UI, see [List of Active Presets](/docs/web-ui.md#list-of-active-presets).

## Getting a Single Preset

To get a single preset, send a `GET` request to the FFmate API with the preset's `uuid` in the path:

```sh
curl -X GET 'http://localhost:3000/api/v1/presets/a1b2c3d4-e5f6-7890-1234-567890abcdef'
```

FFmate returns a JSON object with the full details of the specified preset.

💡 Tip: To check a preset's details in the Web UI, see [Checking Preset Details](/docs/web-ui.md#checking-preset-details).

## Updating a Preset

To update a preset, send a `PUT` request to the FFmate API with the preset's `uuid` in the path. The properties are listed in [Preset Properties](#preset-properties).

::: warning `PUT` replaces the whole preset
The request body must contain every property the preset should keep, not only the ones that change. Properties left out are cleared. For example, a `PUT` with only `name` and `command` removes the preset's `description`, `outputFile`, `priority`, `labels`, `retries`, processing scripts and webhooks.
:::

```sh
curl -X PUT http://localhost:3000/api/v1/presets/{uuid} \
     -H "Content-Type: application/json" \
     -d '{
       "name": "MP4 High Quality (Updated)",
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k ${OUTPUT_FILE}",
       "description": "Converts video to MP4 with H.264 video and AAC audio, higher quality setting.",
       "outputFile": "${INPUT_FILE_BASENAME}_highquality.mp4",
       "priority": 5,
       "postProcessing": {
         "scriptPath": "/usr/local/bin/notify_completion.sh --file ${OUTPUT_FILE} --status success"
       }
     }'
```

FFmate returns the complete JSON object of the updated preset. A `preset.updated` event is also fired via [Global webhooks](/docs/webhooks.md#preset-events-1) and [Direct webhooks](/docs/webhooks.md#preset-events).

💡 Tip: To update a preset in the Web UI, see [Updating a Preset](/docs/web-ui.md#updating-a-preset).

## Deleting a Preset

To delete a preset, send a `DELETE` request to the FFmate API with the preset's `uuid` in the path:

```sh
curl -X DELETE 'http://localhost:3000/api/v1/presets/{uuid}'
```

FFmate responds with a `204` No Content status. The preset is removed from FFmate. A `preset.deleted` event is also fired via [Global webhooks](/docs/webhooks.md#preset-events-1) and [Direct webhooks](/docs/webhooks.md#preset-events).

💡 Tip: To delete a preset in the Web UI, see [Removing a Preset](/docs/web-ui.md#removing-a-preset). The Web UI asks for confirmation before it deletes the preset.