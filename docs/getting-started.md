---
title: "Quick Start FFmate: Install, Run Server and Core Features"
description: "Your guide to getting started with FFmate. Learn to download, install, run the server, submit your first task, set up watchfolders, webhooks, and update easily"
---

# 🚀 Getting Started

Setting up FFmate is quick and straightforward. Follow these steps to get up and running in no time.

## Installing FFmpeg

FFmate relies on [FFmpeg](https://ffmpeg.org/) to handle all media processing behind the scenes. If you don’t have **FFmpeg** installed yet, no worries — just follow the steps below to get it set up on your system.

###  macOS

#### Installing FFmpeg via Homebrew

The easiest way to install FFmpeg on macOS is using [Homebrew](https://brew.sh):

```sh
brew install ffmpeg
```

Homebrew installs FFmpeg and adds it to your system path automatically, so FFmate can find it and start processing tasks right away.

#### Download and run the static build

If Homebrew isn’t your thing, you can also install FFmpeg manually by downloading a static build.

1. Go to [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html) and click the **Apple** icon.

2. Choose a trusted static build provider like:
   - [evermeet.cx](https://evermeet.cx/ffmpeg/)
   - [Gyan.dev](https://www.gyan.dev/ffmpeg/builds/)

3. Download the build and unzip it. You’ll find an `ffmpeg` binary inside.

4. Move the binary to a directory in your system `PATH`, for example:

   ```sh
   sudo mv ~/Downloads/ffmpeg /usr/local/bin/
   sudo chmod +x /usr/local/bin/ffmpeg
   ```

5. The first time you run it, macOS may block it because it’s from an "unidentified developer"
   To allow it:

   * Open **System Settings → Privacy & Security**
   * Look for the FFmpeg block message and click **Allow Anyway**
   * Then run the binary again from your terminal

Once that's done, **FFmpeg** will be available system-wide, and FFmate will be able to use it automatically.

### 🖥️ Windows

#### Install via Windows Package Manager (winget)

If you're on Windows 10 or 11, you can install **FFmpeg** via the built-in package manager:

```powershell
winget install FFmpeg
```

This installs **FFmpeg** and automatically adds it to your system PATH, so FFmate can detect it and start processing tasks right away

#### Download and run the static build

Want full control? Here’s how to install FFmpeg manually with a static build

1. Go to [https://www.gyan.dev/ffmpeg/builds/](https://www.gyan.dev/ffmpeg/builds/) and download a static build (e.g., `ffmpeg-release-essentials.zip`).

2. Extract the archive to a folder — for example: `C:\ffmpeg`.

3. Add `C:\ffmpeg\bin` to your system `PATH`:
   - Press `Win + S`, search for **Environment Variables**, and select **Edit the system environment variables**
   - In the **System Properties** window, click **Environment Variables…**
   - Under **System variables**, find and select the `Path` variable, then click **Edit**
   - Click **New** and enter: `C:\ffmpeg\bin`
   - Click **OK** to save and close all windows

4. Open a new terminal (Command Prompt or PowerShell) and verify the installation:

   ```cmd
   ffmpeg -version
   ```

Once installed and added to your path, **FFmpeg** will be available system-wide — and FFmate will be ready to use it automatically.

### 🐧 Linux

On Ubuntu or Debian-based systems:

```sh
sudo apt update
sudo apt install ffmpeg
```

### 🐳 Docker

Running FFmate with Docker?
FFmpeg is already included in the image, so there’s nothing else to install. Just run and go 🚀


> 💡 If FFmpeg is installed in a non-standard location, you can tell FFmate where to find it using the `--ffmpeg` flag.
> Learn more 👉 [Flags Reference](/docs/flags/#server-command-flags)


## Downloading & Installing FFmate

FFmate is available for Windows, macOS, and Linux, with multiple installation options:

###  macOS via Homebrew
Install FFmate easily using Homebrew:

```bash
brew install ffmate
```

To update FFmate installed via Homebrew, run the following command:

```bash
brew update
brew upgrade ffmate
```

### 🖥️ Windows (Manual Download)
- [Windows – AMD64](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate-windows-amd64.zip)
- [Windows – ARM64](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate-windows-arm64.zip)

###  macOS (Manual Download)
- [macOS – Apple Silicon (arm64)](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate-darwin-arm64.gz)
- [macOS – Intel (x86_64)](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate-darwin-amd64.gz)

### 🐧 Linux (Manual Download)
- [Linux – ARM64](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate-linux-arm64.gz)
- [Linux – x86_64](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate-linux-amd64.gz)

### 🐳 Docker
- [Run FFmate via Docker](https://github.com/welovemedia/ffmate/pkgs/container/ffmate)

## Running FFmate

You can run FFmate in one of two ways: natively on Windows, macOS, or Linux, or via a Docker container. Whichever best fits your environment

### Windows

After downloading FFmate, open your terminal, navigate to the folder where you saved it, and start the server with:

```cmd
ffmate server
```

### macOS & Linux

After downloading FFmate, open your terminal, navigate to the folder where you saved it, and start the server with:

```sh
ffmate server
```

By default, FFmate runs on port `3000` and can be opened at **[http://localhost:3000](http://localhost:3000)**. Once it's ready, FFmate prints:

```
info ffmate version 2.0.19
info connecting to database
info ffmpeg binary found at '/usr/local/bin/ffmpeg'
info server started on port '3000' using driver 'sqlite3'
```

If port `3000` is already in use, FFmate stops with `failed to start ffmate server: … address already in use`. Start it on a different port with [`--port`](/docs/flags/#server-command-flags), for example `ffmate server --port 8080`.

::: danger FFmate is reachable from your network by default
FFmate listens on **all network interfaces (`0.0.0.0`)**, not only `localhost`, and does **not** require a password. Anyone who can reach port `3000` on your machine can run commands on it through [pre/post-processing scripts](/docs/pre-post-prcessing.md).

* **Only using FFmate on this machine?** Start it with `ffmate server --host 127.0.0.1`.
* **Other machines need access?** Start it with `--basic-auth "username:password"`, and only allow those machines through your firewall.
* **Never** expose FFmate directly to the internet.

See [`--host`](/docs/flags.md#server-command-flags) and [`--basic-auth`](/docs/flags.md#server-command-flags) for details.
:::


> [!NOTE]
> FFmate requires `FFmpeg` to be installed on **Windows**, **macOS**, or **Linux**. Make sure `FFmpeg` is available in your system’s `PATH` before launching FFmate. If `FFmpeg` is installed in a custom location, use the `--ffmpeg` flag to specify its path. [Learn more](/docs/flags/#server-command-flags)

### Running FFmate with Docker

FFmate is also available as a Docker image hosted on GitHub Container Registry, for `amd64` and `arm64`.
The Docker image comes with [jellyfin-ffmpeg](https://github.com/jellyfin/jellyfin-ffmpeg), an FFmpeg build with extra codecs, and `ffprobe`. It also includes `bash`, `jq` and `curl` for [pre/post-processing scripts](/docs/pre-post-prcessing.md).

You can pull and run FFmate using Docker with a single command:

```sh
docker run -it --rm \
  -p 3000:3000 \
  ghcr.io/welovemedia/ffmate:latest
```

This will start FFmate and expose the web interface at http://localhost:3000

::: warning Anyone who can reach the port can run commands in the container
`-p 3000:3000` publishes FFmate on every network interface of your Docker host, without a password. Since tasks can run [pre/post-processing scripts](/docs/pre-post-prcessing.md), anyone who can reach the port can run commands inside the container, which runs as `root` by default.

**Keep it local.** Publish the port on the Docker host's `localhost` only:

```sh
docker run -it --rm -p 127.0.0.1:3000:3000 ghcr.io/welovemedia/ffmate:latest
```

**Or enable basic auth.** The image has no environment variable for it, so override the start command:

```sh
docker run -it --rm \
  -p 3000:3000 \
  -v $(pwd)/ffmate-data:/app/db \
  ghcr.io/welovemedia/ffmate:latest \
  /app/ffmate server --database=/app/db/sqlite.db --basic-auth "admin:a-long-random-password"
```

**Run as a non-root user** with `--user 1000:1000` (or `user:` in Docker Compose). The image creates `/app/db` as `root`, so a non-root user can't write the database there. Mount a folder that user can write to:

```sh
docker run -it --rm --user 1000:1000 \
  -p 127.0.0.1:3000:3000 \
  -v $(pwd)/ffmate-data:/app/db \
  ghcr.io/welovemedia/ffmate:latest
```
:::

> [!NOTE]
> By default, data won't persist after the container stops.
> To preserve your database, map a local folder to `**/app/db**`.
> Example: `**-v $(pwd)/ffmate-data:/app/db**`.

### Optional Environment Variables

The Docker image supports these environment variables:

| Variable | Description | Default |
|---|---|---|
| `PORT` | The port FFmate listens on inside the container. When changing it, change the `-p` mapping too. | `3000` |
| `DATABASE` | Path to the SQLite database, or a `postgresql://` URI for [clustering](/docs/clustering.md). | `/app/db/sqlite.db` |
| `MAX_CONCURRENT_TASKS` | Maximum number of FFmpeg tasks running at the same time. | `3` |
| `IDENTIFIER` | Name of this FFmate instance, shown in the Web UI and used in a cluster. | Container hostname |
| `DEBUGO` | Which log messages FFmate prints, e.g. `debug:?` for debug output or `*` for everything. See [Debugging](/docs/debugging.md). | `info:?,warn:?,error:?` |

Other flags, such as `--host`, `--labels` or `--basic-auth`, have no environment variable. To use them, override the start command as shown in the basic auth example above.

### Example:

Run FFmate with debug logging and up to 5 tasks at the same time:

```sh
docker run -it --rm \
  -p 3000:3000 \
  -v $(pwd)/ffmate-data:/app/db \
  -e DEBUGO="debug:?" \
  -e MAX_CONCURRENT_TASKS=5 \
  ghcr.io/welovemedia/ffmate:latest
```

### Docker Compose

Prefer using Docker Compose? Here's a ready-to-use docker-compose.yml to get FFmate up and running quickly:

```yaml
services:
  ffmate:
    image: ghcr.io/welovemedia/ffmate:latest
    ports:
      - "127.0.0.1:3000:3000"
    volumes:
      - ./ffmate-data:/app/db
    environment:
      - PORT=3000
      - DATABASE=/app/db/sqlite.db
      - MAX_CONCURRENT_TASKS=3
      - IDENTIFIER=ffmate-docker
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
curl -X GET http://localhost:3000/api/v1/tasks/{taskId}
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

After updating, confirm which version is installed:

```sh
ffmate version
```

FFmate prints the version, for example:

```
version: 2.0.18
```