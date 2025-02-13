import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  ignoreDeadLinks: true,
  title: "ffmate docs",
  description: "Documentation for ffmate",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/docs/what-is-ffmate' }
    ],

    sidebar: [
      {
        text: 'Welcome',
        items: [
          { text: 'What is FFmate', link: '/docs/what-is-ffmate' },
          { text: 'Getting Started', link: '/docs/getting-started' }
        ]
      }

    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/welovemedia/ffmate' }
    ],

    editLink: {
      pattern: 'https://github.com/welovemedia/ffmate-docs/edit/main/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'Released under the SSPL License.',
      copyright: 'Copyright © 2025-present we love media'
    }
  }
})
