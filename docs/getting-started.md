---
title: "Quick Start FFmate: Install, Run Server and Core Features"
description: "Install FFmpeg and FFmate on macOS, Windows, Linux or Docker, start the server and create a first task, a watchfolder and a webhook."
---

# Getting Started

This page installs FFmpeg and FFmate, starts the server and sends a first task.

## Installing FFmpeg

FFmate runs every task with [FFmpeg](https://ffmpeg.org/), so FFmpeg must be installed. The steps below install it for each operating system.

### macOS

#### Installing FFmpeg via Homebrew

To install FFmpeg on macOS with [Homebrew](https://brew.sh), run:

```sh
brew install ffmpeg
```

Homebrew installs FFmpeg and adds it to your system `PATH`, so FFmate can find it.

#### Download and Run the Static Build

If you don't use Homebrew, install FFmpeg from a static build instead.

1. Go to [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html) and click the **Apple** icon.

2. Choose a trusted static build provider like:
   - [evermeet.cx](https://evermeet.cx/ffmpeg/)
   - [Gyan.dev](https://www.gyan.dev/ffmpeg/builds/)

3. Download the build and unzip it. You'll find an `ffmpeg` binary inside.

4. Move the binary to a directory in your system `PATH`, for example:

   ```sh
   sudo mv ~/Downloads/ffmpeg /usr/local/bin/
   sudo chmod +x /usr/local/bin/ffmpeg
   ```

5. The first time you run it, macOS may block it because it's from an "unidentified developer".
   To allow it:

   * Open **System Settings → Privacy & Security**
   * Look for the FFmpeg block message and click **Allow Anyway**
   * Then run the binary again from your terminal

FFmpeg is then available system-wide, and FFmate can use it.

### Windows

#### Install via Windows Package Manager (winget)

On Windows 10 or 11, install FFmpeg with the built-in package manager:

```powershell
winget install FFmpeg
```

This installs FFmpeg and adds it to your system `PATH`, so FFmate can find it.

#### Download and Run the Static Build

To install FFmpeg manually, use a static build:

1. Go to [https://www.gyan.dev/ffmpeg/builds/](https://www.gyan.dev/ffmpeg/builds/) and download a static build, for example `ffmpeg-release-essentials.zip`.

2. Extract the archive to a folder, for example `C:\ffmpeg`.

3. Add `C:\ffmpeg\bin` to your system `PATH`:
   - Press `Win + S`, search for **Environment Variables**, and select **Edit the system environment variables**
   - In the **System Properties** window, click **Environment Variables…**
   - Under **System variables**, find and select the `Path` variable, then click **Edit**
   - Click **New** and enter: `C:\ffmpeg\bin`
   - Click **OK** to save and close all windows

4. Open a new Command Prompt or PowerShell window and verify the installation:

   ```cmd
   ffmpeg -version
   ```

FFmpeg is then available system-wide, and FFmate can use it.

### Linux

On Ubuntu or Debian-based systems:

```sh
sudo apt update
sudo apt install ffmpeg
```

### Docker

The FFmate Docker image already includes FFmpeg, so there's nothing else to install.


> 💡 If FFmpeg is installed in a non-standard location, set its path with [`--ffmpeg`](/docs/flags.md#server-command-flags).


## Downloading & Installing FFmate

FFmate is available for Windows, macOS and Linux, and as a Docker image:

### macOS via Homebrew
Install FFmate with Homebrew:

```bash
brew install ffmate
```

To update FFmate installed via Homebrew, run the following command:

```bash
brew update
brew upgrade ffmate
```

### Windows (Manual Download)
- [Windows AMD64](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate-windows-amd64.zip)
- [Windows ARM64](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate-windows-arm64.zip)

### macOS (Manual Download)
- [macOS Apple Silicon (arm64)](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate-darwin-arm64.gz)
- [macOS Intel (x86_64)](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate-darwin-amd64.gz)

### Linux (Manual Download)
- [Linux ARM64](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate-linux-arm64.gz)
- [Linux x86_64](https://github.com/welovemedia/ffmate/releases/latest/download/ffmate-linux-amd64.gz)

### Docker
- [Run FFmate via Docker](https://github.com/welovemedia/ffmate/pkgs/container/ffmate)

## Running FFmate

FFmate runs natively on Windows, macOS and Linux, or in a Docker container.

### Windows

After downloading FFmate, open your terminal, navigate to the folder where you saved it and start the server with:

```cmd
ffmate server
```

### macOS & Linux

After downloading FFmate, open your terminal, navigate to the folder where you saved it and start the server with:

```sh
ffmate server
```

By default, FFmate runs on port `3000` and can be opened at [http://localhost:3000](http://localhost:3000). Once it's ready, FFmate prints:

```
info ffmate version 2.1.0
info connecting to database
info ffmpeg binary found at '/usr/local/bin/ffmpeg'
info server started on port '3000' using driver 'sqlite3'
```

If port `3000` is already in use, FFmate stops with `failed to start ffmate server: … address already in use`. Start it on a different port with [`--port`](/docs/flags.md#server-command-flags), for example `ffmate server --port 8080`.

::: danger FFmate is reachable from your network by default
FFmate listens on all network interfaces, `0.0.0.0`, not only `localhost`. It doesn't require a password. Anyone who can reach port `3000` on your machine can run commands on it through [pre/post-processing scripts](/docs/pre-post-prcessing.md).

* **Only using FFmate on this machine?** Start it with `ffmate server --host 127.0.0.1`.
* **Other machines need access?** Start it with `--basic-auth "username:password"`, and only allow those machines through your firewall.
* **Never** expose FFmate directly to the internet.

See [`--host`](/docs/flags.md#server-command-flags) and [`--basic-auth`](/docs/flags.md#server-command-flags) for details.
:::


> [!NOTE]
> FFmate requires `FFmpeg` to be installed on Windows, macOS or Linux. Make sure `FFmpeg` is available in your system's `PATH` before launching FFmate. If `FFmpeg` is installed in a custom location, set its path with [`--ffmpeg`](/docs/flags.md#server-command-flags).

### Running FFmate with Docker

FFmate is also available as a Docker image hosted on GitHub Container Registry, for `amd64` and `arm64`.
The Docker image comes with [jellyfin-ffmpeg](https://github.com/jellyfin/jellyfin-ffmpeg), an FFmpeg build with extra codecs, and `ffprobe`. It also includes `bash`, `jq` and `curl` for [pre/post-processing scripts](/docs/pre-post-prcessing.md).

One command pulls and starts the FFmate Docker image:

```sh
docker run -it --rm \
  -p 3000:3000 \
  ghcr.io/welovemedia/ffmate:latest
```

FFmate starts, and the Web UI is available at http://localhost:3000.

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

**Run as a non-root user** with `--user 1000:1000`, or `user:` in Docker Compose. The image creates `/app/db` as `root`, so a non-root user can't write the database there. Mount a folder that user can write to:

```sh
docker run -it --rm --user 1000:1000 \
  -p 127.0.0.1:3000:3000 \
  -v $(pwd)/ffmate-data:/app/db \
  ghcr.io/welovemedia/ffmate:latest
```
:::

> [!NOTE]
> By default, data won't persist after the container stops.
> To preserve your database, map a local folder to `/app/db`.
> For example: `-v $(pwd)/ffmate-data:/app/db`.

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

### Example

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

This `docker-compose.yml` runs FFmate on port `3000` of `localhost` and keeps the database in `./ffmate-data`:

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

## Submitting Your First Task

To submit a new transcoding task, make a `POST` request to the API:

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "name": "My first task",
       "command": "-y -i ${INPUT_FILE} -c:v libx264 -preset fast -crf 23 ${OUTPUT_FILE}",
       "inputFile": "videos/input.mp4",
       "outputFile": "videos/output.mp4",
       "priority": 2
     }'
```

### Monitoring the Task

Check the status of your task by making a `GET` request:

```sh
curl -X GET http://localhost:3000/api/v1/tasks/{uuid}
```

Replace `{uuid}` with the task's `uuid` from the response to the `POST` request.

The Web UI also shows the status and progress of each task. See [Monitoring Tasks](/docs/web-ui.md#monitoring-tasks).

## Watchfolders

A [watchfolder](/docs/watchfolder.md) creates a task for every new file in a folder.

To configure a watchfolder, make a `POST` request to the API:

```sh
curl -X POST http://localhost:3000/api/v1/watchfolders \
     -H "Content-Type: application/json" \
     -d '{
       "name": "My Watchfolder",
       "description": "Automatically processes new media files",
       "interval": 5,
       "growthChecks": 3,
       "preset": "uuid-of-a-preset",
       "path": "/path/to/watchfolder",
       "filter": {
         "extensions": {
           "include": ["mp4", "mov"],
           "exclude": ["tmp", "log"]
         }
       }
     }'
```

FFmate scans `/path/to/watchfolder` every 5 seconds. It creates a task for each new file that matches the filter, once the file stops growing.

To create a watchfolder in the Web UI, see [Creating a Watchfolder](/docs/web-ui.md#creating-a-watchfolder).

## Real-Time Updates with Webhook Notifications

FFmate can notify external systems about task progress, completion or failure using webhooks.

To configure a webhook, make a `POST` request to the API:

```sh
curl -X POST http://localhost:3000/api/v1/webhooks \
     -H "Content-Type: application/json" \
     -d '{
       "event": "task.created",
       "url": "https://myserver.com/ffmate/webhook.create"
     }'
```

FFmate sends a `POST` request to `https://myserver.com/ffmate/webhook.create` each time a task is created.

Webhooks fire for events on tasks, batches, presets, webhooks and watchfolders. For every event name, see [Webhooks](/docs/webhooks.md).

## Updating FFmate

`ffmate update` installs the newest release. If FFmate was installed with Homebrew, update it with Homebrew instead, as shown in [macOS via Homebrew](#macos-via-homebrew).

### Update FFmate via CLI

To update FFmate to the latest version, run the following command in your terminal:

```sh
ffmate update
```

If there is no newer release, FFmate prints `no newer version found`.

### Verify the Installed Version

After updating, confirm which version is installed:

```sh
ffmate version
```

FFmate prints the version, for example:

```
version: 2.0.18
```