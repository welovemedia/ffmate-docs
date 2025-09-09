---
title: "FFmate Webhooks: Real-Time Event Notifications"
description: "Integrate external systems with FFmate using webhooks. Get instant notifications for task updates, batch processing, preset changes and more"
---

# Webhooks

**Webhooks** in FFmate allow you to integrate **real-time event notifications** into your media processing workflows.

By registering a webhook, external systems can automatically receive `POST` requests from FFmate when specific events occur—such as task creation, task status updates, batch processing events, or changes to presets.

This enables powerful automation, seamless third-party integration, and real-time monitoring of `FFmpeg-based` transcoding jobs—without the need to constantly poll the API.

## Creating a Webhook  

To create a webhook, send a `POST` request to the FFmate API specifying the event you want to subscribe to and the URL where FFmate should deliver the notification.  

```sh
curl -X POST http://localhost:3000/api/v1/webhooks \
     -H "Content-Type: application/json" \
     -d '{
       "event": "task.created",
       "url": "https://yourserver.com/webhook-handler"
     }'
```

After you create a webhook, FFmate responds with a JSON object containing the `id` of the newly created webhook.

💡 Tip: Creating a new webhook? You can define and save webhooks directly in the [FFmate Web UI](/docs/web-ui.md#creating-a-webhook) without writing any API requests

## Available Webhook Events

FFmate supports a range of webhook events, organized into categories based on what they track.

### Task Events:

| Event              | Description |
|--------------------|-------------|
| `task.created`    | Triggered when a new task is added |
| `task.updated`    | Triggered when a task's status or details are updated |
| `task.deleted`    | Triggered when a task is deleted |

---

### Batch Events:

| Event              | Description |
|--------------------|-------------|
| `batch.created`   | Triggered when a new batch of tasks is created |
| `batch.finished`  | Triggered when a batch of tasks is completed |

---

### Preset Events:

| Event              | Description |
|--------------------|-------------|
| `preset.created`  | Triggered when a new preset is created |
| `preset.updated`  | Triggered when an existing preset is modified |
| `preset.deleted`  | Triggered when a preset is removed |

---

### Watchfolder Events:
| Event                  | Description |
|------------------------|-------------|
| `watchfolder.created`  | Triggered when a new watchfolder is created |
| `watchfolder.updated`  | Triggered when an existing watchfolder is modified |
| `watchfolder.deleted`  | Triggered when a watchfolder is removed |

---

### Webhook Events

| Event              | Description                                   |
|--------------------|-----------------------------------------------|
| `webhook.created`  | Triggered when a new webhook is registered    |
| `webhook.updated`  | Triggered when an existing webhook is updated |
| `webhook.deleted`  | Triggered when a webhook is removed           |



### Webhook Payload:

When the event is triggered, FFmate sends a `POST` request to your specified URL, containing all relevant data about the event in the request body.

```json
{
  "event": "task.created",
  "timestamp": "2025-02-13T14:05:32Z",
  "data": {
    "taskId": "550e8400-e29b-41d4-a716-446655440000",
    "inputFile": "/source/video.mp4",
    "outputFile": "/destination/video_converted.mp4",
    "status": "queued"
  }
}
```

## Listing all Webhooks

To get a list of all available webhooks, send a `GET` request to the FFmate API

```sh
curl -X GET 'http://localhost:3000/api/v1/webhooks?page=0&perPage=10' \
     -H 'accept: application/json'
```

**Query Parameters:**

- **`page`** *[optional]* – Specifies which page of results to retrieve. Default: `0`.
- **`perPage`** *[optional]* – Defines how many webhooks should be included in each page. Default: `100`.

FFmate returns a JSON array with all configured webhooks. The `X-Total` response header provides the total number of webhooks available.

💡 Tip: Need an overview of all webhooks? You can browse and manage them easily in the [FFmate Web UI](/docs/web-ui.md#checking-configured-webhooks).

## Getting a Single Webhook

To retrieve the details of a specific webhook, send a `GET` request to the FFmate API using its unique ID.

```sh
curl -X GET http://localhost:3000/api/v1/webhooks/{webhookId} \
     -H "accept: application/json"
```
FFmate returns a JSON object containing the details of the requested webhook.

💡 Tip: Want a quick way to check the webhook details? You can view webhook configurations directly in the [FFmate Web UI](/docs/web-ui.md#checking-configured-webhooks) without using the API.

## Updating a Webhook

To modify an existing webhook, such as changing its **target URL** or the **event** it subscribes to, send a `PUT` request o the FFmate API with the **webhook's ID** in the URL and the new configuration in the request body. The request body should **contain the same fields** as when creating a new webhook.

```sh
curl -X PUT http://localhost:3000/api/v1/webhooks/{webhookId} \
     -H "Content-Type: application/json" \
     -d '{
       "event": "task.updated",
       "url": "https://your-new-server.com/updated-handler"
     }'
```

FFmate returns the updated webhook object in JSON format.

💡 Tip: Making changes to a webhook? You can update settings like name and url directly in the [FFmate Web UI](/docs/web-ui.md#updating-a-webhook).

## Deleting a Webhook  

To remove a webhook, send a `DELETE` request with its ID:

```sh
curl -X DELETE http://localhost:3000/api/v1/webhooks/{webhookId} \
     -H "accept: application/json"
```

FFmate responds with a `204` No Content status. The webhook will be removed from the system.

💡 Tip: No need to send a delete request manually—you can remove webhooks instantly from the [FFmate Web UI](/docs/web-ui.md#deleting-webhooks).

## Setting Up Your Webhook Endpoint

When FFmate sends a webhook, it expects your server to be ready to receive and respond to the event. Here's what your endpoint should do:

1. **Accept HTTP POST requests**

FFmate sends events using a `POST` request with a JSON payload.  
Your endpoint should be configured to accept and correctly parse these requests.

2. **Return a 200 OK response**

To confirm that the event was received successfully, your server **must** return an HTTP `200 OK` status.  
Any other status code may cause FFmate to assume the delivery failed.

3. **Log incoming requests**

FFmate **does not store webhook logs**.  
If something goes wrong, your application should log incoming webhook events to support debugging or auditing.