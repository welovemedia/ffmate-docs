---
title: "Accessing FFmate's REST API Documentation via Swagger UI"
description: "FFmate serves a Swagger UI at /swagger/index.html that lists every REST API endpoint under /api/v1 and sends test requests to an FFmate instance."
---

# API Documentation with Swagger (OpenAPI)

FFmate comes with a Swagger UI, an interactive reference for its REST API. It lists every endpoint with its parameters, the request body it expects and the responses it returns, including example values. With **Try it out**, a request can be sent to FFmate straight from the page, and the real response is shown below it.

## How to Access the Swagger UI

While FFmate is running, the Swagger UI opens in a web browser at this URL:

**`http://<your-ffmate-host>:<port>/swagger/index.html`**

Replace `<your-ffmate-host>` with the hostname or IP address where FFmate is running, for example `localhost` on the same computer. Replace `<port>` with the port number FFmate is listening on. The default port is `3000`. Opening `/swagger` redirects to the same page.

The Swagger UI is always available, even when FFmate runs with [`--no-ui`](/docs/flags.md#no-ui). If FFmate runs with [`--basic-auth`](/docs/flags.md#basic-auth), the browser asks for the username and password first.

::: tip Default URL

With FFmate running locally on the default port, the Swagger UI is at:

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

Click **Run in Postman** to open the official FFmate Postman collection. It has ready-made requests for the FFmate API and needs no setup.

[<img src="https://run.pstmn.io/button.svg" alt="Run in Postman button." style="width: 128px; height: 32px;">](https://www.postman.com/welovemedia/ffmate)