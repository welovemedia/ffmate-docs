---
title: "Wildcards in FFmate: Dynamic File Naming and Task Scripting"
description: "FFmate wildcards such as ${INPUT_FILE}, ${DATE_YEAR} or ${SOURCE} insert file names, dates, timestamps and task metadata into paths, commands and scripts."
---

# Wildcards

**Wildcards** are placeholders such as `${INPUT_FILE}` that FFmate replaces with real values when a [task](/docs/tasks.md#task-flow) runs.

Wildcards work in `inputFile`, `outputFile` and `command` of [tasks](/docs/tasks.md#task-properties) and in `outputFile` and `command` of [presets](/docs/presets.md). They also work in `scriptPath` and `sidecarPath` of [pre- and post-processing](/docs/pre-post-prcessing.md).


## Input and Output File Information

### Full File Path

These wildcards return the complete file path, including the directory, filename and extension.

| Wildcard         | Description                          | Example Output          |
|-----------------|----------------------------------|-------------------------|
| `${INPUT_FILE}`  | Full path of the input file      | `/source/input.mp4`     | 
| `${OUTPUT_FILE}` | Full path of the output file     | `/destination/output.mp4`    |
#### Example

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Full file path example",
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
       "inputFile": "/volumes/ffmate/source/input.mp4",
       "outputFile": "/volumes/ffmate/destination/output.mp4"
     }'
```

### Filename Information

These wildcards return the filename from the full path, either with or without the extension.

| Wildcard               | Description                                         | Example Output    |
|------------------------|-----------------------------------------------------|-------------------|
| `${INPUT_FILE_BASE}`   | Filename with extension, without the path          | `input.mp4`      |
| `${OUTPUT_FILE_BASE}`  | Filename with extension, without the path          | `output.mp4`     |
| `${INPUT_FILE_BASENAME}` | Filename without extension                        | `input`          |
| `${OUTPUT_FILE_BASENAME}` | Filename without extension                        | `output`         |


#### Example

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Filename example",
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}.mkv",
       "inputFile": "/volumes/ffmate/videos/original_movie.mp4",
       "outputFile": "/volumes/ffmate/converted/${INPUT_FILE_BASENAME}"
     }'
```

#### Output Path

```sh
/volumes/ffmate/converted/original_movie.mkv
```

---

### File Extensions and Directory Path

These wildcards return the file extension and the directory path.

| Wildcard                  | Description                               | Example Output    |
|---------------------------|-------------------------------------------|-------------------|
| `${INPUT_FILE_EXTENSION}` | File extension of the input file         | `.mp4`           |
| `${OUTPUT_FILE_EXTENSION}` | File extension of the output file        | `.mp4`           |
| `${INPUT_FILE_DIR}`       | Directory path of the input file         | `/source`        |
| `${OUTPUT_FILE_DIR}`      | Directory path of the output file        | `/destination`        |
#### Example

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Extension and directory example",
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
       "inputFile": "/volumes/ffmate/source/video.mp4",
       "outputFile": "/volumes/ffmate/destination/${INPUT_FILE_BASENAME}_converted${INPUT_FILE_EXTENSION}"
     }'
```

#### Output Path

```sh
/volumes/ffmate/destination/video_converted.mp4
```

## Date & Time

These wildcards return the current date and time values when the task runs.

| Wildcard                   | Description                                | Example Output   |
|----------------------------|--------------------------------------------|------------------|
| `${DATE_YEAR}`             | Full year (4 digits)                      | `2024`           |
| `${DATE_SHORTYEAR}`        | Short year (last 2 digits)                | `24`             |
| `${DATE_MONTH}`            | Month number (01-12)                      | `01`             |
| `${DATE_DAY}`              | Day of the month (01-31)                   | `15`             |
| `${DATE_WEEK}`             | ISO week number (1-53)                    | `3`              |
| `${TIME_HOUR}`             | Hour (24-hour format, 00-23)              | `14`             |
| `${TIME_MINUTE}`           | Minute (00-59)                            | `05`             |
| `${TIME_SECOND}`           | Second (00-59)                            | `32`             |

### Example

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Date and time example",
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
       "inputFile": "/volumes/ffmate/source/video.mp4",
       "outputFile": "/volumes/ffmate/destination/${DATE_YEAR}/${DATE_MONTH}/${DATE_DAY}/video_${TIME_HOUR}-${TIME_MINUTE}-${TIME_SECOND}.mp4",
       "priority": 2
     }'
```

### Output Path

```sh
/volumes/ffmate/destination/2024/02/15/video_14-30-45.mp4
```

## Timestamps

These wildcards return Unix timestamps based on the current system time.

| Wildcard                      | Description                                | Example Output          |
|--------------------------------|--------------------------------------------|-------------------------|
| `${TIMESTAMP_SECONDS}`        | Unix timestamp in seconds                 | `1705318712`           |
| `${TIMESTAMP_MILLISECONDS}`   | Unix timestamp with milliseconds precision | `1705318712123`         |
| `${TIMESTAMP_MICROSECONDS}`   | Unix timestamp with microseconds precision | `1705318712123456`      |
| `${TIMESTAMP_NANOSECONDS}`    | Unix timestamp with nanoseconds precision  | `1705318712123456789`   |


### Example

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Timestamp example",
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
       "inputFile": "/volumes/ffmate/source/video.mp4",
       "outputFile": "/volumes/ffmate/destination/video_${TIMESTAMP_SECONDS}.mp4"
     }'
```

### Output Path

```sh
/volumes/ffmate/destination/video_1705318712.mp4
```

## Task Metadata

This wildcard inserts a value from the task's `metadata` object. It works in every field that supports wildcards, for example `outputFile` or `scriptPath`.

The key can come from the `metadata` object sent when the task was created. FFmate also adds keys of its own, for example when a watchfolder creates the task.

| Wildcard Pattern            | Description                                     |
|-----------------------------|-------------------------------------------------|
| `${METADATA_<json-path>}`   | Inserts the value from the `metadata` object at the given JSON path. If the path doesn't exist, it's replaced with nothing. |

---

### Example: Recreating Watchfolder Structure

When a task is created from a watchfolder, FFmate adds metadata about the file that triggered the task.

One of these fields is `relativeDir`, the folder of the file relative to the watchfolder.

The task for a file dropped into `/volumes/ffmate/wf/parent/subfolder1/18moo.mov` gets this `metadata` object:


```json
{
  "metadata": {
    "ffmate": {
      "watchfolder": {
        "path": "/volumes/ffmate/wf",
        "relativeDir": "parent/subfolder1",
        "relativePath": "parent/subfolder1/18moo.mov",
        "uuid": "06bbbe21-8003-41b3-94f4-62508486c482"
      }
    }
  }
}
```

`${METADATA_ffmate.watchfolder.relativeDir}` inserts `relativeDir`, so the output recreates the folder structure of the watchfolder:

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Watchfolder structure example",
    "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
    "inputFile": "/volumes/ffmate/wf/parent/subfolder1/18moo.mov",
    "outputFile": "/volumes/ffmate/processed/${METADATA_ffmate.watchfolder.relativeDir}/${INPUT_FILE_BASENAME}.mp4"
  }
'
```

### Output Path

```sh
/volumes/ffmate/processed/parent/subfolder1/18moo.mp4
```

## Task Source

This wildcard returns the source of the task: either `api` or `watchfolder`.

| Wildcard    | Description                                                | Example Output        |
|-------------|------------------------------------------------------------|------------------------|
| `${SOURCE}` | Returns the source that triggered the task                             | `api` or `watchfolder`  |

---

### Example

Pass `${SOURCE}` to a pre-processing script to apply different behavior depending on the task's origin. Wildcards are not environment variables, so the value has to be passed as an argument:

```json
{
  "preProcessing": {
    "scriptPath": "/opt/ffmate/scripts/prepare.sh ${SOURCE}"
  }
}
```

The script then reads it as its first argument:

```bash
#!/usr/bin/env bash

# Pre-processing script example
# Adjusts logic based on the source of the task

case "$1" in
  api)
    echo "Task originated from API. Applying API-specific logic."
    # Add API-specific pre-processing commands here
    ;;
  watchfolder)
    echo "Task originated from Watchfolder. Applying Watchfolder-specific logic."
    # Add Watchfolder-specific pre-processing commands here
    ;;
  *)
    echo "Unknown task source. Applying default logic."
    # Add fallback logic here
    ;;
esac
```

## FFmpeg Path

This wildcard returns the path to the `FFmpeg` executable that FFmate uses, set with the [`--ffmpeg`](/docs/flags.md#server-command-flags) flag. For example, a two-pass encode chains two `ffmpeg` calls in one command.


| Wildcard    | Description                                  | Example Output      |
|-------------|----------------------------------------------|---------------------|
| `${FFMPEG}` | Returns the full path to the FFmpeg executable | `/usr/bin/ffmpeg`   |

### Example: Two-Pass VP9 Encoding

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Two-pass VP9 encode",
       "command": "-i ${INPUT_FILE} -c:v libvpx-vp9 -b:v 2M -pass 1 -an -f null - && ${FFMPEG} -i ${INPUT_FILE} -c:v libvpx-vp9 -b:v 2M -pass 2 -c:a libopus ${OUTPUT_FILE}",
       "inputFile": "/volumes/ffmate/source/video.mp4",
       "outputFile": "/volumes/ffmate/destination/video.webm"
     }'
```
This command performs a two-pass VP9 encode. FFmate prepends the configured `ffmpeg` path to the beginning of the `command` for the first pass. When chaining commands with `&&`, start every following command with the `${FFMPEG}` wildcard so the same executable is used.

## Unique Identifier

This wildcard generates random unique identifiers.

| Wildcard       | Description                        | Example Output                                  |
|---------------|------------------------------------|------------------------------------------------|
| `${UUID}`     | Randomly generated UUID (v4)      | `550e8400-e29b-41d4-a716-446655440000`        |


### Example

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "name": "UUID example",
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
       "inputFile": "/volumes/ffmate/source/video.mp4",
       "outputFile": "/volumes/ffmate/processed/${UUID}_video.mp4"
     }'
```

### Output Path

```sh
/volumes/ffmate/processed/550e8400-e29b-41d4-a716-446655440000_video.mp4
```
## System Information

These wildcards return the operating system name and CPU architecture.

| Wildcard       | Description                        | Example Output  |
|---------------|------------------------------------|----------------|
| `${OS_NAME}`  | Operating system name             | `linux`        |
| `${OS_ARCH}`  | CPU architecture                  | `amd64`        |

### Example

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "name": "System information example",
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
       "inputFile": "/volumes/ffmate/source/video.mp4",
       "outputFile": "/volumes/ffmate/processed/${OS_NAME}/${OS_ARCH}/video.mp4"
     }'
```

### Output Path

```sh
/volumes/ffmate/processed/linux/amd64/video.mp4
```