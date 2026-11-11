---
title: "FFmate API Keys: Call the REST API Without a Password"
description: "Create, rotate and delete FFmate API keys. With --basic-auth on, a key in the X-API-Key header lets scripts call the REST API with read or write access."
---

# API Keys

An **API key** lets a script or another program call the FFmate REST API without the username and password of [`--basic-auth`](/docs/flags.md#basic-auth). Each key has a name and an access level, `read` or `write`. A key can be rotated or deleted on its own, so the password stays the same for everyone else.

API keys only work when FFmate runs with `--basic-auth`. Without it, the API needs no credentials, and every `/api/v1/apikeys` endpoint responds with `412` and the message `this route requires basic auth to be enabled`.

API keys are saved in the database. In a [cluster](/docs/clustering.md), a key works on every FFmate instance that runs with `--basic-auth`.

## Using an API Key

Send the key in the `X-API-Key` header with every request:

```sh
curl 'http://localhost:3000/api/v1/tasks' \
     -H 'X-API-Key: ffm_f2paiZBrDmnXE3TOTSNMatx1nvdxglc5DiNGGuWXf7A'
```

A key works on every route that `--basic-auth` protects, for example `/api/v1/tasks`, `/health` and `/metrics`. If a request has both an `X-API-Key` header and a username and password, FFmate only checks the API key.

An unknown, rotated or deleted key gets `401` with `{"error":"invalid api key"}`. A key without the access level a route needs gets `403` with `{"error":"api key has insufficient access for this route"}`.

### Access Levels

The access level decides which routes a key can call:

| Routes | `read` key | `write` key |
|---|---|---|
| `GET /api/v1/presets` and `GET /api/v1/presets/{uuid}` | allowed | allowed |
| `POST`, `PUT` and `DELETE` on `/api/v1/presets` | `403` | allowed |
| Every route under `/api/v1/apikeys` | `403` | `403` |
| All other routes, e.g. `/api/v1/tasks`, `/api/v1/watchfolders`, `/api/v1/webhooks`, `/health` and `/metrics` | allowed | allowed |

Only the preset routes tell `read` and `write` apart. A `read` key can create, cancel and delete tasks, and create watchfolders and webhooks. Anyone who can create a task, preset or watchfolder can run commands on the computer FFmate runs on. Give a `read` key only to programs that may do that.

API keys can't manage API keys. Creating, listing, rotating and deleting them needs the username and password.

## Creating an API Key

To create an API key, send a `POST` request to `/api/v1/apikeys` with the username and password of `--basic-auth`:

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

Requests without a `name`, or with an `access` other than `read` or `write`, are rejected with `422`.

💡 Tip: To create an API key in the Web UI, see [Creating an API Key](/docs/web-ui.md#creating-an-api-key).

## API Key Properties

- **`name`** *[mandatory]* – Says who or what uses the key, e.g. `Render farm scheduler`. Up to 255 characters. Two keys can have the same name.
- **`access`** *[mandatory]* – `read` or `write`. See [Access Levels](#access-levels).

The response adds these read-only fields:

- **`uuid`** – Identifies the API key in the routes below.
- **`prefix`** – The first 12 characters of the key, e.g. `ffm_f2paiZBr`. Every key starts with `ffm_`. The prefix tells keys apart in lists and in the Web UI.
- **`key`** – The full key. Only the responses of creating and rotating an API key contain it.
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

FFmate returns the API key in the same form as in the list, without `key`. If no API key has this `uuid`, FFmate responds with `400` and the message `api key for given uuid not found`.

## Rotating an API Key

Rotating gives an API key a new secret key. Its `uuid`, `name` and `access` stay the same. To rotate an API key, send a `POST` request to `/api/v1/apikeys/{uuid}/rotate`:

```sh
curl -X POST 'http://localhost:3000/api/v1/apikeys/f3388e7d-87ab-40b7-9fd6-4a1ab643ba61/rotate' \
     -u 'admin:a-long-random-password'
```

FFmate returns the API key with the new `key` and `prefix`, in the same form as when it was created. The previous key stops working at once. If no API key has this `uuid`, FFmate responds with `400`.

💡 Tip: To rotate an API key in the Web UI, see [Rotating an API Key](/docs/web-ui.md#rotating-an-api-key).

## Deleting an API Key

To delete an API key, send a `DELETE` request to `/api/v1/apikeys/{uuid}`:

```sh
curl -X DELETE 'http://localhost:3000/api/v1/apikeys/f3388e7d-87ab-40b7-9fd6-4a1ab643ba61' \
     -u 'admin:a-long-random-password'
```

FFmate responds with a `204` No Content status. The key stops working at once, and programs that use it get `401`. If no API key has this `uuid`, FFmate responds with `400`.

💡 Tip: To delete an API key in the Web UI, see [Deleting an API Key](/docs/web-ui.md#deleting-an-api-key).
