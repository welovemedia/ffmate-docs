
# Pre and Post-Processing

`FFmate` allows you to extend the functionality of your transcoding tasks by executing custom scripts *before* the `ffmpeg` command starts (pre-processing) and *after* it successfully completes (post-processing). This powerful feature enables you to automate a wide range of activities, from input validation and file preparation to notifications, archiving, and integration with other systems.

You can define pre and post-processing steps either directly within a task creation request or as part of a [Preset](#presets). If defined in both, the task-specific definition will take precedence.

### Configuration Parameters

For both pre-processing and post-processing, you can configure the following:

1.  **`scriptPath`**:
    *   **Purpose**: Defines the command or the full path to the script you want `ffmate` to execute.
    *   **Wildcards**: This field fully supports `ffmate`'s [Wildcards](#wildcards). This means you can dynamically pass filenames, dates, UUIDs, and other task-related information as arguments to your script.
    *   **Execution**: `ffmate` will attempt to execute this string as a command. Ensure your script is executable and its path is correct. The script will run with the same environment and permissions as the `ffmate` process itself.
    *   **Exit Codes**:
        *   A **zero exit code** (0) from your script indicates success.
        *   A **non-zero exit code** indicates an error.
            *   If a *pre-processing* script exits with a non-zero code, the main `ffmpeg` task will **not** run, and the entire task will be marked as failed.
            *   If a *post-processing* script exits with a non-zero code, the main `ffmpeg` task has already completed successfully, but the overall `ffmate` task will be marked as failed due to the post-processing error.
    *   *Example*: `python3 /opt/ffmate_scripts/prepare_audio.py --input ${INPUT_FILE} --normalize-level -3dBFS`

2.  **`sidecarPath`**:
    *   **Purpose**: (Optional) Specifies a path where `ffmate` will write a JSON file containing detailed information about the current task. Your script can then read this "sidecar" file to get context.
    *   **Wildcards**: This field also supports [Wildcards](#wildcards), allowing you to name and place the sidecar file dynamically.
    *   **Content**: The sidecar JSON file contains a snapshot of the `ffmate` task object at that point in the workflow.
        *   For **pre-processing**, this includes the raw and (potentially partially) resolved input/output paths, any metadata you provided with the task, task UUID, name, priority, etc.
        *   For **post-processing**, this includes all the above, plus the *final resolved* output path from `ffmpeg`, and the task's status will typically be `RUNNING` (just before it's marked `DONE_SUCCESSFUL` if post-processing also succeeds).
    *   *Example*: `${INPUT_FILE_DIR}/${INPUT_FILE_BASENAME}.task_info.json`

### Workflow

1.  **Task Queued:** A new task is created (either directly or via a watchfolder).
2.  **Pre-Processing (if defined):**
    *   `ffmate` resolves wildcards in `preProcessing.sidecarPath` (if defined) and writes the task data JSON file.
    *   `ffmate` resolves wildcards in `preProcessing.scriptPath`.
    *   `ffmate` executes the `scriptPath` command.
    *   If the script fails (non-zero exit code), the task status is set to `DONE_ERROR`, and the process stops here. The error from the script is logged.
3.  **FFmpeg Processing:**
    *   If pre-processing was successful (or not defined), `ffmate` resolves wildcards for the main `ffmpeg` command, input, and output files.
    *   The `ffmpeg` command is executed.
    *   If `ffmpeg` fails, the task status is set to `DONE_ERROR`, and the process stops here. Post-processing will not run.
4.  **Post-Processing (if defined):**
    *   Assuming `ffmpeg` completed successfully, `ffmate` resolves wildcards in `postProcessing.sidecarPath` (if defined) and writes/updates the task data JSON file (now including the final `ffmpeg` output path).
    *   `ffmate` resolves wildcards in `postProcessing.scriptPath`.
    *   `ffmate` executes the `scriptPath` command.
    *   If the script fails (non-zero exit code), the task status is set to `DONE_ERROR`. The error from the script is logged.
5.  **Task Completion:**
    *   If post-processing was successful (or not defined), the task status is set to `DONE_SUCCESSFUL`.

### Practical Examples

#### Example 1: Pre-Processing - Input Validation and Metadata Extraction

*   **Goal**: Before transcoding, ensure the input video is not too short and extract its duration into the task's metadata for potential use by `ffmpeg` or post-processing.
*   **Preset/Task Configuration:**

    ```json
    {
      "preProcessing": {
        "scriptPath": "python /opt/ffmate_scripts/validate_and_get_duration.py --sidecar ${INPUT_FILE_DIR}/${INPUT_FILE_BASENAME}.pre_task_info.json",
        "sidecarPath": "${INPUT_FILE_DIR}/${INPUT_FILE_BASENAME}.pre_task_info.json"
      }
      // ... other preset/task details
    }
    ```

#### Example 2: Post-Processing - Upload to Cloud Storage and Notify

*   **Goal**: After a successful transcode, upload the output file to an S3 bucket and send a Slack notification.
*   **Preset/Task Configuration:**

    ```json
    {
      "postProcessing": {
        "scriptPath": "/opt/ffmate_scripts/upload_and_notify.sh",
        "sidecarPath": "${OUTPUT_FILE_DIR}/${OUTPUT_FILE_BASENAME}.post_task_info.json"
      }
      // ... other preset/task details
    }
    ```
*   **`upload_and_notify.sh` (Conceptual):**

    ```bash
    #!/bin/bash
    set -e # Exit immediately if a command exits with a non-zero status.

    SIDECAR_FILE=""

    # Basic argument parsing (robust scripts would use getopts)
    if [ "$1" == "--sidecar" ] && [ -n "$2" ]; then
        SIDECAR_FILE="$2"
    else
        # If ffmate passes sidecar path as the first arg directly
        SIDECAR_FILE="$1" 
    fi


    if [ -z "$SIDECAR_FILE" ] || [ ! -f "$SIDECAR_FILE" ]; then
        echo "Error: Sidecar file path not provided or file not found." >&2
        exit 1
    fi

    # Read data from sidecar using 'jq' (JSON processor)
    OUTPUT_FILE=$(jq -r '.outputFile.resolved' "$SIDECAR_FILE")
    TASK_NAME=$(jq -r '.name // "Untitled Task"' "$SIDECAR_FILE")
    TASK_UUID=$(jq -r '.uuid' "$SIDECAR_FILE")

    if [ -z "$OUTPUT_FILE" ]; then
        echo "Error: Could not extract output file from sidecar." >&2
        exit 1
    fi

    S3_BUCKET="s3://my-ffmate-outputs"
    SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"

    echo "Uploading ${OUTPUT_FILE} to ${S3_BUCKET}..."
    aws s3 cp "${OUTPUT_FILE}" "${S3_BUCKET}/"
    if [ $? -ne 0 ]; then
        echo "Error: S3 upload failed for ${OUTPUT_FILE}." >&2
        exit 2
    fi
    echo "Upload successful."

    # Send Slack notification
    MESSAGE_TEXT="Task Complete: '${TASK_NAME}' (UUID: ${TASK_UUID}). Output: ${S3_BUCKET}/$(basename "${OUTPUT_FILE}")"
    PAYLOAD="{\"text\": \"${MESSAGE_TEXT}\"}"

    curl -X POST -H 'Content-type: application/json' --data "${PAYLOAD}" "${SLACK_WEBHOOK_URL}"
    if [ $? -ne 0 ]; then
        echo "Warning: Slack notification failed, but file was uploaded." >&2
        # Decide if this should be a hard fail (exit 3) or just a warning
    fi

    echo "Post-processing complete for ${TASK_UUID}."
    exit 0 # Success
    ```