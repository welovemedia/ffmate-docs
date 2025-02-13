# 🚀 Getting Started

Setting up FFmate is quick and straightforward. Follow these steps to get up and running in no time.

## 📦 Download FFmate

Get the latest release of FFmate from [GitHub](https://github.com/welovemedia/ffmate/releases)..


## 🏁 Running FFmate

Once installed, start the FFmate server from the command line:

```sh
ffmate server
```

By default, the server runs on **[http://localhost:3000](http://localhost:3000)**. Is port 3000 unavailable, or do you want to start FFmate on a different port? Learn how to change the port here 👉 [Learn more](#port-configuration).

---

## 🎯 Submitting your first task

To submit a new transcoding task, make a `POST` request to the API:

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
       "inputFile": "videos/input.mp4",
       "outputFile": "videos/output.mp4",
       "priority": 2
     }'
```



### 📌 Task Properties:

Each property in the request body has a specific role:

## Task Submission Parameters

## Task Submission Parameters

### `command`
This represents the FFmpeg command that will be executed. FFmate implicitly calls the FFmpeg binary, so you only need to specify the command-line parameters and flags without including the FFmpeg executable itself. Use `${INPUT_FILE}` and `${OUTPUT_FILE}` as placeholders for the actual input and output file paths.

<div class="tip custom-block" style="padding-top: 8px">
• <code>${INPUT_FILE}</code> will be replaced by the full path of the input file.<br>
• <code>${OUTPUT_FILE}</code> will be replaced by the full path of the output file.
</div>

- **`inputFile`**: Path to the input media file that will be processed.
- **`inputFile`**: Path where the transcoded file should be saved.
- **`priority`**: Determines the processing order of the task. Higher values are processed first (e.g., `1` for low priority, `4` for critical priority).

After submitting a task, FFmate will respond with a JSON object containing the `taskId`. This `taskId` can be used to monitor the task’s progress in the next section.




### 🔍 Monitoring the Task

Check the status of your task by making a `GET` request:

```sh
curl http://localhost:3000/api/v1/tasks/{taskId}
```

Replace `{taskId}` with the actual ID returned when submitting the task.



You can  track your FFmate tasks directly in the Web UI. 👉 [Learn more](#web-ui-monitoring)

---

## ⚡ Watchfolders

FFmate can automatically detect and process new files in a **watchfolder**.

To configure a watchfolder, make a `POST` request to the API:

```sh
curl -X POST http://localhost:3000/api/v1/watchfolders \
     -H "Content-Type: application/json" \
     -d '{
       "name": "My Watchfolder",
       "description": "Automatically processes new media files",
       "interval": 5,
       "growthChecks": 3,
       "preset": "preset-id",
       "path": "/path/to/watchfolder",
       "filter": {
         "extensions": {
           "include": ["mp4", "mov"],
           "exclude": ["tmp", "log"]
         }
       }
     }'
```



### 📌 Watchfolder properties:

- **`name`**: A unique name for the watchfolder.
- **`description`**: A brief description of its purpose.
- **`interval`**: Time (in seconds) between folder scans.
- **`growthChecks`**: Number of times a file is checked to ensure it's fully copied before processing.
- **`preset`**: The ID of a predefined transcoding preset to apply.
- **`path`**: The absolute path of the folder to monitor.
- **`filter`**: Rules for file selection.
  - **`include`**: List of file extensions to process (e.g., `mp4`, `mov`).
  - **`exclude`**: List of file extensions to ignore (e.g., `tmp`, `log`).

Once configured, any new file matching the criteria will be automatically processed when added to the watchfolder.



🌐 Are you more in the mood to configure your watchfolder in a more visual way? No problem! Learn how to configure your first watchfolder using our Web UI 👉 [Check it out](#web-ui) 

---

## 🔗 Real-Time updates with Webhook notifications

FFmate can notify external systems about job progress, completion, or failures via **webhooks**.

To configure a webhook, make a `POST` request to the API:

```sh
curl --location 'http://localhost:3000/api/v1/webhooks' \
--header 'Content-Type: application/json' \
--data '{ "event": "task.created", "url": "https://sev.requestcatcher.com/ffmate/webhook.create" }'
```

FFmate will send a `POST` request to the specified URL when the  event occurs.