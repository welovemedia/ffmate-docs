# Presets

Presets in FFmate are reusable templates that simplify how you define and run FFmpeg tasks.
They let you preconfigure commands, output patterns, priorities, and optional pre/post-processing scripts.

Think of a preset as a named, shareable "recipe" for media processing. Presets help streamline task creation, reduce errors, and ensure that jobs follow a standardized workflow every time they're run.

## Presets properties

When creating a preset, you define a set of parameters that will be automatically applied to any task that uses it. 

-   **`name`** *[optional]* - A short, descriptive name help to you quickly identify the preset (e.g., "Convert to MP4 1080p", "Extract Audio as MP3").

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

### How to Manage Presets

You can manage presets through FFmate's:

*   **REST API:**
    *   `POST /api/v1/presets`: Create a new preset.
    *   `GET /api/v1/presets`: List all existing presets.
    *   `DELETE /api/v1/presets/{uuid}`: Delete a preset by its unique ID.
*   **Web UI:** The `ffmate` web interface provides a user-friendly way to create, view, and delete presets.

**Example: Creating a Preset via API with Contextualized Post-Processing**

```json
// POST /api/v1/presets
{
  "name": "ProRes HQ for Archive",
  "description": "Converts input to ProRes HQ and moves it to the archive.",
  "command": "ffmpeg -i ${INPUT_FILE} -c:v prores_ks -profile:v 3 -vendor apl0 -bits_per_mb 8000 -pix_fmt yuv422p10le -c:a pcm_s16le ${OUTPUT_FILE}",
  "outputFile": "${INPUT_FILE_BASENAME}_prores_hq.mov",
  "priority": 50,
  "postProcessing": {
    "scriptPath": "/usr/local/bin/move_to_archive.sh --file ${OUTPUT_FILE} --project-id some_project_id_from_metadata",
    "sidecarPath": "${OUTPUT_FILE_DIR}/${OUTPUT_FILE_BASENAME}.json"
  }
}
```
*(In this example, `move_to_archive.sh` would be a custom script. The `project-id` could be something passed in the task's `metadata` field and then potentially extracted from the sidecar JSON by the script, though the example script path directly includes a placeholder for simplicity here. A more robust script would parse the sidecar for such dynamic values.)*

### How to Use Presets When Creating Tasks

When you create a new task, you can simply reference the `uuid` of an existing preset.

**Example: Creating a Task using a Preset via API**

```json
// POST /api/v1/tasks
{
  "name": "Archive Raw Footage",
  "inputFile": "/path/to/raw_footage_01.mxf",
  "preset": "uuid-of-ProRes-HQ-for-Archive-preset", // Replace with actual preset UUID
  "metadata": {
    "project-id": "project_alpha_123",
    "shot_number": "005"
  }
}
```

`ffmate` will then automatically:
1.  Use the `command` from the "ProRes HQ for Archive" preset.
2.  Generate the output path using the preset's `outputFile` pattern.
3.  Apply the preset's `priority` (50).
4.  After successful `ffmpeg` processing, it will create the sidecar file (e.g., `/path/to/raw_footage_01_prores_hq.json` containing task details) and then execute the `postProcessing` script (`/usr/local/bin/move_to_archive.sh ...`).