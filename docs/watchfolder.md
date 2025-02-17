# Watchfolders

FFmate's **watchfolder** feature allows you to **automatically detect and process new files** in a specified directory. Once a watchfolder is configured, FFmate will **continuously scan** the folder for new or modified files and create **tasks** to process them based on a task preset. The watchfolder feature is useful for automatically transcoding footage from a camera SD card dropped into a network share or creating low-resolution versions of high-resolution files exported from an NLE for review.

---

## 🔧 How Watchfolders Work:

1. **Monitor a Folder** – FFmate scans the specified directory at a set interval.  
2. **Detect New Files** – When a new file is detected, FFmate ensures it’s **fully copied** before processing.   
3. **Create Tasks** – FFmate creates a **new FFmate task** for each detected file.  

---

## 🛠️ Creating a Watchfolder  

To configure a watchfolder, send a `POST` request to the API:

```sh
curl -X POST http://localhost:3000/api/v1/watchfolders \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Camera Card Watch",
       "description": "Automatically processes camera footage",
       "interval": 10,
       "growthChecks": 3,
       "preset": "cabfad2c-70d1-4df6-9267-f549a376301f",
       "path": "/volumes/media/camera_cards",
       "filter": {
         "extensions": {
           "include": ["mp4", "mov"],
           "exclude": ["tmp", "log"]
         }
       }
     }'
```

## 📌 Watchfolder Properties:

- **`name`** – A unique name for the watchfolder.  
- **`description`** – Optional description of what this watchfolder does.  
- **`interval`** – How often (in seconds) FFmate scans the folder for new files.  
- **`growthChecks`** – The number of checks FFmate performs to ensure a file is fully copied before processing.  
- **`preset`** – The ID of a predefined transcoding **preset** that will be applied to detected files.  
- **`path`** – The **absolute path** of the directory to monitor.  
- **`filter`** – Rules for file selection:  
  - **`include`** – Only process files with these extensions (e.g., `mp4`, `mov`).  
  - **`exclude`** – Ignore files with these extensions (e.g., `tmp`, `log`).  

---

## 🔄 How File Detection Works:

FFmate ensures that only **fully copied** files are processed by using a **growth check validation**:  

1. A file is detected in the watchfolder.  
2. FFmate checks its **size**.  
3. If the size remains the same after multiple scans (determined by `growthChecks`), the file is processed.  
4. If the file is **still growing**, FFmate waits and continues checking until it stops changing.  

This prevents **incomplete** files from being prematurely processed.  

---

## 🛑 Deleting a Watchfolder  

To remove a watchfolder, send a `DELETE` request:

```sh
curl -X DELETE http://localhost:3000/api/v1/watchfolders/{watchfolderId} \
     -H "accept: application/json"
```

---

### 📋 List All Watchfolders  

```sh
curl -X GET http://localhost:3000/api/v1/watchfolders
```

### 🏷️ Get Watchfolder Details  

```sh
curl -X GET http://localhost:3000/api/v1/watchfolders/{watchfolderId}
```

### ✏️ Update a Watchfolder  

```sh
curl -X PATCH http://localhost:3000/api/v1/watchfolders/{watchfolderId} \
     -H "Content-Type: application/json" \
     -d '{
       "interval": 15,
       "filter": {
         "include": ["mp4", "avi"]
       }
     }'
```

---