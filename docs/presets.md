---
title: "FFmate Presets: Automate & Standardize FFmpeg Workflows"
description: "Simplify complex FFmpeg tasks with FFmate presets. Define reusable templates for commands, output paths, and processing scripts to streamline your media encoding and ensure consistency"
---

# Presets

**Presets** in FFmate are reusable templates that make it easier to define and run `FFmpeg` tasks. With a preset, you can preconfigure `FFmpeg` commands, output patterns, priorities, and even pre- or post-processing scripts, so every task runs the same way without extra setup.

FFmate ships with **20 built-in presets** covering the most common media tasks, including format conversion, frame rate adjustment, audio extraction, and platform-specific encodes for YouTube, TikTok, Instagram, Facebook, and Twitch. These ready-to-use presets save you from having to figure out the right `FFmpeg` command for everyday jobs.  

All presets are maintained in an [open GitHub repository](https://github.com/welovemedia/ffmate-presets), where you can suggest changes or contribute new ones through pull requests. You can also create your own custom presets at any time using the API or the [web interface](/docs/web-ui.md#presets)

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

FFmate returns a JSON object that contains the newly created preset including its `ID`. An `preset.created` event is also fired via [webhooks](/docs/webhooks#preset-events)

💡 Tip: Prefer a visual approach? You can create new presets directly in the [FFmate Web UI](/docs/web-ui.md) no API calls needed.

## Presets properties

When you create a preset, you define parameters that are automatically applied to every task that uses it.

-   **`name`** *[optional]* - A short, descriptive name to help you quickly identify the preset (e.g., "Convert to MP4 1080p", "Extract Audio as MP3").

-   **`description`** *[optional]* – A short note about what the preset is for or how it should be used (e.g., "Converts ProRes to H.264 for review copies").
  
- **`FFmpeg command`** *[optional]* – The custom command FFmate will use to run `FFmpeg` for this preset. Use this to define exactly how the media should be processed—for example, which codec to use, what resolution to convert to, or which filters to apply. 

⚠️ **Important details about how `command` works:** 

  - You don’t need to add `ffmpeg` at the start of the command. FFmate automatically prepends it. By default, FFmate uses the `ffmpeg` binary in your system’s `PATH`. If you want to use a different version, you can override the default with the `--ffmpeg <path>` [command-line flag](/docs/flags.md#server-command-flags).  

  - FFmate also implicitly adds the `-stats_period 1` [option](https://ffmpeg.org/ffmpeg-all.html#Advanced-options) to every command, which limits FFmpeg’s progress output to one update per second.  
    
    You can override this by explicitly adding your own `-stats_period x` to the command.  
    - This setting directly affects:  
      - how often `task.updated` [webhook](/docs/webhooks#task-events) is sent, and  
      - how often the job dashboard refreshes progress updates.  

  - The `command` field also supports chaining multiple `FFmpeg` commands with `&&`. This is useful for advanced workflows such as **two-pass encoding**. When chaining commands, you must use the `${FFMPEG}` wildcard (see [FFmpeg Path](/docs/wildcards.md#ffmpeg-path) for more details). 
  
    You can also use [wildcards](/docs/wildcards.md) like `${INPUT_FILE}` and `${OUTPUT_FILE}` inside the command string. FFmate will automatically replace them with the actual file paths when the task runs.

  - If a [task](/docs/tasks.md) references a preset, the `command` defined in the preset will **always** be used—any command provided directly in the [task](/docs/tasks.md) will be ignored.


::: tip Not sure which `FFmpeg` commands to use?

- [OSTechNix – 20+ FFmpeg Commands For Beginners](https://ostechnix.com/20-ffmpeg-commands-beginners/)
- [Abyssale – Top 20 best commands for FFmpeg](https://www.abyssale.com/blog/top-20-best-commands-for-ffmpeg)
- [VideoProc – 31 Must-Haves FFmpeg Commands for Beginners](https://www.videoproc.com/resource/ffmpeg-commands.htm)
- [GorillaSun – A Simple Guide to FFMPEG](https://www.gorillasun.de/blog/a-simple-guide-to-ffmpeg/)
- [Bannerbear – Top 10 FFmpeg Command Options You Need to Know](https://www.bannerbear.com/blog/ffmpeg-101-top-10-command-options-you-need-to-know-with-examples/)
- <a href="https://chat.openai.com/?model=gpt-4&prompt=You%20are%20a%20senior%20media-encoding%20engineer%20and%20%60ffmpeg%60%20power-user.%0AFollow%20the%20outlined%20thinking%20steps%20**before**%20you%20answer.%0A%0A%5BTHINKING%20STEPS%5D%20%20%0A1.%20Draft%20the%20full%20%60ffmpeg%60%20command%3B%20include%3A%20%20%0A%C2%A0%C2%A0%E2%80%A2%20Explicit%20input%28s%29%20and%20output%28s%29%20%0A%C2%A0%C2%A0%E2%80%A2%20All%20necessary%20options%20in%20a%20logical%20order%20%0A%C2%A0%C2%A0%E2%80%A2%20Comments%20%28%23%29%20explaining%20non-obvious%20flags%0A2.%20Double-check%20every%20flag%20against%20typical%20pitfalls%20%28stream-copy%20vs.%20re-encode%2C%20color-matrix%2C%20time-bases%2C%20VFR%2C%20ProRes%20profile%2C%20CRF%20ranges%2C%20hardware%20encoders%29.%0A3.%20Provide%20a%20**single-line%20copy-pasteable%20command**%20plus%20a%20bullet%20list%20of%20key%20decisions.%0A%0A%5BOUTPUT%20FORMAT%5D%0A%60%60%60bash%0A%23%20Command%20%E2%94%80%20ready%20to%20copy%0Affmpeg%20-i%20INPUT%20%E2%80%A6%20-c%3Av%20%E2%80%A6%20-c%3Aa%20%E2%80%A6%20-vf%20%E2%80%A6%20-preset%20%E2%80%A6%20-crf%20%E2%80%A6%20OUTPUT%0A%0A%23%20Explanation%0A%E2%80%A2%20%E2%80%A6%0A%E2%80%A2%20%E2%80%A6%0A%60%60%60%0A%0A%5BUSER%20REQUEST%5D" target="_blank" rel="noopener noreferrer">Ask ChatGPT</a>
:::

- **`output file path`** *[optional]* – The path where the transcoded file should be saved. If the specified directory does not exist, FFmate will **create it automatically**. This can be a full path or a pattern that includes [Wildcards](/docs/wildcards.md) like `${INPUT_FILE_BASENAME}` to dynamically generate structured filenames (e.g., /exports/${INPUT_FILE_BASENAME}_1080p.mp4). If a task also includes its own `outputFile`, that will be used instead of this one. In other words, the task's setting always takes priority over the preset.

- **`priority`** *[optional]* – Sets the task's priority in the processing queue. Higher numbers mean higher priority — for example, a task with priority `100` will be processed before one with `10`. If multiple tasks share the same priority, they’ll generally run in the order they were created (FIFO for that priority level). If a task defines its own `priority`, that will override the preset’s value. If neither is set, a default (usually `0`) is used.

- **`pre-processing`** *[optional]* – Defines a [Pre-Processing Script](/docs/pre-post-prcessing.md) to run before the task starts. Useful for preparing files, validating input, or setting up the environment. If the task includes its own `preProcessing` config, FFmate will use that instead of the preset’s.
    *   **`scriptPath`**: The full path to the script or executable to run.
    *   **`sidecarPath`**: The full path to the JSON file that contains all task data.
     
- **`postProcessing`** *[optional]* – Defines a [Post-Processing Script](/docs/pre-post-prcessing.md) to run after the task completes. Useful for cleanup, moving output files, or triggering follow-up actions.  If the task includes its own `postProcessing` config, FFmate will use that instead of the preset’s.
    *   **`scriptPath`**: The full path to the script or executable to run.
    *   **`sidecarPath`**: The full path to the JSON file that contains all task data. 

### How to Use Presets in Tasks

When creating a new [task](/docs/tasks.md), you can use either an [out-of-the-box preset](/docs/web-ui.md#presets) or one of your custom presets by providing its ID instead of writing a custom command. See [task properties](/docs/tasks.md#task-properties) for details.

**Example: Creating a task with a preset via API**

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Archive Raw Footage",
    "inputFile": "/path/to/raw_footage_01.mxf",
    "preset": "id-of-ProRes-HQ-for-Archive-preset",
    "metadata": {
      "project-id": "project_alpha_123",
      "shot_number": "005"
    }
  }'
```

## Listing Presets

To get a list of all available presets, send a `GET` request to the FFmate API

```sh
curl -X GET 'http://localhost:3000/api/v1/presets?page=0&perPage=10' \
     -H 'accept: application/json'
```

FFmate returns a JSON array containing all configured presets. The `X-Total` response header provides the total number of presets available.

**Query Parameters:**

- **`page`** *[optional]* – Specifies which page of results to retrieve. Default: `0`.
- **`perPage`** *[optional]* – Defines how many tasks should be included in each page. Default: `50`.

💡 Tip: Want to browse existing presets? The [FFmate Web UI](/docs/web-ui.md#presets) lets you view and search through all available presets with ease.

## Getting a Single Preset

To retrieve the details of a specific preset, send a `GET` request to the FFmate API, including the preset's `ID` in the path.

```sh
curl -X GET 'http://localhost:3000/api/v1/presets/a1b2c3d4-e5f6-7890-1234-567890abcdef' \
     -H 'accept: application/json'
```

FFmate returns a JSON object with the full details of the specified preset.

💡 Tip: Want a quick way to check the preset details? You can view preset configurations directly in the [FFmate Web UI](/docs/web-ui.md#presets) without using the API.

## Updating a Preset

You can update an existing preset by sending a `PUT` request to the FFmate API, including the preset's `ID` in the path. The request body should contain the updated properties for the preset. You can find a list of all available properties in the [Presets properties](#presets-properties) section below.

```sh
curl -X PUT http://localhost:3000/api/v1/presets/{presetId} \
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

Fmate returns the complete JSON object of the updated preset. An `preset.updated` event is also fired via [webhooks](/docs/webhooks#preset-events).

💡 Tip: Need to tweak an existing preset? You can update it directly in the [FFmate Web UI](/docs/web-ui.md#presets).

## Deleting a Preset

To delete an existing preset, send a `DELETE` request to the FFmate API, replacing `{presetId}` with the `ID` of the preset you want to remove.

```sh
curl -X DELETE 'http://localhost:3000/api/v1/presets/{presetId}' \
     -H 'accept: application/json'
```

 FFmate responds with a `204` No Content status. The preset will be removed from the system. An `preset.deleted` event is also fired via [webhooks](/docs/webhooks#preset-events)
 
💡 Tip: Presets can be safely deleted from the [FFmate Web UI](/docs/web-ui.md), with helpful context to avoid accidental removals.