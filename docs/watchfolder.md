### 📌 Watchfolder properties:

- **`name`**: A unique name for the watchfolder.
- **`description`**: A brief description of its purpose.
- **`interval`**: Time (in seconds) between folder scans.
- **`growthChecks`**: Number of times a file is checked to ensure it's fully copied before processing.
- **`preset`**: The ID of a predefined transcoding preset to apply.
- **`path`**: The absolute path of the folder to monitor.
- **`filter`**: Rules for file selection.
  - **`include`**: List of file extensions to process (e.g., `mp4`, `mov`).
  - **`exclude`**: List of file extensions to ignore (e.g., `tmp`, `log`).