import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载 Vant
import Vant from 'vant'
import 'vant/lib/index.css'

import 'amfe-flexible'
import './utils/dayjs'

// 引入全局样式
import './styles/index.less'
// 加载注册 vant组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
