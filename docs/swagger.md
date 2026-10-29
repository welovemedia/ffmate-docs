---
title: "Accessing FFmate's REST API Documentation via Swagger UI"
description: "Find FFmate's comprehensive API documentation using Swagger (OpenAPI). Get the URL to access interactive specs for all REST endpoints, models, and parameters"
---

# API Documentation with Swagger (OpenAPI)

FFmate comes with a Swagger UI, an interactive reference for its REST API. It lists every endpoint with its parameters, the request body it expects and the responses it returns, including example values. With **Try it out**, a request can be sent to FFmate straight from the page, and the real response is shown below it.

## How to Access the Swagger UI

Once your FFmate server is running, you can access the Swagger UI in your web browser at the following URL:

**`http://<your-ffmate-host>:<port>/swagger/index.html`**

*   Replace `<your-ffmate-host>` with the hostname or IP address where FFmate is running (e.g., `localhost` if running locally).
*   Replace `<port>` with the port number FFmate is listening on (default is `3000`).
*   Opening `/swagger` redirects to the same page.

The Swagger UI is always available, even when FFmate runs with [`--no-ui`](/docs/flags.md#server-command-flags). If FFmate runs with [`--basic-auth`](/docs/flags.md#server-command-flags), the browser asks for the username and password first.

::: tip Default URL

If you're running FFmate locally on the default port, just copy the URL below into your browser's address bar to access the Swagger (OpenAPI) interface:

```sh
http://localhost:3000/swagger/index.html
```
:::

## What the Swagger UI Covers

The Swagger UI documents every endpoint under `/api/v1`: tasks, batches, presets, watchfolders, webhooks, clients, settings and debug. The [health check, metrics and WebSocket endpoints](/docs/ffmate-internals.md) are not part of it.

## Downloading the API Specification

The specification behind the Swagger UI is available as a JSON file in Swagger 2.0 format:

```sh
curl -X GET http://localhost:3000/swagger/doc.json
```

Import it into tools such as Postman or Insomnia, or use it to generate an API client.

## Postman Collection

Prefer testing APIs in Postman?

Click the button below to open the official FFmate Postman collection and start exploring the API with ready-made requests—no setup required.

[<img src="https://run.pstmn.io/button.svg" alt="Run in Postman" style="width: 128px; height: 32px;">](https://www.postman.com/welovemedia/ffmate)