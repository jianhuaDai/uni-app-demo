import request from "./ajax.js"
import util from '@/utils/index.js'
import vuex from '@/store/index.js'

// 前置数据预处理
const ajax = (options) => {
	//console.log(vuex.state, 'vuex.state')
	return util.to(request({
		prefix: 'https://robot.guiji.ai:4433', // https://robot.guiji.ai:4433 https://172.16.103.12
		...options
	}))
}
import Login from './login.js' // 和用户登陆验证有关的接口
import Communicate from './communicate.js' // 用户交互聊天接口

export default {
	Login: Login(ajax), 
	Communicate: Communicate(ajax), 
}
