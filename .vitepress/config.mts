import llmstxt from "vitepress-plugin-llms"
import { withMermaid } from "vitepress-plugin-mermaid"
import imageSizes from "./image-sizes"

const siteUrl = "https://docs.ffmate.io"

// https://vitepress.dev/reference/site-config
export default withMermaid({
  ignoreDeadLinks: true,

  // Also the suffix of every page title: "Tasks | FFmate Docs"
  title: "FFmate Docs",
  description:
    "Documentation for FFmate, the open-source FFmpeg automation server with a REST API, presets, watchfolders and webhooks.",

  srcExclude: ["README.md"],

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  mermaid: {},

  sitemap: {
    hostname: siteUrl,
  },

  // Per-page canonical URL and Open Graph tags
  transformHead({ pageData, siteData }) {
    if (pageData.isNotFound) return []
    const path = pageData.relativePath
      .replace(/(^|\/)index\.md$/, "$1")
      .replace(/\.md$/, "")
    const url = `${siteUrl}/${path}`
    // No " | FFmate Docs" suffix here: og:site_name already names the site,
    // and link previews cut titles after about 60 characters
    const title = pageData.title || siteData.title
    const description = pageData.description || siteData.description
    return [
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
    ]
  },

  head: [
    ["link", { rel: "icon", type: "image/webp", href: "/icon.webp" }],
    ["meta", { name: "theme-color", content: "#ff4052" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "en" }],
    ["meta", { property: "og:site_name", content: "FFmate" }],
    // Share image for link previews: 1200×630 PNG, the size X, LinkedIn,
    // Slack and Discord expect. PNG because LinkedIn doesn't show WebP.
    ["meta", { property: "og:image", content: `${siteUrl}/og-image.png` }],
    ["meta", { property: "og:image:type", content: "image/png" }],
    ["meta", { property: "og:image:width", content: "1200" }],
    ["meta", { property: "og:image:height", content: "630" }],
    [
      "meta",
      {
        property: "og:image:alt",
        content:
          "FFmate logo next to the text FFmate Docs, open-source FFmpeg automation server",
      },
    ],
    // X shows the image at full width only with summary_large_image.
    // It reads title, description and image from the og: tags.
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@ffmateio" }],
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
    siteTitle: "FFmate documentation",

    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/docs/getting-started" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "What Is FFmate", link: "/docs/what-is-ffmate" },
          { text: "Getting Started", link: "/docs/getting-started" },
          { text: "FAQ", link: "/docs/faq" },
        ],
      },
      {
        text: "FFmate Features",
        items: [
          { text: "Tasks", link: "/docs/tasks" },
          { text: "Wildcards", link: "/docs/wildcards" },
          { text: "Presets", link: "/docs/presets" },
          { text: "Watchfolders", link: "/docs/watchfolder" },
          { text: "Pre- and Post-Processing", link: "/docs/pre-post-prcessing" },
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
        text: "FFmate Community",
        items: [
          { text: "Community & Support", link: "/docs/ffmate-community" },
        ],
      },
      {
        text: "What's New",
        items: [
          { text: "Release Notes", link: "/docs/release-notes" },
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
        'Released under the <a href="https://opensource.org/license/agpl-v3" target="_blank" rel="noopener">AGPL-3.0 License</a> · Sponsored by <a href="https://moovit.de" target="_blank" rel="noopener">MoovIT GmbH</a>',
      copyright: "Copyright © 2025-present we love media",
    },
  },

  vite: {
    plugins: [
      llmstxt({ domain: siteUrl, ignoreFiles: ["README.md"] }),
      imageSizes(),
    ],
    build: {
      rollupOptions: {
        external: ['../todo', '../README.md']
      }
    }
  }
})
