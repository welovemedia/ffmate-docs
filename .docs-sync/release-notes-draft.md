<!-- Release-notes draft for the next FFmate release. Not published.
     Release mode moves these entries into docs/release-notes.md under the real
     version and GitHub publish date. Keep the section order; leave empty sections. -->

### Breaking Changes

### New Features

- **API Keys**
  With `--basic-auth` on, scripts and other programs can call the REST API with an API key in the `X-API-Key` header instead of the username and password. Each key has the access level `read` or `write` and can be rotated or deleted on its own, through `/api/v1/apikeys` or the new **API keys** page in the Web UI. For details, see [API Keys](/docs/api-keys.md).
  <!-- commits: a348f393a (ffmate-ui cb3f2e6ec) -->

- **FFmate Instance Labels in Task Details**
  The task details in the Web UI now show the labels of the FFmate instance that ran the task, next to its version, operating system and architecture. For details, see [Task Details](/docs/web-ui.md#task-details).
  <!-- commits: e39f91369 (ffmate-ui 0585d88ae) -->

### Changes

### Bug Fixes

- **Update Notice in the Web UI**
  The Web UI no longer shows **Update available** when FFmate already runs the newest release. Before, it showed the notice on every version.
  <!-- commits: e39f91369 (ffmate-ui 0dcbe526f, 0f23f42a0) -->

- **FFmpeg Path After Startup**
  `GET /api/v1/clients` and the **Clients** page now show the full FFmpeg path, e.g. `/opt/homebrew/bin/ffmpeg`, as soon as FFmate starts. Before, the path stayed empty for up to 15 seconds, and the Web UI showed **FFmpeg not found** during that time. For details, see [Clients](/docs/web-ui.md#clients).
  <!-- commits: e39f91369 -->

- **Interrupted Tasks on Startup**
  With SQLite, FFmate no longer logs `failed to clean up running tasks on startup` when it starts again after a crash or stop. As before, the tasks that were running are set to `DONE_ERROR` with the error `client disconnected during execution`. For details, see [Clustering](/docs/clustering.md#when-an-ffmate-instance-fails).
  <!-- commits: 685ed7c8a -->
