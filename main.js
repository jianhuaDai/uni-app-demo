import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import util from './utils/index.js'
import api from '@/services/index.js'

Vue.prototype.$store = store //vuex数据
Vue.prototype.$util = util // 工具类函数
Vue.prototype.$api = api // 接口函数


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
