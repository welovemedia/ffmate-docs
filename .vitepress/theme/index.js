import DefaultTheme from "vitepress/theme"
import ZoomImg from "./components/zoomImage.vue"
import "./custom.css"

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("ZoomImg", ZoomImg)
  },
}
