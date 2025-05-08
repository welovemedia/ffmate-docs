# Wildcards

FFmate supports wildcards to help you generate file and directory names dynamically—no manual renaming required.  
Instead of hardcoding output paths for each task, you can use smart placeholders that FFmate automatically replaces with actual values during processing.

Wildcards offer a flexible and efficient way to automate naming patterns, making it easy to organize outputs based on things like input file names, file extension, timestamps, and more.


For example, you can include the **date, time, input file name, or a UUID** in your output file names. This helps keep your files and folders **organized, consistent, and easy to track**, without extra effort.

## Input & Output File Information

### Full File Path:

These wildcards return the **complete file path**, including the directory, filename, and extension.

| Wildcard         | Description                          | Example Output          |
|-----------------|----------------------------------|-------------------------|
| `${INPUT_FILE}`  | Full path of the input file      | `/source/input.mp4`     |
| `${OUTPUT_FILE}` | Full path of the output file     | `/destination/output.mp4`    |

#### Example:

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
       "inputFile": "/volumes/ffmate/source/input.mp4",
       "outputFile": "/volumes/ffmate/destination/output.mp4"
     }'
```

### Filename Information:

These wildcards return the **filename** from the full path, either with or without the extension.

| Wildcard               | Description                                         | Example Output    |
|------------------------|-----------------------------------------------------|-------------------|
| `${INPUT_FILE_BASE}`   | Filename with extension (without the path)         | `input.mp4`      |
| `${OUTPUT_FILE_BASE}`  | Filename with extension (without the path)         | `output.mp4`     |
| `${INPUT_FILE_BASENAME}` | Filename without extension                        | `input`          |
| `${OUTPUT_FILE_BASENAME}` | Filename without extension                        | `output`         |


#### Example:

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}.mkv",
       "inputFile": "/volumes/ffmate/videos/original_movie.mp4",
       "outputFile": "/volumes/ffmate/converted/${INPUT_FILE_BASENAME}"
     }'
```

#### Output Path:

```sh
/volumes/ffmate/converted/input.mkv
```

---

### File Extensions and Directory Path:

These wildcards return **the file extension** and the **directory path**.

| Wildcard                  | Description                               | Example Output    |
|---------------------------|-------------------------------------------|-------------------|
| `${INPUT_FILE_EXTENSION}` | File extension of the input file         | `.mp4`           |
| `${OUTPUT_FILE_EXTENSION}` | File extension of the output file        | `.mp4`           |
| `${INPUT_FILE_DIR}`       | Directory path of the input file         | `/source`        |
| `${OUTPUT_FILE_DIR}`      | Directory path of the output file        | `/destination`        |

#### Example:

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
       "inputFile": "/volumes/ffmate/source/video.mp4",
       "outputFile": "/volumes/ffmate/destination/${INPUT_FILE_BASENAME}_converted${INPUT_FILE_EXTENSION}"
     }'
```

#### Output Path:

```sh
/volumes/ffmate/destination/input_converted.mp4
```

## Date & Time Wildcards

These wildcards insert **dynamic timestamps** into your output paths, making it easy to organize processed files based on date and time.

| Wildcard                   | Description                                | Example Output   |
|----------------------------|--------------------------------------------|------------------|
| `${DATE_YEAR}`             | Full year (4 digits)                      | `2024`           |
| `${DATE_SHORTYEAR}`        | Short year (last 2 digits)                | `24`             |
| `${DATE_MONTH}`            | Month number (01-12)                      | `01`             |
| `${DATE_DAY}`              | Day of the month (01-31)                   | `15`             |
| `${DATE_WEEK}`             | ISO week number (01-52)                   | `03`             |
| `${TIME_HOUR}`             | Hour (24-hour format, 00-23)              | `14`             |
| `${TIME_MINUTE}`           | Minute (00-59)                            | `05`             |
| `${TIME_SECOND}`           | Second (00-59)                            | `32`             |

#### Example:

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
       "inputFile": "/volumes/ffmate/source/video.mp4",
       "outputFile": "/volumes/ffmate/destination/${DATE_YEAR}/${DATE_MONTH}/${DATE_DAY}/video_${TIME_HOUR}-${TIME_MINUTE}-${TIME_SECOND}.mp4",
       "priority": 2
     }'
```

#### Output Path:

```sh
/volumes/ffmate//destination/2024/02/15/video_14-30-45.mp4
```

## Timestamps

These wildcards generate **precise timestamps** to create unique file and directory names based on the **current time**.

| Wildcard                      | Description                                | Example Output          |
|--------------------------------|--------------------------------------------|-------------------------|
| `${TIMESTAMP_SECONDS}`        | Unix timestamp in seconds                 | `1705318712`           |
| `${TIMESTAMP_MILLISECONDS}`   | Unix timestamp with milliseconds precision | `1705318712123`         |
| `${TIMESTAMP_MICROSECONDS}`   | Unix timestamp with microseconds precision | `1705318712123456`      |
| `${TIMESTAMP_NANOSECONDS}`    | Unix timestamp with nanoseconds precision  | `1705318712123456789`   |


#### Example:

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
       "inputFile": "/volumes/ffmate/source/video.mp4",
       "outputFile": "/volumes/ffmate/destination/video_${TIMESTAMP_SECONDS}.mp4"
     }'
```

#### Output Path:

```sh
/volumes/ffmate/destination/video_1705318712.mp4
```

## System Information

These wildcards return **system information**, specifically the **operating system name** and **CPU architecture**.

| Wildcard       | Description                        | Example Output  |
|---------------|------------------------------------|----------------|
| `${OS_NAME}`  | Operating system name             | `linux`        |
| `${OS_ARCH}`  | CPU architecture                  | `amd64`        |

#### Example:

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
       "inputFile": "/volumes/ffmate/source/video.mp4",
       "outputFile": "/volumes/ffmate/processed/${OS_NAME}/${OS_ARCH}/video.mp4"
     }'
```

#### Output Path:

```sh
/volumes/ffmate/processed/linux/amd64/video.mp4
```

## Unique Identifier

This wildcard generate **random unique identifiers**.

| Wildcard       | Description                        | Example Output                                  |
|---------------|------------------------------------|------------------------------------------------|
| `${UUID}`     | Randomly generated UUID (v4)      | `550e8400-e29b-41d4-a716-446655440000`        |


#### Example:

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
       "inputFile": "/volumes/ffmate/source/video.mp4",
       "outputFile": "/volumes/ffmate/processed/${UUID}_video.mp4"
     }'
```

#### Output Path:

```sh
/volumes/ffmate/processed/550e8400-e29b-41d4-a716-446655440000_video.mp4
```