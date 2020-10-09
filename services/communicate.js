const Communicate = (ajax) => {
	return {
		// 获取音视频配置
		exchange: options => ajax({
			url: "/kbr/psychologist/exchange",
			method: 'post',
			...options
		}),
		// 设置用户昵称
		setNickName: option => ajax({
			url: '/user-api/update',
			method: 'post',
			...option
		}),
		// 卡片查询
		cardQuery: option => ajax({
			url: '/kbr/psychologist/card/' + option.proCode,
			...option
		}),
		// 用户初始化
		userInit: option => ajax({
			url: '/kbr/psychologist/init',
			method: 'post',
			...option
		}),
		// 素材查询
		materialQuery: option => ajax({
			url: '/kbr/psychologist/material/0/' + option.proCode,
			method: 'get',
			...option
		}),
		// 查询用户交互日志列表,聊天列表
		messageList: option => ajax({
			url: '/kbr/psychologist/message',
			method: 'get',
			...option
		}),
		// 闲谈交互 默认页面会话交互
		defaultChat: option => ajax({
			url: '/kbr/psychologist/chat',
			method: 'post',
			...option
		})
	}
}

export default Communicate
