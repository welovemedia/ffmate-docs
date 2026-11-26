---
title: "FFmate API Keys: Call the REST API Without a Password"
description: "Create, rotate and delete FFmate API keys. With --basic-auth on, a key in the X-API-Key header lets scripts call the REST API with read or write access."
---

# API Keys

**API keys** in FFmate let scripts and applications communicate with the FFmate REST API using their own credentials instead of the basic auth username and password. Each application gets only the access it needs, and its key can be rotated or deleted without affecting anyone else.

API keys only work on an FFmate instance started with the [`--basic-auth`](/docs/flags.md#basic-auth) flag.

Each API key has the access level `read` or `write`. For example, a monitoring dashboard gets an API key with `read` access, so it can list tasks but not create or delete them. A render farm scheduler that creates tasks gets `write` access. See [Access Levels](#access-levels).

If an API key is leaked, [rotate it](#rotating-an-api-key) to get a new key. The previous key stops working at once, and the API key keeps its name and access level.

API keys can be [deleted](#deleting-an-api-key) at any time. Deleting an API key only affects the applications that use it. Basic auth and all other API keys keep working.

In a [cluster](/docs/clustering.md), API keys are saved in the shared database, so they work on every FFmate instance.

::: info Note
To make sure API keys work on every FFmate instance in a cluster, start all of them with the [`--basic-auth`](/docs/flags.md#basic-auth) flag.
:::

## Using an API Key

To authenticate a request to the FFmate REST API with an API key, set the `X-API-Key` header:

```sh
curl 'http://localhost:3000/api/v1/tasks' \
     -H 'X-API-Key: ffm_f2paiZBrDmnXE3TOTSNMatx1nvdxglc5DiNGGuWXf7A'
```

API keys work on every protected route, for example `/api/v1/tasks`, `/api/v1/presets` and `/metrics`. If a request has both an API key and basic auth credentials, FFmate only checks the API key.

::: info Note
- An unknown, rotated or deleted key gets `401` with `{"error":"invalid api key"}`.
- A key without the access level a route needs gets `403` with `{"error":"api key has insufficient access for this route"}`.
:::

### Access Levels

The access level restricts which routes an API key can call:

| Routes | `read` access | `write` access |
|---|---|---|
| `GET` on `/api/v1/tasks`, `/api/v1/batches`, `/api/v1/presets`, `/api/v1/watchfolders`, `/api/v1/webhooks`, `/api/v1/clients` and `/api/v1/settings` | allowed | allowed |
| `POST`, `PUT`, `PATCH` and `DELETE` on `/api/v1/tasks`, `/api/v1/batches`, `/api/v1/presets`, `/api/v1/watchfolders`, `/api/v1/webhooks`, `/api/v1/settings` and `/api/v1/debug` | `403` | allowed |
| Every route under `/api/v1/apikeys` | `403` | `403` |
| All other protected routes, e.g. `/metrics` | allowed | allowed |

An API key with `read` access can list and view tasks, presets, watchfolders and webhooks. Creating, changing, canceling, restarting or deleting them needs an API key with `write` access.

API keys can't manage API keys. Creating, listing, rotating and deleting them requires basic auth.

::: info Note
An API key with `write` access can create tasks, presets and watchfolders, and these can run commands on the computer FFmate runs on. Only give `write` access to applications that are allowed to do that.
:::

## Creating an API Key

To create an API key, send a `POST` request to `/api/v1/apikeys` using basic auth:

```sh
curl -X POST 'http://localhost:3000/api/v1/apikeys' \
     -u 'admin:a-long-random-password' \
     -H 'Content-Type: application/json' \
     -d '{
       "name": "Render farm scheduler",
       "access": "write"
     }'
```

FFmate returns the new API key. The full key is in `key`:

```json
{
  "createdAt": "2026-11-11T15:39:02.46341+01:00",
  "updatedAt": "2026-11-11T15:39:02.46341+01:00",
  "uuid": "f3388e7d-87ab-40b7-9fd6-4a1ab643ba61",
  "name": "Render farm scheduler",
  "access": "write",
  "prefix": "ffm_f2paiZBr",
  "key": "ffm_f2paiZBrDmnXE3TOTSNMatx1nvdxglc5DiNGGuWXf7A"
}
```

This response is the only time FFmate shows the full key. FFmate doesn't store the key itself, so a lost key can't be shown again. To get a new one, [rotate the API key](#rotating-an-api-key).

::: info Note
Requests without a `name`, or with an `access` other than `read` or `write`, are rejected with `422`.
:::

💡 Tip: To create an API key in the Web UI, see [Creating an API Key](/docs/web-ui.md#creating-an-api-key).

## API Key Properties

- **`name`** *[mandatory]* – Says who or what uses the key, e.g. `Render farm scheduler`. Up to 255 characters. Different API keys can have the same name.
- **`access`** *[mandatory]* – `read` or `write`. See [Access Levels](#access-levels).

The response adds these read-only fields:

- **`uuid`** – Identifies the API key in the routes below.
- **`prefix`** – The first 12 characters of the key, e.g. `ffm_f2paiZBr`. Every key starts with `ffm_`, and the rest of the prefix changes when the API key is rotated.
- **`key`** – The full key. FFmate returns it only when an API key is created or rotated.
- **`createdAt`** and **`updatedAt`** – When the API key was created and last changed. Rotating a key changes `updatedAt`.

## Listing API Keys

To list all API keys, send a `GET` request to `/api/v1/apikeys`:

```sh
curl 'http://localhost:3000/api/v1/apikeys?page=0&perPage=100' \
     -u 'admin:a-long-random-password'
```

- **`page`** *[optional]* – The page to return, starting at `0`. Default: `0`.
- **`perPage`** *[optional]* – How many API keys one page holds. Up to `100`. Default: `100`.

FFmate returns a JSON array of API keys, newest first, without `key`. The `X-Total` response header holds the total number of API keys.

```json
[
  {
    "createdAt": "2026-11-11T15:39:02.46341+01:00",
    "updatedAt": "2026-11-11T15:39:02.46341+01:00",
    "uuid": "f3388e7d-87ab-40b7-9fd6-4a1ab643ba61",
    "name": "Render farm scheduler",
    "access": "write",
    "prefix": "ffm_f2paiZBr"
  }
]
```

💡 Tip: To see all API keys in the Web UI, see [API Keys](/docs/web-ui.md#api-keys).

## Getting an API Key

To get one API key, send a `GET` request to `/api/v1/apikeys/{uuid}`:

```sh
curl 'http://localhost:3000/api/v1/apikeys/f3388e7d-87ab-40b7-9fd6-4a1ab643ba61' \
     -u 'admin:a-long-random-password'
```

FFmate returns the API key without the full `key`:

```json
{
  "createdAt": "2026-11-11T15:39:02.46341+01:00",
  "updatedAt": "2026-11-11T15:39:02.46341+01:00",
  "uuid": "f3388e7d-87ab-40b7-9fd6-4a1ab643ba61",
  "name": "Render farm scheduler",
  "access": "write",
  "prefix": "ffm_f2paiZBr"
}
```

If no API key has this `uuid`, FFmate responds with `400` and the message `api key for given uuid not found`.

## Rotating an API Key

Rotating generates a new key for an existing API key. Its `uuid`, `name` and `access` stay the same. To rotate an API key, send a `POST` request to `/api/v1/apikeys/{uuid}/rotate`:

```sh
curl -X POST 'http://localhost:3000/api/v1/apikeys/f3388e7d-87ab-40b7-9fd6-4a1ab643ba61/rotate' \
     -u 'admin:a-long-random-password'
```

FFmate returns the API key with the new `key`:

```json
{
  "createdAt": "2026-11-11T15:39:02.46341+01:00",
  "updatedAt": "2026-11-12T09:14:27.10523+01:00",
  "uuid": "f3388e7d-87ab-40b7-9fd6-4a1ab643ba61",
  "name": "Render farm scheduler",
  "access": "write",
  "prefix": "ffm_Q7xKp2Lm",
  "key": "ffm_Q7xKp2LmVt9RbN4sWcYhE1oJdZ6uAfG3iTnPq8vXkM0"
}
```

::: info Note
As soon as an API key is rotated, every application that still uses the previous key stops working at once.
:::

If no API key has this `uuid`, FFmate responds with `400` and the message `api key for given uuid not found`.

💡 Tip: To rotate an API key in the Web UI, see [Rotating an API Key](/docs/web-ui.md#rotating-an-api-key).

## Deleting an API Key

To delete an API key, send a `DELETE` request to `/api/v1/apikeys/{uuid}`:

```sh
curl -X DELETE 'http://localhost:3000/api/v1/apikeys/f3388e7d-87ab-40b7-9fd6-4a1ab643ba61' \
     -u 'admin:a-long-random-password'
```

FFmate responds with `204` No Content.

::: info Note
As soon as an API key is deleted, every application that still uses it stops working at once.
:::

If no API key has this `uuid`, FFmate responds with `400` and the message `api key for given uuid not found`.

💡 Tip: To delete an API key in the Web UI, see [Deleting an API Key](/docs/web-ui.md#deleting-an-api-key).
