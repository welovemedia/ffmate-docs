---
title: "FFmate Presets: Automate & Standardize FFmpeg Workflows"
description: "Simplify complex FFmpeg tasks with FFmate presets. Define reusable templates for commands, output paths, and processing scripts to streamline your media encoding and ensure consistency"
---

# Presets

Presets in FFmate are powerful, reusable templates that simplify how you define and run FFmpeg tasks. They allow you to preconfigure FFmpeg commands, output patterns, priorities, and even automated pre/post-processing scripts, streamlining your entire transcoding workflow.

Think of a preset as a named, shareable "recipe" for media processing. Presets help streamline task creation, reduce errors, and ensure that jobs follow a standardized workflow every time they're run.

## Creating a Preset

To create a preset, send a `POST` request to the FFmate API:

```sh
curl -X POST http://localhost:3000/api/v1/presets \
     -H "Content-Type: application/json" \
     -d '{
       "name": "MP4 Standard Quality",
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k ${OUTPUT_FILE}",
       "description": "Converts video to MP4 with H.264 video and AAC audio, good balance of quality and size.",
       "outputFile": "${INPUT_FILE_BASENAME}_standard.mp4",
       "priority": 1,
       "postProcessing": {
         "scriptPath": "/usr/local/bin/notify_completion.sh --file ${OUTPUT_FILE} --status success"
       }
     }'
```

After you create a preset, FFmate responds with a JSON object that includes the `uuid` of the newly created preset.

💡 Tip: Prefer a visual approach? You can create new presets directly in the [FFmate Web UI](/docs/web-ui.md) without writing any API requests.

## Presets properties

When creating a preset, you define a set of parameters that will be automatically applied to any task that uses it. 

-   **`name`** *[optional]* - A short, descriptive name to help you quickly identify the preset (e.g., "Convert to MP4 1080p", "Extract Audio as MP3").

-   **`description`** *[optional]* – A short note about what the preset is for or how it should be used (e.g., "Converts ProRes to H.264 for review copies").
  
- **`FFmpeg command`** *[optional]* – The custom command FFmate will use to run FFmpeg for this preset. Use this to define exactly how the media should be processed—for example, which codec to use, what resolution to convert to, or which filters to apply. Note that If a [task](/docs/tasks.md) references a preset, the `command` defined in the preset will *always* be used—any command provided directly in the [task](/docs/tasks.md) will be ignored.

💡 Tip: You can use [wildcards](/docs/wildcards.md) like `${INPUT_FILE}` and `${OUTPUT_FILE}` inside the command string. FFmate will automatically replace them with the actual file paths when the task runs.

::: tip Not sure which FFmpeg commands to use?

- [OSTechNix – 20+ FFmpeg Commands For Beginners](https://ostechnix.com/20-ffmpeg-commands-beginners/)
- [Abyssale – Top 20 best commands for FFmpeg](https://www.abyssale.com/blog/top-20-best-commands-for-ffmpeg)
- [VideoProc – 31 Must-Haves FFmpeg Commands for Beginners](https://www.videoproc.com/resource/ffmpeg-commands.htm)
- [GorillaSun – A Simple Guide to FFMPEG](https://www.gorillasun.de/blog/a-simple-guide-to-ffmpeg/)
- [Bannerbear – Top 10 FFmpeg Command Options You Need to Know](https://www.bannerbear.com/blog/ffmpeg-101-top-10-command-options-you-need-to-know-with-examples/)
- <a href="https://chat.openai.com/?model=gpt-4&prompt=You%20are%20a%20senior%20media-encoding%20engineer%20and%20%60ffmpeg%60%20power-user.%0AFollow%20the%20outlined%20thinking%20steps%20**before**%20you%20answer.%0A%0A%5BTHINKING%20STEPS%5D%20%20%0A1.%20Draft%20the%20full%20%60ffmpeg%60%20command%3B%20include%3A%20%20%0A%C2%A0%C2%A0%E2%80%A2%20Explicit%20input%28s%29%20and%20output%28s%29%20%0A%C2%A0%C2%A0%E2%80%A2%20All%20necessary%20options%20in%20a%20logical%20order%20%0A%C2%A0%C2%A0%E2%80%A2%20Comments%20%28%23%29%20explaining%20non-obvious%20flags%0A2.%20Double-check%20every%20flag%20against%20typical%20pitfalls%20%28stream-copy%20vs.%20re-encode%2C%20color-matrix%2C%20time-bases%2C%20VFR%2C%20ProRes%20profile%2C%20CRF%20ranges%2C%20hardware%20encoders%29.%0A3.%20Provide%20a%20**single-line%20copy-pasteable%20command**%20plus%20a%20bullet%20list%20of%20key%20decisions.%0A%0A%5BOUTPUT%20FORMAT%5D%0A%60%60%60bash%0A%23%20Command%20%E2%94%80%20ready%20to%20copy%0Affmpeg%20-i%20INPUT%20%E2%80%A6%20-c%3Av%20%E2%80%A6%20-c%3Aa%20%E2%80%A6%20-vf%20%E2%80%A6%20-preset%20%E2%80%A6%20-crf%20%E2%80%A6%20OUTPUT%0A%0A%23%20Explanation%0A%E2%80%A2%20%E2%80%A6%0A%E2%80%A2%20%E2%80%A6%0A%60%60%60%0A%0A%5BUSER%20REQUEST%5D" target="_blank" rel="noopener noreferrer">Ask ChatGPT</a>
:::

- **`output file path`** *[optional]* – Specifies where the output file should be saved. This can be a full path or a pattern that includes [Wildcards](/docs/wildcards.md) like `${INPUT_FILE_BASENAME}` to dynamically generate structured filenames (e.g., /exports/${INPUT_FILE_BASENAME}_1080p.mp4). If a task also includes its own `outputFile`, that will be used instead of this one. In other words, the task's setting always takes priority over the preset.

- **`priority`** *[optional]* – Sets the task's priority in the processing queue. Higher numbers mean higher priority — for example, a task with priority `100` will be processed before one with `10`. If multiple tasks share the same priority, they’ll generally run in the order they were created (FIFO for that priority level). If a task defines its own `priority`, that will override the preset’s value. If neither is set, a default (usually `0`) is used.


- **`pre-processing`** *[optional]* – Defines a script that runs *before* the main `ffmpeg` command. If the task includes its own `preProcessing` config, FFmate will use that instead of the preset’s.

    - **`scriptPath`** – The command or path to the script to run. You can use [Wildcards](/docs/wildcards.md) to insert dynamic values.

      *Example:* `python /opt/scripts/validate_input.py --input ${INPUT_FILE} --metadata_out ${INPUT_FILE_BASENAME}.json`

    - **`sidecarPath`** *[optional]* – Path where FFmate will write a JSON file with task details (input/output paths, metadata, etc.) before running the script. Your script can then read this file to make decisions. Wildcards are supported.

      *Example:* `${INPUT_FILE_DIR}/${INPUT_FILE_BASENAME}_ffmate_task.json`  

     
- **`post-processing`** *[optional]* – Defines a script that runs *after* the `ffmpeg` command completes successfully. If the task includes its own `postProcessing` config, FFmate will use that instead of the preset’s.

    - **`scriptPath`** *[mandatory]* – The command or path to the script to run. You can use [Wildcards](/docs/wildcards.md) to insert dynamic values.

      *Example:* `bash /opt/scripts/archive_and_notify.sh --source ${OUTPUT_FILE} --original ${INPUT_FILE}`

    - **`sidecarPath`** *[optional]* – Path where FFmate will write a JSON file with task details (including the final output path) before running the script. Your script can then read this file to make decisions. Wildcards are supported.

      *Example:* `${OUTPUT_FILE_DIR}/${OUTPUT_FILE_BASENAME}_ffmate_task_complete.json`  


## Listing Presets

To get a list of all available presets, send a `GET` request to the FFmate API

```sh
curl -X GET 'http://localhost:3000/api/v1/presets?page=0&perPage=10' \
     -H 'accept: application/json'
```

**Query Parameters:**

- **`page`** *[optional]* – Specifies which page of results to retrieve. Default: `0`.
- **`perPage`** *[optional]* – Defines how many tasks should be included in each page. Default: `50`.

💡 Tip: Want to browse existing presets? The [FFmate Web UI](/docs/web-ui.md) lets you view and search through all available presets with ease.

## Deleting a Preset

To delete an existing preset, send a `DELETE` request to the FFmate API, replacing `{presetId}` with the UUID of the preset you want to remove.

```sh
curl -X DELETE 'http://localhost:3000/api/v1/presets/a1b2c3d4-e5f6-7890-1234-567890abcdef' \
     -H 'accept: application/json'
```

💡 Tip: Presets can be safely deleted from the [FFmate Web UI](/docs/web-ui.md), with helpful context to avoid accidental removals.

### How to Use Presets When Creating Tasks

When you create a new task, you can simply reference the `uuid` of an existing preset.

**Example: Creating a Task using a Preset via API**

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

FFmate will then automatically:

1. Use the `command` defined in the **"ProRes HQ for Archive"** preset.
2. Generate the output file path based on the preset’s `outputFile` pattern.
3. Assign the preset’s `priority` value (`50`) to the task.
4. After ffmpeg finishes successfully, ffmate will
    * Run the `postProcessing` script (e.g., `notify_completion.sh`).