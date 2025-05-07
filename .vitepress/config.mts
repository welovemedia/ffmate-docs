import { withMermaid } from "vitepress-plugin-mermaid"

// https://vitepress.dev/reference/site-config
export default withMermaid({
  ignoreDeadLinks: true,

  title: "FFmate documentation",
  description: "Documentation for FFmate",

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
        content: "ffmate | A wrapper around ffmpeg",
      },
    ],
    ["meta", { property: "og:site_name", content: "ffmate" }],
    [
      "meta",
      {
        property: "og:image",
        content: "https://docs.ffmate.io/icon.webp",
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
      { text: "Examples", link: "/docs/what-is-ffmate" },
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
        text: "FFmate in action",
        items: [
          { text: "Tasks", link: "/docs/tasks" },
          { text: "Wildcards", link: "/docs/wildcards" },
          { text: "Presets", link: "/docs/presets" },
          { text: "Pre and Post processing", link: "/docs/pre-post-prcessing" },
          { text: "Watchfolder", link: "/docs/watchfolder" },
          { text: "Webhooks", link: "/docs/webhooks" },
          { text: "Web UI", link: "/docs/web-ui" },
        ],
      },
      {
        text: "Advanced",
        items: [
          { text: "FFmate Internals", link: "/docs/ffmate-internals" },
          { text: "Debugging", link: "/docs/debugging" },
          { text: "Swagger", link: "/docs/swagger" },
          { text: "Flags", link: "/docs/flags" },
        ],
      },
    ],

    search: {
      provider: "local",
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/welovemedia/ffmate" },
    ],

    editLink: {
      pattern: "https://github.com/welovemedia/ffmate-docs/edit/main/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message: "Released under the SSPL License.",
      copyright: "Copyright © 2025-present we love media",
    },
  },
})
