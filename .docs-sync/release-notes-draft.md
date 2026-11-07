<!-- Release-notes draft for the next FFmate release. Not published.
     Release mode moves these entries into docs/release-notes.md under the real
     version and GitHub publish date. Keep the section order; leave empty sections. -->

### Breaking Changes

### New Features

- **FFmate Instance Labels in Task Details**
  The task details in the Web UI now show the labels of the FFmate instance that ran the task, next to its version, operating system and architecture. For details, see [Task Details](/docs/web-ui.md#task-details).
  <!-- commits: e39f91369 (ffmate-ui 0585d88ae) -->

### Changes

### Bug Fixes

- **Update Notice in the Web UI**
  The Web UI now shows **Update available** only when a newer FFmate version is out. Before, it showed the notice even when FFmate was up to date.
  <!-- commits: e39f91369 (ffmate-ui 0dcbe526f, 0f23f42a0) -->

- **FFmpeg Path After Startup**
  `GET /api/v1/clients` and the **Clients** page now show the full FFmpeg path, e.g. `/opt/homebrew/bin/ffmpeg`, as soon as FFmate starts. Before, the path stayed empty for up to 15 seconds, and the Web UI showed **FFmpeg not found** during that time. For details, see [Clients](/docs/web-ui.md#clients).
  <!-- commits: e39f91369 -->

- **Interrupted Tasks on Startup**
  With SQLite, FFmate no longer logs `failed to clean up running tasks on startup` when it starts again after a crash or stop. As before, the tasks that were running are set to `DONE_ERROR` with the error `client disconnected during execution`. For details, see [Clustering](/docs/clustering.md#when-an-ffmate-instance-fails).
  <!-- commits: 685ed7c8a -->
