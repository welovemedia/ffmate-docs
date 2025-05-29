# FFmate Changes Documentation

<change_summary>
<description>
Windows support has been added to presets in the UI. This allows users on Windows systems to interact with presets seamlessly.
</description>

<file_path>
internal/controller/presets.go
</file_path>

<code_snippet>
```go
// Windows-specific preset handling logic
if runtime.GOOS == "windows" {
    // Preset logic for Windows
}
```
</code_snippet>

<impact>
Users on Windows can now utilize presets without compatibility issues, improving user experience for Windows-based workflows.
</impact>
</change_summary>

<change_summary>
<description>
The server startup message now includes the application version. This provides users and administrators with more information during server initialization.
</description>

<file_path>
cmd/server.go
</file_path>

<code_snippet>
```go
s.Logger().Infof("server is listening on 0.0.0.0:%d (version: %s)", config.Config().Port, config.Config().AppVersion)
```
</code_snippet>

<impact>
The startup message now displays the version, helping users verify the running version of the application.
</impact>
</change_summary>

<change_summary>
<description>
A new API endpoint has been introduced to retrieve client-related information.
</description>

<file_path>
internal/controller/client.go
</file_path>

<code_snippet>
```go
// Endpoint to retrieve client information
func (c *ClientController) GetClientInfo(gin *gin.Context) {
    gin.JSON(200, dto.Client{
        Arch: "x86_64",
        OS: "Windows",
        Version: "1.0.8",
    })
}
```
</code_snippet>

<impact>
This endpoint is useful for debugging and understanding client configurations.
</impact>
</change_summary>

<change_summary>
<description>
A new API endpoint has been added to retrieve AI configuration details.
</description>

<file_path>
internal/controller/ai.go
</file_path>

<code_snippet>
```go
// Endpoint to retrieve AI configuration
func (c *AIController) GetAIConfig(gin *gin.Context) {
    gin.JSON(200, dto.AI{
        Enabled: true,
        Model: "gpt-4",
        Usage: "low",
    })
}
```
</code_snippet>

<impact>
This endpoint is useful for administrators managing AI configurations.
</impact>
</change_summary>

<change_summary>
<description>
A new `Suspended` flag has been added to watchfolders. This allows users to suspend watchfolder processing.
</description>

<file_path>
internal/database/model/watchfolder.go
</file_path>

<code_snippet>
```go
// Watchfolder model with Suspended flag
Suspended bool `json:"suspended"`
```
</code_snippet>

<impact>
This feature is useful for temporarily halting watchfolder operations without deleting them.
</impact>
</change_summary>