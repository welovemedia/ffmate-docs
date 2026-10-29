---
title: "FFmate: API-Powered FFmpeg automation layer for Automated Transcoding & Workflows"
description: "Discover FFmate, the modern and powerful API-powered FFmpeg automation layer. Automate media workflows with its queue system, webhooks, presets & watchfolders. Simplify transcoding at scale"
---

# What is FFmate?

**FFmate is a modern and powerful automation layer built on top of [FFmpeg](https://ffmpeg.org/)—designed to make video and audio transcoding simpler, smarter, and easier to integrate.**


While `FFmpeg` is the industry standard for media encoding and conversion, it can be complex to use directly—especially at scale.  

With FFmate, you get all the raw power of `FFmpeg`—plus the tools you need to automate, monitor, and scale your workflows with ease.

Whether you’re a developer building a media pipeline, a workflow engineer managing a farm of agents, or a non-technical user needing simple batch conversions, FFmate is designed to work for you.

## 🚀 Key Features

- **REST API** – Create and control tasks, presets, watchfolders and webhooks from any tool or script. See [Swagger](/docs/swagger.md).
- **Queueing System** – Run several tasks at the same time, with priorities.
- **Cluster Support** – Run multiple FFmate instances together, sharing the same database for scaling and redundancy.
- **Labels** – Choose which FFmate instances pick up which tasks, for example only the ones with a GPU.
- **Automatic Retries** – Run failed tasks again automatically.
- **Wildcards** – Insert file names, dates, metadata and more into commands, file paths and scripts.
- **Webhook Notifications** – Receive real-time updates for seamless integration with external workflows.
- **Watchfolder** – Automatically detect and process new files as they appear.
- **Pre & Post Processing Actions** – Execute custom commands or scripts before and after transcoding.
- **Preconfigured Presets** – Simplify common media conversion tasks with ready-to-use settings.
- **Web UI** – Monitor and configure transcoding workflows with an intuitive interface.
- **Monitoring** – Check each FFmate instance with a health endpoint and Prometheus metrics. See [FFmate Internals](/docs/ffmate-internals.md).
- **Password Protection** – Protect the API and Web UI with a username and password.
- **Runs Everywhere** – Windows, macOS, Linux and Docker.

Want to see it in action? Skip to the [Getting started](/docs/getting-started.md)

## 📌 Use Cases

### 📽️ Automated Media Transcoding  

Easily automate common media processing tasks like video conversion, audio extraction, and thumbnail generation.  
FFmate allows you to submit multiple `FFmpeg` jobs at once and handles them efficiently through a built-in queueing system.  
Perfect for post-production pipelines, cloud workflows, or any scenario where repetitive transcoding needs to be streamlined.


### ⚙️ Workflow & Pipeline Automation  

Use FFmate’s webhook system to sync with:

- Internal automation tools  
- Media asset management (MAM) platforms  
- Cloud-based production or publishing workflows  

No polling required—just plug in your endpoint and go.

### ☁️ Scalable FFmpeg Job Management  

Run FFmate as a centralized, API-first backend for `FFmpeg` job orchestration.  
Set how many tasks each FFmate instance runs at the same time, based on the machine's resources. When one machine isn't enough, add more FFmate instances as a [cluster](/docs/clustering.md). They share one queue.  
With full control over job priority, queuing, and task lifecycle, FFmate is ideal for high-volume transcoding environments where reliability and automation matter.

Use it to power:

- Cloud-based encoding workflows.  
- Media conversion microservices.
- Internal development tools that need `FFmpeg` processing on demand.


### 🗂️ Drop Folder Ingest (Watchfolder)  

Set up a watchfolder to automatically detect new files and trigger predefined processing workflows—perfect for camera card offloads, shared storage, or ingest pipelines.

## 🤝 Who's Behind FFmate

FFmate is created and maintained by developers and product managers at [MoovIT GmbH](https://moovit.de), a German systems integrator and software company that brings video production and IT together.

MoovIT sponsors FFmate by letting the team build and maintain it during their working hours, alongside MoovIT's own projects. This support is what makes FFmate possible and keeps it free and open source under the [AGPL-3.0 license](https://opensource.org/license/agpl-v3).
