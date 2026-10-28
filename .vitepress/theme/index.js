import DefaultTheme from "vitepress/theme"
import ZoomImg from "./components/zoomImage.vue"
import "./custom.css"

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    // keep the default theme's global components, such as <Badge>
    DefaultTheme.enhanceApp?.(ctx)
    ctx.app.component("ZoomImg", ZoomImg)
  },
}
