import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router.js'
//导入全局样式表
import './assets/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'


import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

Vue.config.devtools = true

import echarts from 'echarts'

Vue.prototype.$echarts = echarts

// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
//配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config=>{
  NProgress.done()
  return config;
})


Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
