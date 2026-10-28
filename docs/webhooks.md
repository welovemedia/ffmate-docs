---
title: "FFmate Webhooks: Real-Time Event Notifications"
description: "Integrate external systems with FFmate using webhooks. Get instant notifications for task updates, batch processing, preset changes and more"
---

# Webhooks

**Webhooks** in FFmate let you plug real-time event notifications into your workflows—making it easier to trigger external processes, connect third-party tools, and monitor `FFmpeg` jobs without constantly polling the API.

When you add webhooks, FFmate can `notify` your external systems whenever events occur—whether it’s tasks, presets, watchfolders, or other changes.

FFmate supports two kinds of webhooks:

### Global Webhooks
Each global webhook sends one [event](#global-webhook-events) to one URL. Several global webhooks can use the same event. They can be configured through the **/webhooks** [api](#creating-a-webhook) endpoint or the Web UI.

### Direct Webhooks
**Direct webhooks** are for cases where you need more fine-grained notifications with additional target endpoints. You can add them **directly to tasks** when submitting via the [api](/docs/tasks.md#creating-a-task), or to an FFmate [preset](/docs/presets.md#creating-a-preset). On a preset, `task.*` webhooks are copied to every task created from that preset, and `preset.*` webhooks fire when that preset changes.

Direct webhooks are only available for the following events:

### Task Events

| Event           | Description                                      |
|-----------------|--------------------------------------------------|
| `task.created`  | Triggered when a new task is added               |
| `task.updated`  | Triggered when a task’s status or details change |
| `task.deleted`  | Triggered when a task is deleted                 |

### Preset Events

| Event            | Description                                   |
|------------------|-----------------------------------------------|
| `preset.created` | Triggered when a new preset is created        |
| `preset.updated` | Triggered when an existing preset is modified |
| `preset.deleted` | Triggered when a preset is removed            |


Global and direct webhooks can work together. For example: 
 
- You might configure a global webhook for `task.created`, `task.updated`, and `task.deleted` that points to a central endpoint, e.g. `https://ffmate.io/webhooks/global`.  
- For certain tasks submitted via the API, you can attach extra direct webhooks for those same events, e.g. `https://welovemedia.io/hooks/task-events`.  
- Direct webhooks can be set when you create the task, or added later in the pre-processing step using the [sidecar re-import feature](/docs/pre-post-prcessing.md#importing-a-task-s-sidecar).


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

The `event` must be one of the [global webhook events](#global-webhook-events), and `url` must be a valid URL. Otherwise FFmate responds with `422`.

After you create a webhook, FFmate responds with a JSON object containing the `uuid` of the newly created webhook, its `event` and `url`, and `createdAt` / `updatedAt` as date-time strings. A `webhook.created` event is also fired via [webhooks](#webhook-events)

💡 Tip: Creating a new webhook? You can define and save webhooks directly in the [FFmate Web UI](/docs/web-ui.md#creating-a-webhook) without writing any API requests

## Global Webhook Events

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
curl -X GET 'http://localhost:3000/api/v1/webhooks?page=0&perPage=10'
```

**Query Parameters:**

- **`page`** *[optional]* – Specifies which page of results to retrieve. Default: `0`.
- **`perPage`** *[optional]* – Defines how many webhooks should be included in each page. Default: `100`. Maximum: `100`.

FFmate returns a JSON array with all configured webhooks. The `X-Total` response header provides the total number of webhooks available.

💡 Tip: Need an overview of all webhooks? You can browse and manage them easily in the [FFmate Web UI](/docs/web-ui.md#checking-configured-webhooks).

## Getting a Single Webhook

To retrieve the details of a specific webhook, send a `GET` request to the FFmate API using its `uuid`.

```sh
curl -X GET http://localhost:3000/api/v1/webhooks/{webhookId}
```
FFmate returns a JSON object containing the details of the requested webhook.

💡 Tip: Want a quick way to check the webhook details? You can view webhook configurations directly in the [FFmate Web UI](/docs/web-ui.md#checking-configured-webhooks) without using the API.

## Updating a Webhook

To modify an existing webhook, such as changing its **target URL** or the **event** it subscribes to, send a `PUT` request to the FFmate API with the **webhook's `uuid`** in the URL and the new configuration in the request body. The request body should **contain the same fields** as when creating a new webhook.

```sh
curl -X PUT http://localhost:3000/api/v1/webhooks/{webhookId} \
     -H "Content-Type: application/json" \
     -d '{
       "event": "task.updated",
       "url": "https://your-new-server.com/updated-handler"
     }'
```

FFmate returns the updated webhook object in JSON format. A `webhook.updated` event is also fired via [webhooks](#webhook-events)

💡 Tip: Making changes to a webhook? You can update the event and URL directly in the [FFmate Web UI](/docs/web-ui.md#updating-a-webhook).

## Deleting a Webhook  

To remove a webhook, send a `DELETE` request with its `uuid`:

```sh
curl -X DELETE http://localhost:3000/api/v1/webhooks/{webhookId}
```

FFmate responds with a `204` No Content status. The webhook will be removed from the system. A `webhook.deleted` event is also fired via [webhooks](#webhook-events)

💡 Tip: No need to send a delete request manually—you can remove webhooks instantly from the [FFmate Web UI](/docs/web-ui.md#deleting-webhooks).

## Setting Up Your Webhook Endpoint

When FFmate sends a webhook, it expects your server to be ready to receive and respond to the event.

Here's what your endpoint should do:

1. **Accept HTTP POST requests**

   FFmate sends events as `POST` requests with a JSON payload and the headers `Content-Type: application/json` and `User-Agent: ffmate/<version>`. Your endpoint should accept and correctly parse these requests.

2. **Return a 2xx status code**

   FFmate waits for your server to reply before considering the webhook delivered. If your server responds with an HTTP status in the `2xx` range, FFmate treats the webhook as successfully delivered.

   If your server times out or sends back a non-2xx (like `500 Internal Server Error`), FFmate will try again. It retries sending the webhook up to **three times**, with increasing delays:

   * After **3** seconds.
   * Then after **5** seconds.
   * Finally after **10** seconds.

## Webhook logs

FFmate automatically records every webhook delivery in the database, for global and direct webhooks. For each delivery, it stores:  

* the `event` and target `url`.
* the exact request headers and body sent.
* the HTTP status code, response headers, and response body returned by your server.

You can fetch this full history through the API or UI:

```sh
curl -X GET 'http://localhost:3000/api/v1/webhooks/executions?page=0&perPage=10'
```

**Query Parameters:**

- **`page`** *[optional]* – Specifies which page of results to retrieve. Default: `0`.
- **`perPage`** *[optional]* – Defines how many records should be included in each page. Default: `100`. Maximum: `100`.

FFmate returns a JSON array, newest first. The `X-Total` response header provides the total number of records.

```json
[
  {
    "uuid": "0b6c1d7e-3f2a-4e8b-9c51-7a2d4e6f8a90",
    "event": "task.created",
    "url": "https://yourserver.com/webhook-handler",
    "request": {
      "headers": { "Content-Type": ["application/json"], "User-Agent": ["ffmate/2.0.19"] },
      "body": "{\"data\":{...},\"event\":\"task.created\"}"
    },
    "response": {
      "status": 200,
      "headers": { "Content-Type": ["text/plain"] },
      "body": "ok"
    },
    "createdAt": "2026-10-28T11:18:22.603438+01:00",
    "updatedAt": "2026-10-28T11:18:22.603438+01:00"
  }
]
```
