---
title: "Quick Start FFmate: Install, Run Server and Core Features"
description: "Your essential guide to getting started with FFmate. Learn to download, install, run the server, submit your first task, set up watchfolders, webhooks, and update easily"
---

# 🚀 Getting Started

Setting up FFmate is quick and straightforward. Follow these steps to get up and running in no time.

## Download FFmate

Get FFmate for your platform and start processing in minutes:

###  macOS  
- [macOS – Apple Silicon (arm64)](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate_Darwin_arm64.tar.gz)  
- [macOS – Intel (x86_64)](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate_Darwin_x86_64.tar.gz)

### 🐧 Linux  
- [Linux – ARM64](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate_Linux_arm64.tar.gz)  
- [Linux – x86_64](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate_Linux_x86_64.tar.gz)

### 🐳 Docker  
- [Run FFmate via Docker](https://github.com/welovemedia/ffmate/pkgs/container/ffmate)

> [!IMPORTANT]
> FFmate is currently available for **macOS** and **Linux**.
> **Windows support is coming soon**—stay tuned!

## Running FFmate

You can run FFmate either natively on macOS/Linux or inside a Docker container—whichever best fits your environment

### macOS & Linux

After downloading FFmate, open your terminal, navigate to the folder where you saved it, and start the server with:

```sh
ffmate server
```

💡 Tip: For easy access to FFmate’s features, start it with a tray icon using the following command:

```sh
ffmate server --tray
```

By default, FFmate runs on **[http://localhost:3000](http://localhost:3000)**. If port 3000 is already in use or you prefer a different one, you can easily change it. Learn how to change the port here 👉 [Learn more](#port-configuration).


### Running FFmate with Docker

FFmate is also available as a Docker image hosted on GitHub Container Registry.

You can pull and run FFmate using Docker with a single command:

```sh
docker run -it --rm \
  -p 3000:3000 \
  ghcr.io/welovemedia/ffmate:latest
```

This will start FFmate and expose the web interface at http://localhost:3000

> [!NOTE]
> By default, data won't persist after the container stops.
> To preserve your database, map a local folder to `**/app/db**`.
> Example: `**-v $(pwd)/ffmate-data:/app/db**`.

### Optional Environment Variables

You can customize FFmate’s behavior using the following environment variables:

| Variable              | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| `PORT`                | The port FFmate will run on (default: `3000`)                              |
| `DB`                  | Path to the internal SQLite database (default: `/app/db/sqlite.db`)        |
| `LOGLEVEL`            | Logging level (`info`, `warn`, `error`, `debug`)                           |
| `MAX_CONCURRENT_TASKS`| Maximum number of FFmpeg tasks to run at the same time (default: `3`)      |
| `DEBUGO`              | Enables verbose debug output (e.g., `ffmate:*`) |

### Example:

Run FFmate with all environment variables set in a single command:

```sh
docker run -it --rm \
  -p 3000:3000 \
  -v $(pwd)/ffmate-data:/app/db \
  -e PORT=3000 \
  -e LOGLEVEL=debug \
  -e MAX_CONCURRENT_TASKS=5 \
  ghcr.io/welovemedia/ffmate:latest
```

### Docker Compose

Prefer using Docker Compose? Here's a ready-to-use docker-compose.yml to get FFmate up and running quickly:

```yaml
version: "3.8"

services:
  ffmate:
    image: ghcr.io/welovemedia/ffmate:latest
    ports:
      - "3000:3000"
    volumes:
      - ./ffmate-data:/app/db
    environment:
      - PORT=3000
      - DB=/app/db/sqlite.db
      - LOGLEVEL=info
      - MAX_CONCURRENT_TASKS=3
```

Start FFmate using your `docker-compose.yml` file:

```sh
docker compose up -d
```

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