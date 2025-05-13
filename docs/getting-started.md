---
title: "Quick Start FFmate: Install, Run Server and Core Features"
description: "Your essential guide to getting started with FFmate. Learn to download, install, run the server, submit your first task, set up watchfolders, webhooks, and update easily"
---

# 🚀 Getting Started

Setting up FFmate is quick and straightforward. Follow these steps to get up and running in no time.

## Download FFmate

Get the latest release of FFmate from [GitHub](https://github.com/welovemedia/ffmate/releases)

> [!IMPORTANT]
> FFmate is currently available for `macOS` and `Linux`. Support for Windows is coming soon.


## Running FFmate

After downloading FFmate, open your terminal, navigate to the folder where you saved it, and start the server by running the following command:

```sh
ffmate server
```

💡 Tip: For easy access to FFmate’s features, start it with a tray icon using the following command:

```sh
ffmate server --tray
```

By default, FFmate runs on **[http://localhost:3000](http://localhost:3000)**. If port 3000 is already in use or you prefer a different one, you can easily change it. Learn how to change the port here 👉 [Learn more](#port-configuration).

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

You can track the status and progress of your FFmate tasks directly in the Web UI. 👉 [Learn more](/docs/web-ui.md)

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

Are you more in the mood to configure your watchfolder in a more visual way? No problem! Learn how to configure your first watchfolder using our Web UI 👉 [Check it out](/docs/web-ui.md)

## Real-Time updates with Webhook notifications

FFmate can notify external systems about task progress, completion, or failure using webhooks.

To configure a webhook, make a `POST` request to the API:

```sh
curl -X POST http://localhost:3000/api/v1/webhooks \
     -H "Content-Type: application/json" \
     -d '{
       "event": "task.created",
       "url": "https://myserver.com/ffmate/webhook.create"
     }'
```

FFmate will send a `POST` request to the specified URL when the event occurs.

FFmate supports webhook notifications for tasks, batches, presets, watchfolders. You can react to new events, keep external systems in sync, or trigger automations in real time. Learn how to make the most of FFmate’s webhooks 👉 [Learn more](/docs/webhooks.md)

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