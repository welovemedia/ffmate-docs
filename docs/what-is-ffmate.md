---
title: "FFmate: FFmpeg Automation Layer with a REST API"
description: "FFmate is an open-source automation layer on top of FFmpeg that runs FFmpeg commands as tasks, with a REST API, presets, watchfolders, webhooks and a Web UI."
---

# What is FFmate?

**FFmate** is an automation layer on top of [FFmpeg](https://ffmpeg.org/). It runs FFmpeg commands as tasks and offers a REST API to create and track them.

FFmpeg encodes and converts video and audio, but each command has to be written, started and checked by hand. FFmate adds a task queue, presets, watchfolders, webhooks and a Web UI. Several FFmate instances can share one queue as a cluster.

## Key Features

- **REST API** – Create and control tasks, presets, watchfolders and webhooks from any tool or script. See [Swagger](/docs/swagger.md).
- **Queueing System** – Run several tasks at the same time, with priorities.
- **Cluster Support** – Run multiple FFmate instances together, sharing the same database for scaling and redundancy.
- **Labels** – Choose which FFmate instances pick up which tasks, for example only the ones with a GPU.
- **Automatic Retries** – Run failed tasks again automatically.
- **Wildcards** – Insert file names, dates, metadata and more into commands, file paths and scripts.
- **Webhook Notifications** – Send a `POST` request to a URL when an event happens, for example when a task changes.
- **Watchfolder** – Create a task for every new file in a folder.
- **Pre & Post Processing Actions** – Execute custom commands or scripts before and after transcoding.
- **Preconfigured Presets** – Reuse an FFmpeg command, output path and scripts across tasks, or start from a ready-made preset.
- **Web UI** – Watch and cancel tasks, and create presets, watchfolders and webhooks in the browser.
- **Monitoring** – Check each FFmate instance with a health endpoint and Prometheus metrics. See [FFmate Internals](/docs/ffmate-internals.md).
- **Password Protection** – Protect the API and Web UI with a username and password.
- **Runs Everywhere** – Windows, macOS, Linux and Docker.

To install FFmate and run a first task, see [Getting Started](/docs/getting-started.md).

## Use Cases

### Automated Media Transcoding

FFmate runs FFmpeg commands for video conversion, audio extraction, thumbnail generation and other media processing.
Many tasks can be submitted at once, for example as a [batch](/docs/tasks.md#submitting-multiple-tasks-as-a-batch). FFmate queues them and runs the ones with the highest `priority` first.
For example, to transcode the same kind of file again and again for post-production or a cloud service.

### Connecting Other Systems with Webhooks

FFmate's [webhooks](/docs/webhooks.md) send a `POST` request to a URL when an event happens, for example when a task changes or a batch finishes. Internal automation tools, media asset management platforms and cloud publishing systems can react to these events without polling the API.

### Running Tasks at Scale

Other programs can start FFmpeg commands through the FFmate REST API instead of running FFmpeg themselves.  
Set how many tasks each FFmate instance runs at the same time, based on the machine's resources. When one machine isn't enough, add more FFmate instances as a [cluster](/docs/clustering.md). They share one queue.  
Each task has a `priority`, and with `retries` FFmate puts a failed task back into the queue. For example, FFmate can run behind a cloud encoding service, a media conversion microservice or an internal tool that needs FFmpeg on demand.

### Drop Folder Ingest with Watchfolders

A [watchfolder](/docs/watchfolder.md) creates a task for every new file in a folder, using the watchfolder's preset. For example, to transcode camera card offloads copied to shared storage.

## Who's Behind FFmate

FFmate is created and maintained by developers and product managers at [MoovIT GmbH](https://moovit.de), a German systems integrator and software company that brings video production and IT together.

MoovIT sponsors FFmate by letting the team build and maintain it during their working hours, alongside MoovIT's own projects. This support is what makes FFmate possible and keeps it free and open source under the [AGPL-3.0 license](https://opensource.org/license/agpl-v3).
