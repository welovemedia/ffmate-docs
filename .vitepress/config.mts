import llmstxt from "vitepress-plugin-llms"
import { withMermaid } from "vitepress-plugin-mermaid"

// https://vitepress.dev/reference/site-config
export default withMermaid({
  ignoreDeadLinks: true,

  title: "FFmate documentation",
  description:
    "Documentation for FFmate.io - FFmpeg Automation for the Modern Stack",

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  mermaid: {},

  sitemap: {
    hostname: "https://docs.ffmate.io",
  },

  head: [
    ["link", { rel: "icon", type: "image/webp", href: "/icon.webp" }],
    ["meta", { name: "theme-color", content: "#ff4052" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "en" }],
    [
      "meta",
      {
        property: "og:title",
        content: "FFmate | FFmpeg Automation for the Modern Stack",
      },
    ],
    ["meta", { property: "og:site_name", content: "FFmate" }],
    [
      "meta",
      {
        property: "og:image",
        content: "https://docs.ffmate.io/icon_16x9.webp",
      },
    ],
    ["meta", { property: "og:url", content: "https://ffmate.io/" }],
    [
      "script",
      {
        src: "https://cloud.umami.is/script.js",
        "data-website-id": "c08ccbea-5535-446a-9af4-5a90796ef160",
        defer: "",
      },
    ],
  ],

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/docs/getting-started" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "What is FFmate", link: "/docs/what-is-ffmate" },
          { text: "Getting Started", link: "/docs/getting-started" },
        ],
      },
      {
        text: "FFmate Features",
        items: [
          { text: "Tasks", link: "/docs/tasks" },
          { text: "Wildcards", link: "/docs/wildcards" },
          { text: "Presets", link: "/docs/presets" },
          { text: "Watchfolder", link: "/docs/watchfolder" },
          { text: "Pre and Post processing", link: "/docs/pre-post-prcessing" },
          { text: "Clustering", link: "/docs/clustering" },
          { text: "Webhooks", link: "/docs/webhooks" },          
          { text: "Web UI", link: "/docs/web-ui" },
        ],
      },
      {
        text: "Advanced Features",
        items: [          
          { text: "FFmate Internals", link: "/docs/ffmate-internals" },
          { text: "Debugging", link: "/docs/debugging" },
          { text: "Swagger", link: "/docs/swagger" },
          { text: "Flags", link: "/docs/flags" },
        ],
      },
      {
        text: "FFmate Communnity",
        items: [
          { text: "Community & Support", link: "/docs/ffmate-community.md" },
        ],
      },
      {
        text: "What's New",
        items: [
          { text: "Release Notes", link: "/docs/release-notes.md" },
        ],
      },
    ],

    search: {
      provider: "local",
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/welovemedia/ffmate" },
      { icon: "youtube", link: "https://www.youtube.com/@ffmate-k4k" },
      { icon: "x", link: "https://x.com/ffmateio" },
      { icon: "medium", link: "https://ffmate.medium.com/" },
      { icon: "discord", link: "https://discord.gg/NzfeHn37jT" },
    ],

    editLink: {
      pattern: "https://github.com/welovemedia/ffmate-docs/edit/main/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message:
        'Released under the <a href="https://opensource.org/license/agpl-v3" target="_blank" rel="noopener">AGPL-3.0 License</a>',
      copyright: "Copyright © 2025-present we love media",
    },
  },

  vite: {
    plugins: [llmstxt({})],
    build: {
      rollupOptions: {
        external: ['../todo', '../README.md']
      }
    }
  }
})
