---
title: "FFmate Pre/Post-Processing: Custom Scripts, Sidecars & Workflow Automation for FFmpeg"
description: "Learn to use FFmate's pre & post-processing for FFmpeg. Run custom scripts, use JSON sidecars for task context, manage exit codes, and automate your media workflows"
---

# Pre and Post-Processing

**Pre- and post-processing** in FFmate allow you to extend transcoding tasks by running custom scripts *before* the `ffmpeg` command starts and *after* it successfully completes. This powerful feature enables you to automate a wide range of activities, from input validation and file preparation to notifications, archiving, and integration with other systems.

You can define pre and post-processing steps either directly within a task creation request or as part of a [Preset](/docs/presets.md). If both define pre-processing, the task's settings replace the preset's settings completely. The same applies to post-processing.

## Configuration Parameters

For both pre-processing and post-processing, you can configure the following:

- **`scriptPath`** *[optional]* – The command or script FFmate runs. Pre-processing runs it before the `ffmpeg` command, post-processing after it. It supports [wildcards](/docs/wildcards.md) to pass dynamic values like filenames, UUIDs, or dates as arguments to your script.
    
*Example*: `python3 /opt/ffmate_scripts/prepare_audio.py --input ${INPUT_FILE} --normalize-level -3dBFS`

:::: details **Note:** {open}
FFmate will attempt to run the `scriptPath` as a system command. Make sure the **script is executable** and the path is correct. It runs with the same environment variables, permissions and working directory as the FFmate process.

::: danger Anyone with API access can run commands
`scriptPath` can be any command, not only the path to a script, for example `bash -c "…"`. Anyone who can create a task, preset or watchfolder can therefore run commands on the computer FFmate runs on. By default, FFmate listens on `0.0.0.0` without a password, so that is anyone on the network.

Restrict who can reach FFmate with [`--host 127.0.0.1`](/docs/flags.md#server-command-flags) or [`--basic-auth`](/docs/flags.md#server-command-flags) and a firewall, and run FFmate as a user without admin or `root` rights.
:::

::: info No shell
`scriptPath` is run directly, not through a shell. Shell features such as pipes (`|`), `&&` or `$VARIABLES` don't work there. To use them, put them inside your script and call the script.
:::

#### How Exit Codes Work

When a script finishes running, it returns an **exit code** — a number that tells `ffmate` whether it succeeded or failed.

- An exit code of `0` means the script completed successfully.
- A non-zero exit code means the script encountered an error.
  - For **pre-processing**, if the script fails, the `ffmpeg` command will *not* run, and the task will be marked as **failed**.
  - For **post-processing**, the `ffmpeg` command will already have completed successfully, but the task will still be marked as **failed** due to the post-processing error.

FFmate saves the script's error output and exit code in the task's `error` field, for example `PreProcessing failed: disk full (exit code: 3)`.
::::

- **`sidecarPath`** *[optional]* – Specifies the path where FFmate should write a JSON "sidecar" file containing detailed information about the current task. This path supports [wildcards](/docs/wildcards.md). Your script can then read this file to get full context and make decisions accordingly. If FFmate can't write the sidecar, the script doesn't run and the task fails.

- **`importSidecar`** *[optional, pre-processing only]* – If `true`, FFmate reads the sidecar back in after the pre-processing script finishes. Default: `false`. See [Importing a Task’s Sidecar](/docs/pre-post-prcessing.md#importing-a-task-s-sidecar).

  - **What’s in the sidecar file?**  
    The sidecar JSON contains a snapshot of the task at the time the script runs. Empty properties are left out.

    - For **pre-processing**, this includes the raw input and output paths and command, task metadata, UUID, name, priority, and more. Wildcards in these aren't resolved yet.

  #### Example:

  ```json
  {
    "uuid": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "name": "My Epic Movie.mov",
    "command": {
      "raw": "-i ${INPUT_FILE} -c:v libx264 -preset fast ${OUTPUT_FILE}"
    },
    "inputFile": {
      "raw": "/watch/My Epic Movie.mov"
    },
    "outputFile": {
      "raw": "/output/${INPUT_FILE_BASENAME}.mp4"
    },
    "metadata": {
      "show": "My Awesome Show",
      "season": 2,
      "episode": 5
    },
    "status": "PRE_PROCESSING",
    "progress": 0,
    "remaining": 0,
    "priority": 5,
    "source": "watchfolder",
    "retries": 0,
    "retried": 0,
    "preProcessing": {
      "scriptPath": {
        "raw": "/scripts/preprocess.sh ${INPUT_FILE}"
      },
      "sidecarPath": {
        "raw": "/temp/${INPUT_FILE_BASENAME}.json",
        "resolved": "/temp/My Epic Movie.json"
      },
      "importSidecar": true,
      "startedAt": 1735689600000
    },
    "startedAt": 1735689600000,
    "createdAt": 1735689590000,
    "updatedAt": 1735689600000
  }
  ```

    - For **post-processing**, it also includes the resolved command, input file and output file. The task status at this point is `POST_PROCESSING`. It changes to `DONE_SUCCESSFUL` once the post-processing script completes without errors.


### Importing a Task’s Sidecar

When the property `importSidecar` is set to **true**, FFmate will **re-import the sidecar JSON after your pre-processing script finishes**.

The flow is simple:

1. When the task starts, FFmate writes the task’s [sidecar JSON](#example) to the path you configured in `preProcessing.sidecarPath`, then runs your pre-processing script.  
2. Inside your script, you can **read and modify the sidecar JSON** programmatically.  
3. When the script exits, FFmate re-imports the updated sidecar and continues processing the task with those updates.  

This way, the pre-processing script can change how FFmate processes the task. For example, it can:  

- run tools like `ffprobe` or `MediaInfo` and inject the results into the `metadata` object.  
- adjust the [task’s](/docs/tasks.md#task-properties) command, input file or output file based on resolution, bitrate, or aspect ratio. Change the `raw` value; FFmate resolves the wildcards after the import.  

> ⚠️ **Important:**  
> Only change the **values of existing properties**, and keep each value's type. For example, `priority` must stay a number.  
> A value with the wrong type makes the FFmate task fail.

## Workflow

This section outlines how FFmate runs a task, showing where pre- and post-processing scripts fit, how wildcards are resolved, where the sidecar import happens, and how errors are handled.

1. **Task Queued** — A new task is created (directly or via a watchfolder).
2. **Pre-Processing (if defined)**
   - FFmate resolves wildcards in `sidecarPath` (if defined) and writes the task sidecar JSON. If the sidecar can't be written, the task status is set to `DONE_ERROR` and processing stops.
   - FFmate resolves wildcards in `scriptPath`.
   - FFmate executes the pre-processing script.
   - If the script fails (non-zero exit code), the task status is set to `DONE_ERROR` and processing stops. The script error is saved in the task's `error` field.
   - **If `importSidecar` is true:** FFmate re-imports the updated sidecar JSON after the script finishes. If re-import fails, the task is set to `DONE_ERROR`.
3. **FFmpeg Processing**
   - If pre-processing was successful (or not defined), FFmate resolves wildcards for the main command, input file, and output file.
   - FFmate creates the output file's folder if it doesn't exist.
   - FFmate executes the FFmpeg command.
   - If FFmpeg fails, the task status is set to `DONE_ERROR` and processing stops. Post-processing will not run.
4. **Post-Processing (if defined)**
   - Assuming FFmpeg completed successfully, FFmate resolves wildcards in `sidecarPath` (if defined) and writes the task sidecar JSON (now including final output paths).
   - FFmate resolves wildcards in `scriptPath`.
   - FFmate executes the post-processing script.
   - If the script fails (non-zero exit code), the task status is set to `DONE_ERROR`. The script error is saved in the task's `error` field.
5. **Task Completion**
   - If post-processing was successful (or not defined), the task status is set to `DONE_SUCCESSFUL`.

If a task is canceled while a pre- or post-processing script is running, FFmate stops the script and sets the task status to `DONE_CANCELED`.

```mermaid
flowchart TD
    A[Task queued] --> B{Pre-processing defined?}
    B -- No --> E[Resolve command and paths] --> F[Run FFmpeg]
    B -- Yes --> C[Resolve pre sidecarPath and write sidecar]
    C --> D[Resolve pre scriptPath]
    D --> P[Run pre-processing script]
    P --> POK{Script exit code 0?}
    POK -- No --> X[Done error]
    POK -- Yes --> I{importSidecar true?}
    I -- Yes --> R[Re-import sidecar JSON]
    I -- No --> E
    R --> E

    F --> FOK{FFmpeg success?}
    FOK -- No --> X
    FOK -- Yes --> G{Post-processing defined?}
    G -- No --> S[Done successful]
    G -- Yes --> H[Resolve post sidecarPath and write sidecar]
    H --> J[Resolve post scriptPath]
    J --> Q[Run post-processing script]
    Q --> QOK{Script exit code 0?}
    QOK -- No --> X
    QOK -- Yes --> S

    classDef success fill:#bbf7d0,stroke:#22c55e,stroke-width:2px,color:#000
    classDef error fill:#fecaca,stroke:#ef4444,stroke-width:2px,color:#000
    classDef step fill:#bfdbfe,stroke:#3b82f6,stroke-width:2px,color:#000

    class A,B,C,D,E,F,G,H,J,P,Q,R step
    class S success
    class X error
```


##  Examples

#### Post-Processing – Upload to Cloud Storage and Notify

Once transcoding completes successfully, upload the output file to an S3 bucket and send a Slack notification to keep your team informed.

**Example:**

  This example shows how post-processing can be configured to run a custom script after a successful `ffmpeg` transcode, while also generating a sidecar JSON file containing task details.

  ```json
  {
    "postProcessing": {
      "scriptPath": "/opt/ffmate_scripts/upload_and_notify.sh ${OUTPUT_FILE_DIR}/${OUTPUT_FILE_BASENAME}.post_task_info.json",
      "sidecarPath": "${OUTPUT_FILE_DIR}/${OUTPUT_FILE_BASENAME}.post_task_info.json"
    }
    // ... other preset/task details
  }
  ```

*   **`upload_and_notify.sh` (Conceptual):**

    ```bash
    #!/bin/bash
    set -e # Exit immediately if a command exits with a non-zero status.

    # FFmate passes the sidecar path as the first argument (see scriptPath above)
    SIDECAR_FILE="$1"

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
    if ! aws s3 cp "${OUTPUT_FILE}" "${S3_BUCKET}/"; then
        echo "Error: S3 upload failed for ${OUTPUT_FILE}." >&2
        exit 2
    fi
    echo "Upload successful."

    # Send Slack notification
    MESSAGE_TEXT="Task Complete: '${TASK_NAME}' (UUID: ${TASK_UUID}). Output: ${S3_BUCKET}/$(basename "${OUTPUT_FILE}")"
    PAYLOAD="{\"text\": \"${MESSAGE_TEXT}\"}"

    if ! curl -X POST -H 'Content-type: application/json' --data "${PAYLOAD}" "${SLACK_WEBHOOK_URL}"; then
        echo "Warning: Slack notification failed, but file was uploaded." >&2
        # Decide if this should be a hard fail (exit 3) or just a warning
    fi

    echo "Post-processing complete for ${TASK_UUID}."
    exit 0 # Success
    ```