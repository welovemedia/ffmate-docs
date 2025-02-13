import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ffmate docs",
  description: "Documentation for ffmate",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
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
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
