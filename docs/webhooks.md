---
title: "FFmate Webhooks: Real-Time Event Notifications"
description: "FFmate webhooks send a POST request to a URL when a task, batch, preset, watchfolder or webhook is created, updated, deleted or finished."
---

# Webhooks

A webhook makes FFmate send a `POST` request to a URL when an event happens, for example when a task changes. This replaces polling the API.

FFmate fires events for tasks, batches, presets, watchfolders and webhooks.

FFmate supports two kinds of webhooks:

## Global Webhooks
Each global webhook sends one [event](#global-webhook-events) to one URL. Several global webhooks can use the same event. They are created through the `/api/v1/webhooks` endpoint or in the Web UI. See [Creating a Webhook](#creating-a-webhook).

## Direct Webhooks
**Direct webhooks** belong to a single task or preset and only report on that task or preset. They go in the `webhooks` field when [creating a task](/docs/tasks.md#creating-a-task) or a [preset](/docs/presets.md#creating-a-preset). On a preset, `task.*` webhooks are copied to every task created from that preset, and `preset.*` webhooks fire when that preset changes.

Direct webhooks are only available for the following events:

### Task Events

| Event           | Description                                      |
|-----------------|--------------------------------------------------|
| `task.created`  | Triggered when a new task is added               |
| `task.updated`  | Triggered when a task's status or details change |
| `task.deleted`  | Triggered when a task is deleted                 |

### Preset Events

| Event            | Description                                   |
|------------------|-----------------------------------------------|
| `preset.created` | Triggered when a new preset is created        |
| `preset.updated` | Triggered when an existing preset is modified |
| `preset.deleted` | Triggered when a preset is removed            |


Global and direct webhooks can work together. For example, a global webhook for `task.updated` points to `https://ffmate.io/webhooks/global`. One task adds a direct webhook for the same event that points to `https://welovemedia.io/hooks/task-events`. When that task changes, FFmate notifies both URLs. Direct webhooks are set when the task is created, or added later by the pre-processing script through [Importing a Task's Sidecar](/docs/pre-post-prcessing.md#importing-a-task-s-sidecar).


## Creating a Webhook

To create a webhook, send a `POST` request to the FFmate API with the `event` to listen for and the `url` to notify:

```sh
curl -X POST http://localhost:3000/api/v1/webhooks \
     -H "Content-Type: application/json" \
     -d '{
       "event": "task.created",
       "url": "https://yourserver.com/webhook-handler"
     }'
```

Use one of the [global webhook events](#global-webhook-events) as `event`. FFmate saves any name, but a webhook with a name that isn't on that list never fires. `url` must be a valid URL, otherwise FFmate responds with `422`.

FFmate returns the new webhook as a JSON object with its `uuid`, `event`, `url`, `createdAt` and `updatedAt`. `createdAt` and `updatedAt` are date-time strings. A [`webhook.created`](#webhook-events) event is also fired.

💡 Tip: To create a webhook in the Web UI, see [Creating a Webhook](/docs/web-ui.md#creating-a-webhook).

## Global Webhook Events

FFmate fires the 14 events below. Each global webhook listens for one of them.

### Task Events

| Event              | Description |
|--------------------|-------------|
| `task.created`    | Triggered when a new task is added |
| `task.updated`    | Triggered when a task's status or details are updated |
| `task.deleted`    | Triggered when a task is deleted |

---

### Batch Events

| Event              | Description |
|--------------------|-------------|
| `batch.created`   | Triggered when a new batch of tasks is created |
| `batch.finished`  | Triggered when a batch of tasks is completed |

---

### Preset Events

| Event              | Description |
|--------------------|-------------|
| `preset.created`  | Triggered when a new preset is created |
| `preset.updated`  | Triggered when an existing preset is modified |
| `preset.deleted`  | Triggered when a preset is removed |

---

### Watchfolder Events
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



### Webhook Request Body

When an event happens, FFmate sends a `POST` request to the webhook's `url`. The body has two fields: `event` holds the event name, and `data` holds the object the event is about. For `task.created`, that's the new task:

```json
{
  "event": "task.created",
  "data": {
    "uuid": "caebc154-e6e9-4b18-8163-cfa384352813",
    "name": "video.mp4",
    "command": {
      "raw": "-y -i ${INPUT_FILE} ${OUTPUT_FILE}"
    },
    "inputFile": {
      "raw": "/source/video.mp4"
    },
    "outputFile": {
      "raw": "/destination/video_converted.mp4"
    },
    "status": "QUEUED",
    "source": "api",
    "retries": 0,
    "retried": 0,
    "progress": 0,
    "priority": 0,
    "remaining": 0,
    "createdAt": 1794087481300,
    "updatedAt": 1794087481300
  }
}
```

## Listing All Webhooks

To get a list of all available webhooks, send a `GET` request to the FFmate API:

```sh
curl -X GET 'http://localhost:3000/api/v1/webhooks?page=0&perPage=10'
```

**Query Parameters:**

- **`page`** *[optional]* – Specifies which page of results to retrieve. Default: `0`.
- **`perPage`** *[optional]* – Defines how many webhooks should be included in each page, 1 to 100. Default: `100`.

FFmate returns a JSON array with all configured webhooks. The `X-Total` response header provides the total number of webhooks available.

💡 Tip: To browse webhooks in the Web UI, see [Checking Configured Webhooks](/docs/web-ui.md#checking-configured-webhooks).

## Getting a Single Webhook

To retrieve the details of a specific webhook, send a `GET` request to the FFmate API using its `uuid`:

```sh
curl -X GET http://localhost:3000/api/v1/webhooks/{uuid}
```
FFmate returns a JSON object containing the details of the requested webhook.

💡 Tip: To check a webhook in the Web UI, see [Checking Configured Webhooks](/docs/web-ui.md#checking-configured-webhooks).

## Updating a Webhook

To change the `event` or `url` of a webhook, send a `PUT` request with the webhook's `uuid` in the path. The request body has the same fields as when creating a webhook.

```sh
curl -X PUT http://localhost:3000/api/v1/webhooks/{uuid} \
     -H "Content-Type: application/json" \
     -d '{
       "event": "task.updated",
       "url": "https://your-new-server.com/updated-handler"
     }'
```

FFmate returns the updated webhook object in JSON format. A [`webhook.updated`](#webhook-events) event is also fired.

💡 Tip: To update a webhook in the Web UI, see [Updating a Webhook](/docs/web-ui.md#updating-a-webhook).

## Deleting a Webhook

To remove a webhook, send a `DELETE` request with its `uuid`:

```sh
curl -X DELETE http://localhost:3000/api/v1/webhooks/{uuid}
```

FFmate responds with a `204` No Content status, and the webhook is removed from FFmate. A [`webhook.deleted`](#webhook-events) event is also fired.

💡 Tip: To delete webhooks in the Web UI, see [Deleting Webhooks](/docs/web-ui.md#deleting-webhooks).

## Setting Up Your Webhook Endpoint

FFmate sends events as `POST` requests with a JSON body and the headers `Content-Type: application/json` and `User-Agent: ffmate/<version>`. The endpoint must accept `POST` requests and read the JSON body.

FFmate waits for the server to answer. Any answer counts as delivered, whatever the status code. A `500 Internal Server Error` isn't sent again.

If the server can't be reached, FFmate tries again up to 3 times, after 3, 5 and 10 seconds.

## Webhook Logs

FFmate records every webhook that gets an answer from your server, for global and direct webhooks. For each one, FFmate stores the `event`, the target `url` and the exact request headers and body. It also stores the HTTP status code, headers and body of the answer.

If your server can't be reached, even after all retries, nothing is recorded here. FFmate writes the error to its log instead.

To get the webhook logs, send a `GET` request to the FFmate API:

```sh
curl -X GET 'http://localhost:3000/api/v1/webhooks/executions?page=0&perPage=10'
```

**Query Parameters:**

- **`page`** *[optional]* – Specifies which page of results to retrieve. Default: `0`.
- **`perPage`** *[optional]* – Defines how many records should be included in each page, 1 to 100. Default: `100`.

FFmate returns a JSON array, newest first. The `X-Total` response header provides the total number of records.

```json
[
  {
    "uuid": "0b6c1d7e-3f2a-4e8b-9c51-7a2d4e6f8a90",
    "event": "task.created",
    "url": "https://yourserver.com/webhook-handler",
    "request": {
      "headers": { "Content-Type": ["application/json"], "User-Agent": ["ffmate/2.1.0"] },
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

💡 Tip: To check the webhook logs in the Web UI, see [Sent Hooks](/docs/web-ui.md#sent-hooks).
