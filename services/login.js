import vuex from '@/store/index.js'
const Login = (ajax) => {
	return {
		// 微信登录权限获取
		wechatLogin: option => ajax({
			url: '/weixin-api/applet/login',
			method: 'get',
			...option
		}),
		// 发送验证码
		sendCode: option => ajax({
			url: '/user-api/getSmsCode?sessionId=' + vuex.state.sessionId,
			method: 'post',
			...option
		}),
		//短信验证码登录
		loginByCode: option => ajax({
			url: '/user-api/smsLogin?sessionId=' + vuex.state.sessionId,
			method: 'post',
			...option
		}),
		// 1.1.10校验用户是否注册
		isUser: option => ajax({
			url: '/user-api/isUser/' + option.username,
			method: 'get',
			...option
		}),
	}
}

export default Login