---
title: "FFmate Webhooks: Real-Time Event Notifications"
description: "Integrate external systems with FFmate using webhooks. Get instant notifications for task updates, batch processing, preset changes and more."
---

# Webhooks

FFmate supports **webhooks**, allowing external systems to receive **real-time notifications** when specific events occur. By registering a webhook, you can automatically trigger actions in response to changes in FFmate, such as task creation, status updates, batch processing, or preset modifications.

## Setting Up a Webhook  

To configure a webhook, make a `POST` request to the API with the event you want to subscribe to and the URL where FFmate should send notifications.

```sh
curl -X POST http://localhost:3000/api/v1/webhooks \
     -H "Content-Type: application/json" \
     -d '{
       "event": "task.created",
       "url": "https://yourserver.com/webhook-handler"
     }'
```

### Webhook Payload:
When the specified event occurs, FFmate will send an HTTP `POST` request to the provided URL with relevant event data.

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

## Available Webhook Events  

FFmate provides a variety of webhook events, grouped into different categories:

### Task Events:

| Event              | Description |
|--------------------|-------------|
| `task.created`    | Triggered when a new task is added. |
| `task.updated`    | Triggered when a task's status or details are updated. |
| `task.deleted`    | Triggered when a task is deleted. |

---

### Batch Events:

| Event              | Description |
|--------------------|-------------|
| `batch.created`   | Triggered when a new batch of tasks is created. |
| `batch.finished`  | Triggered when a batch of tasks is completed. |

---

### Preset Events:

| Event              | Description |
|--------------------|-------------|
| `preset.created`  | Triggered when a new preset is created. |
| `preset.updated`  | Triggered when an existing preset is modified. |
| `preset.deleted`  | Triggered when a preset is removed. |

---

### Watchfolder Events:
| Event                  | Description |
|------------------------|-------------|
| `watchfolder.created`  | Triggered when a new watchfolder is created. |
| `watchfolder.updated`  | Triggered when an existing watchfolder is modified. |
| `watchfolder.deleted`  | Triggered when a watchfolder is removed. |

---

### Webhook Events :

| Event              | Description |
|--------------------|-------------|
| `webhook.created` | Triggered when a new webhook is registered. |
| `webhook.deleted` | Triggered when a webhook is removed. |


## Deleting a Webhook  

To remove a webhook, send a `DELETE` request with its ID:

```sh
curl -X DELETE http://localhost:3000/api/v1/webhooks/{webhookId} \
     -H "accept: application/json"
```


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