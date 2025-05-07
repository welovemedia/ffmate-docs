---
url: /docs/getting-started.md
---
# 🚀 Getting Started

Setting up FFmate is quick and straightforward. Follow these steps to get up and running in no time.

## Download FFmate

Get the latest release of FFmate from [GitHub](https://github.com/welovemedia/ffmate/releases)

## Running FFmate

Once installed, start the FFmate server from the command line:

```sh
ffmate server
```

💡 Tip: Want to start FFmate with a convenient tray menu? Simply run:

```sh
ffmate server --tray
```

By default, the server runs on **<http://localhost:3000>**. Is port 3000 unavailable, or do you want to start FFmate on a different port? Learn how to change the port here 👉 [Learn more](#port-configuration).

## Submitting your first task

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

### Monitoring the Task

Check the status of your task by making a `GET` request:

```sh
curl http://localhost:3000/api/v1/tasks/{taskId}
```

Replace `{taskId}` with the actual ID returned when submitting the task.

You can  track your FFmate tasks directly in the Web UI. 👉 [Learn more](#web-ui-monitoring)

## Watchfolders

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

Once configured, any new file matching the criteria will be automatically processed when added to the watchfolder.

Are you more in the mood to configure your watchfolder in a more visual way? No problem! Learn how to configure your first watchfolder using our Web UI 👉 [Check it out](#web-ui) 

## Real-Time updates with Webhook notifications

FFmate can notify external systems about job progress, completion, or failures via **webhooks**.

To configure a webhook, make a `POST` request to the API:

```sh
curl --location 'http://localhost:3000/api/v1/webhooks' \
--header 'Content-Type: application/json' \
--data '{ "event": "task.created", "url": "https://myserver.com/ffmate/webhook.create" }'
```

FFmate will send a `POST` request to the specified URL when the  event occurs.

## Updating FFmate

Keeping FFmate up to date ensures you have the latest features, bug fixes, and performance improvements.

### Update FFmate via CLI

To update FFmate to the latest version, run the following command in your terminal:

```sh
ffmate update
```

This command will check for the latest release and install the update automatically.

### Verify the Installed Version

After updating, you can confirm that FFmate is running the latest version:

```sh
ffmate --version
```
