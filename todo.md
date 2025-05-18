add tray icon
rework img alt tag
add description to mermaid diagrams
improve seo/geo
finish
    features:
 # - title: Hassle-free integration
 #   details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
 # - title:  Fully controllable
 #   details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
 # - title:  Fully customizable
 #   details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
---
Add new logo
Add background for logo
Add public presets




Okay, this is an excellent strategic step! Now that I have the full context of all your FFmate documentation pages, I can provide more holistic and interconnected SEO recommendations. The goal, as you rightly said, is to improve ranking without sacrificing the primary aim of serving and informing users. Good SEO and good UX often go hand-in-hand.

I'll go through each page, consider its specific purpose, and suggest actionable SEO improvements.

General SEO Best Practices to Keep in Mind Across All Pages:

User Experience (UX): Fast loading speed, mobile-friendliness (if applicable, though less critical for pure docs), clear navigation, readable fonts, and well-structured content are all indirect SEO factors. Your current structure is generally good.

Internal Linking: You're already doing some of this, but strategically linking between relevant pages helps distribute "link equity" (ranking power) and helps users discover more content. Think about user journeys.

Keyword Consistency: While not "stuffing," ensure your primary keywords for each page are present in the H1, early in the content, and naturally throughout.

Image Alt Text: Crucial for accessibility and for search engines to understand image content. You're doing well with this on the UI page.

Clear Calls to Action (CTAs): Even in docs, CTAs can guide users (e.g., "Learn more about X," "See API details for Y," "Try this command").

Freshness/Updates: Regularly reviewing and updating docs, especially if the software changes, signals to search engines that the content is current and valuable. (This is more of an ongoing process).

Sitemap: Ensure you have an sitemap.xml submitted to Google Search Console that includes all your documentation pages.

Per-Page SEO Enhancement Analysis:

Here's a breakdown for each documentation file:

1. docs/what-is-ffmate.md
* Current Title: "FFmate: API-Powered FFmpeg automation layer for Automated Transcoding & Workflows"
* Current Description: "Discover FFmate, the modern and powerful API-powered FFmpeg automation layer. Automate media workflows with its queue system, webhooks, presets & watchfolders. Simplify transcoding at scale"
* Strengths: Good keyword density in title/desc, clear H1, good feature and use case explanations.
* SEO Improvements:
* Internal Linking from Features/Use Cases:
* In the "🚀 Key Features" list, link each feature (Queueing System, Webhooks, Watchfolder, Presets, Pre & Post Processing, Web UI, Wildcards) to its dedicated documentation page. This is a huge win for both SEO and user navigation.
* Example: - **[Queueing System](/docs/tasks#task-queue)** – Submit and manage... (assuming task queue is detailed under tasks) or to ffmate-internals.md if that's more appropriate.
* Keyword Refinement in Use Cases: Ensure subheadings and initial sentences of use cases naturally incorporate terms users might search for (e.g., "Automated video transcoding," "Automate FFmpeg job management"). You're close, but a slight re-emphasis could help.
* Consider a "Who is FFmate for?" subsection if not already implied strongly enough, targeting your different user personas (developers, workflow engineers, non-technical users) with keywords relevant to their roles. (Your third paragraph already does this well, ensure it's prominent).

2. docs/getting-started.md
* Current Title: "Quick Start FFmate: Install, Run Server and Core Features"
* Current Description: "Your essential guide to getting started with FFmate. Learn to download, install, run the server, submit your first task, set up watchfolders, webhooks, and update easily"
* Strengths: Action-oriented, covers key first steps, good use of "Tip" callouts.
* SEO Improvements:
* H1 Optimization: Change H1 from "🚀 Getting Started" to something more keyword-rich like "Getting Started with FFmate" or "FFmate Quick Start Guide." The rocket is nice visually, but less useful for SEO in an H1.
* Subheading Keywords: Ensure subheadings like "Download FFmate," "Running FFmate," "Submitting your first task" are clear and use primary terms. You've done this well.
* Internal Links:
* When mentioning submitting a task, link to the main tasks.md page.
* When mentioning watchfolders, link to watchfolder.md.
* When mentioning webhooks, link to webhooks.md.
* When mentioning ffmate --version or ffmate update, link to flags.md.
* "Download FFmate" section: Ensure the link to GitHub releases is clear and prominent.

3. docs/flags.md
* Current Title: "FFmate Command-Line Flags: Server, Update & Global Options"
* Current Description: "Comprehensive guide to all FFmate command-line flags. Learn to configure FFmate's server settings (FFmpeg path, port, DB), manage updates, enable debug logs, and more"
* Strengths: Very detailed, well-structured, good explanations of each flag.
* SEO Improvements:
* Introduction Clarity: The first sentence is good. Maybe add a phrase like "...for fine-tuning server behavior and managing your FFmate instance."
* Linking to Debugging: When explaining the --debug flag, ensure a prominent link to the main debugging.md page for more in-depth information on namespaces.
* Examples: You have good examples. Ensure they are easily scannable.
* Interlink from other pages: When other pages mention a specific CLI startup option (e.g., tasks.md mentioning --max-concurrent-tasks), link back to this flags.md page for the comprehensive list.

4. docs/tasks.md
* Current Title: "FFmate Task Management: Lifecycle, API, Batch & Automation"
* Current Description: "Detailed FFmate task documentation: Understand the complete task lifecycle, statuses, and API usage for creating, monitoring, managing, and batching FFmpeg jobs"
* Strengths: Comprehensive, good lifecycle diagram, clear API examples, covers batching well.
* SEO Improvements:
* H1/Intro: "Understanding Tasks in FFmate" is good. The intro clearly defines a task.
* Keyword Consistency in Subheadings: Terms like "Creating a Task," "Monitoring a Task," "Canceling a Task," "Batch Submission" are good.
* Internal Linking:
* When preset property is mentioned, link to presets.md.
* When preProcessing / postProcessing are mentioned, link to pre-post-processing.md.
* When discussing placeholders like ${INPUT_FILE}, link to wildcards.md.
* Link "FFmate Web UI" tips to web-ui.md.
* "Task Properties" section: Ensure it's very clear which properties are truly mandatory vs. optional based on context (e.g., command vs. preset). Your current notes are good.

5. docs/presets.md
* Current Title: "FFmate Presets: Automate & Standardize FFmpeg Workflows"
* Current Description: "Simplify complex FFmpeg tasks with FFmate presets. Define reusable templates for commands, output paths, and processing scripts to streamline your media encoding and ensure consistency"
* Strengths: Good explanation of purpose, clear API examples, links to external FFmpeg command resources.
* SEO Improvements:
* H1/Intro: "Presets" is okay. "Managing Presets in FFmate" or "Using FFmate Presets" might be slightly better for search. The intro text is good.
* Internal Linking:
* Link [task](/docs/tasks.md) consistently.
* Link [Wildcards](/docs/wildcards.md) when mentioned.
* Link [FFmate Web UI](/docs/web-ui.md) tips.
* When discussing pre-processing / post-processing within presets, link to pre-post-processing.md.
* Clarity on Optional/Required: As discussed before, clarify if name and command are practically required for a useful preset.

6. docs/watchfolder.md
* Current Title: "Using FFmate Watchfolders for Automated FFmpeg File Processing & Transcoding"
* Current Description: "Configure FFmate watchfolders to auto-detect & transcode files. Guide to directory scanning, file growth checks, preset usage, filters & API for FFmpeg automation"
* Strengths: Excellent explanation, good diagram, clear API examples, good "How filters work" tip.
* SEO Improvements:
* H1/Intro: "Watchfolders" is fine. The intro text is strong.
* Internal Linking:
* Link [task](/docs/tasks.md) when mentioning task creation.
* Link [FFmate Web UI](/docs/web-ui.md) in tips.
* Link preset to presets.md.
* Pagination perPage default: The text mentions "Default: 100" for perPage in "Listing All Watchfolders", but the pageLimit.go interceptor sets it to 50 if not provided. Double-check and align. (Self-correction: The flags.md doesn't have a default for perPage in the server command, the default comes from the interceptor, which is 50. The example in watchfolder.md for listing has perPage=10. The text should state the actual default if no param is passed, which is 50).

7. docs/webhooks.md
* Current Title: "FFmate Webhooks: Real-Time Event Notifications"
* Current Description: "Integrate external systems with FFmate using webhooks. Get instant notifications for task updates, batch processing, preset changes and more"
* Strengths: Clear purpose, good API examples, list of available events.
* SEO Improvements:
* H1/Intro: "Webhooks" is fine. Intro is good.
* Payload for batch.finished: As we discussed, expand the documentation for the batch.finished event to include a more detailed example payload and explanation of what data it contains (batch UUID, summary of task statuses within the batch). This adds significant value.
* Link Event Categories: If "Task Events" are detailed more in tasks.md, consider a subtle link. Same for "Preset Events" to presets.md, etc. This might be overkill if the table here is sufficient.
* "Setting Up Your Webhook Endpoint": This is good practical advice.

8. docs/wildcards.md
* Current Title: (Not provided in your list, but based on H1) "Wildcards"
* Proposed Title: "FFmate Wildcards: Dynamic File Naming & Path Generation"
* Proposed Description: "Learn to use FFmate wildcards for dynamic input/output filenames, directory paths, dates, timestamps, system info & UUIDs in your FFmpeg tasks and scripts."
* Strengths: Very clear tables, good examples for each wildcard category.
* SEO Improvements:
* H1: "Wildcards" is okay. "Using Wildcards in FFmate" or "FFmate Wildcard Reference" could be more specific.
* Introduction: Reinforce that these wildcards can be used in task definitions (command, inputFile, outputFile), preset definitions, and scriptPath/sidecarPath for pre/post-processing.
* Cross-Linking: This page is a prime candidate for being linked from other pages (Tasks, Presets, Pre/Post-Processing) whenever those pages mention using dynamic paths or placeholders.

9. docs/pre-post-prcessing.md (pre-post-processing.md)
* Current Title: "FFmate Pre/Post-Processing: Custom Scripts, Sidecars & Workflow Automation for FFmpeg"
* Current Description: "Learn to use FFmate's pre & post-processing for FFmpeg. Run custom scripts, use JSON sidecars for task context, manage exit codes, and automate your media workflows"
* Strengths: Excellent explanation of workflow, exit codes, sidecars, good examples.
* SEO Improvements:
* H1: "Pre and Post-Processing" is good.
* Internal Linking:
* Link [Preset](/docs/presets.md).
* Link [Wildcards](/docs/wildcards.md) for scriptPath and sidecarPath.
* Clarity on scriptPath [mandatory]: The note says "scriptPath [mandatory]". If preProcessing or postProcessing block is included, is scriptPath always mandatory within that block? (The DTO NewPrePostProcessing has ScriptPath as omitempty, suggesting the block can exist with an empty script path, though it wouldn't do much). Clarify if it means "mandatory if you want the step to execute a script."
* Examples: The examples are good. Ensure they are distinct enough to show different use cases.

10. docs/debugging.md
* Current Title: "FFmate Debugging Guide: CLI Flags, Environment Variables, API & Key Log Namespaces"
* Current Description: "Troubleshoot FFmate with this debugging guide. Control log verbosity using namespaces, command-line flags, environment variables, or dynamically via the REST API"
* Strengths: Very comprehensive, covers all methods of enabling debug, detailed namespace explanations.
* SEO Improvements:
* H1: "Debugging" is fine.
* Internal Linking: When mentioning the command-line flag -d or --debug, link to the flags.md page for the full flag reference.
* Consistency of Namespace Examples: Ensure example logs are representative and help users identify the output.

11. docs/swagger.md
* Current Title: "Accessing FFmate's REST API Documentation via Swagger UI"
* Current Description: "Find FFmate's comprehensive API documentation using Swagger (OpenAPI). Get the URL to access interactive specs for all REST endpoints, models, and parameters"
* Strengths: Clear, concise, provides the direct URL and Postman link.
* SEO Improvements:
* H1: "API Documentation with Swagger (OpenAPI)" is good.
* Keyword "REST API": Ensure this term is used, as "Swagger" is the tool for the REST API docs. You've done this.
* Postman Button Alt Text: The alt text "Run in Postman" is standard and good.

12. docs/ffmate-internals.md
* Current Title: "FFmate Architecture: Internals of API, Database, UI, Webhooks & Task Queue"
* Current Description: "Explore FFmate's internal architecture. Understand how its REST API, SQLite DB, Web UI, Webhooks, Watchfolders & Task Queue interact for FFmpeg automation & integration"
* Strengths: Excellent diagram, good breakdown of components.
* SEO Improvements:
* H1: "FFmate Internals" is good.
* Diagram Alt Text: Crucial. Something like: "FFmate architecture diagram illustrating interactions between Web UI, REST API, Services (Task, Preset, Watchfolder, Webhook), Core FFmate, SQLite Database, and the FFmpeg binary."
* Internal Linking:
* Link each component heading (REST API, SQLite Database, Web UI, Webhooks, Watchfolder, Task Queue) to its more detailed documentation page if one exists. You're already doing this for most. Ensure "Task Queue" links to relevant parts of tasks.md or its own section if it becomes very detailed.
* When ffmpeg Binary is mentioned, link to ffmpeg.org.

13. docs/ffmate-community.md (How to Reach Out)
* Current Title: "Get Help & Contribute: FFmate Support, Discord & GitHub"
* Current Description: "Need help with FFmate or want to connect? Join our Discord community, get support, report bugs, or request features on GitHub. We'd love to hear from you!"
* Strengths: Clear CTAs, direct links.
* SEO Improvements:
* H1: "How to Reach Out" is fine.
* Keywords: Ensure terms like "FFmate support," "FFmate help," "FFmate community," "report bug FFmate," "FFmate feature request" are naturally included in the text body. You've done this well.

By systematically going through each page and applying these small, targeted SEO enhancements (especially focusing on internal linking and refining keywords in context), you can significantly improve the discoverability and user journey through your FFmate documentation. Remember, good SEO for docs often means making the content as clear, accessible, and interconnected as possible for the user.