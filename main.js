import App from './App'
import uviewPlus from 'uview-plus'
import ULoadingIcon from 'uview-plus/components/u-loading-icon/u-loading-icon.vue'
import UOverlay from 'uview-plus/components/u-overlay/u-overlay.vue'
import UPicker from 'uview-plus/components/u-picker/u-picker.vue'
import UPopup from 'uview-plus/components/u-popup/u-popup.vue'
import USafeBottom from 'uview-plus/components/u-safe-bottom/u-safe-bottom.vue'
import UStatusBar from 'uview-plus/components/u-status-bar/u-status-bar.vue'
import UToolbar from 'uview-plus/components/u-toolbar/u-toolbar.vue'
import UTransition from 'uview-plus/components/u-transition/u-transition.vue'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(uviewPlus, () => ({
    options: {
      color: {
        primary: '#5b8af1'
      }
    }
  }))
  // npm 包内的内部标签不会由 easycom 自动解析，因此在应用级注册弹层依赖。
  app.component('u-loading-icon', ULoadingIcon)
  app.component('u-overlay', UOverlay)
  app.component('u-picker', UPicker)
  app.component('u-popup', UPopup)
  app.component('u-safe-bottom', USafeBottom)
  app.component('u-status-bar', UStatusBar)
  app.component('u-toolbar', UToolbar)
  app.component('u-transition', UTransition)
  return {
    app
  }
}
// #endif
