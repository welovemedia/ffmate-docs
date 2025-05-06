# Presets

Presets in `ffmate` are powerful templates that allow you to pre-configure common `ffmpeg` operations. They help you save time, ensure consistency, and simplify the process of creating new transcoding tasks.

Think of a preset as a named, reusable recipe for a specific type of video or audio conversion.

### What Can You Define in a Preset?

When you create a preset, you can specify several key parameters that will be automatically applied to tasks created using that preset:

1.  **Name (`name`):**
    *   A unique, human-readable name for your preset (e.g., "Convert to MP4 1080p", "Extract Audio as MP3"). This helps you easily identify and select it.

2.  **Description (`description`):**
    *   (Optional) A more detailed explanation of what the preset does or any specific notes about its usage.

3.  **FFmpeg Command (`command`):**
    *   The core `ffmpeg` command string you want to execute. This is where you define codecs, bitrates, resolutions, filters, etc.
    *   You can use `ffmate`'s [Wildcards](#wildcards) (like `${INPUT_FILE}` and `${OUTPUT_FILE}`) within the command. `ffmate` will replace these with the actual file paths when a task is processed.
    *   **Important:** When a task uses a preset, the `command` from the preset will *always* be used, overriding any command specified directly in the task creation request.

4.  **Output File Pattern (`outputFile`):**
    *   A pattern for generating the output filename. This also supports [Wildcards](#wildcards) to create dynamic and organized output filenames (e.g., `${INPUT_FILE_BASENAME}_1080p.mp4`).
    *   If you specify an `outputFile` directly when creating a task, that will take precedence over the preset's `outputFile`. If you don't, the preset's pattern will be used.

5.  **Priority (`priority`):**
    *   A numerical value indicating the priority of tasks created with this preset in the processing queue.
    *   **Higher numbers mean higher priority.** For example, a task with priority `100` will be processed before a task with priority `10`.
    *   If multiple tasks have the same priority, they are generally processed in the order they were created (First-In, First-Out for that priority level).
    *   If you specify a `priority` directly when creating a task, that will take precedence. Otherwise, the preset's priority is used. If neither is set, a default priority (likely 0) will be used.

6.  **Pre-Processing (`preProcessing`):**
    *   (Optional) Configure a script to run *before* the main `ffmpeg` command.
    *   **`scriptPath`**: The command or path to the script to execute. Wildcards can be used here.
        *   *Example*: `python /opt/scripts/validate_input.py --input ${INPUT_FILE} --metadata_out ${INPUT_FILE_BASENAME}.json`
    *   **`sidecarPath`**: (Optional) Path where `ffmate` will write a JSON file containing the task's details (metadata, input/output paths) *before* running the pre-processing script. Your script can then read this file. Wildcards can be used here.
        *   *Example*: `${INPUT_FILE_DIR}/${INPUT_FILE_BASENAME}_ffmate_task.json`
        *   *Use Case*: Your `validate_input.py` script could read this sidecar file to get the original input filename, user-provided metadata, and then perform checks like ensuring the file exists or meets certain duration criteria. If validation fails, the script can exit with an error code, which will cause `ffmate` to mark the pre-processing step (and thus the task) as failed.
    *   If you define `preProcessing` directly in a task creation request, it will be used. Otherwise, the preset's `preProcessing` configuration (if any) will be applied.

7.  **Post-Processing (`postProcessing`):**
    *   (Optional) Configure a script to run *after* the `ffmpeg` command completes successfully.
    *   **`scriptPath`**: The command or path to the script to execute. Wildcards can be used here.
        *   *Example*: `bash /opt/scripts/archive_and_notify.sh --source ${OUTPUT_FILE} --original ${INPUT_FILE}`
    *   **`sidecarPath`**: (Optional) Path where `ffmate` will write a JSON file containing the task's details (including the final output path from `ffmpeg`) *before* running the post-processing script. Wildcards can be used here.
        *   *Example*: `${OUTPUT_FILE_DIR}/${OUTPUT_FILE_BASENAME}_ffmate_task_complete.json`
        *   *Use Case*: Your `archive_and_notify.sh` script could read the sidecar to get the final output filename. It might then move `${OUTPUT_FILE}` to a long-term archive, send an email notification with the file details, and optionally delete `${INPUT_FILE}` if it's no longer needed.
    *   If you define `postProcessing` directly in a task creation request, it will be used. Otherwise, the preset's `postProcessing` configuration (if any) will be applied.

### How to Manage Presets

You can manage presets through `ffmate`'s:

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