const toast = ({
	title = "",
	icon = "success"
}) => {
	uni.showToast({
		title: title,
		icon: icon,
		duration: 2500,
		mask: false,
	});
}
// 请求函数封装
const request = ({
	prefix = '', // 接口地址前缀
	url = '',
	data = {},
	header = {
		'content-type': 'application/json' // 默认值
	},
	method = "GET",
	timeout = 30000, // 接口超时时间
	dataType,
	loading = false, // 是否加载提示，传入字符提示信息变化
	error = true, // 错误信息提示，传入字符提示信息变化
	success = false, // 正确信息提示，传入字符提示信息变化
}) => {
	url = prefix + url // 前缀处理
	method = method.toUpperCase()

	loading && uni.showLoading({
		title: loading === true ? '加载中……' : loading,
		mask: true
	})
	return new Promise((resolve, reject) => {
		const requestTask = uni.request({
			url,
			method,
			data,
			dataType,
			header,
			success(res) {
				loading && uni.hideLoading()
				const data = res.data

				// 正确处理,和业务相互结合
				if (data.code === 0 || data.code === 1) {
					success && toast({
						title: success === true ? "成功" : success
					})
					// 成功只关注内部数据，简化后期代码书写
					resolve(data.data)
				} else {
					console.log('errrrrrrrrrrrrr')
					let {
						msg,
						messageExt
					} = data
					if (!msg) {
						msg = data.message
					}
					const errMsg = messageExt ? messageExt : msg;
					error && toast({
						title: error === true ? errMsg ? errMsg : '接口失败' : error,
						icon: 'none'
					})
					reject(data)
				}
			},
			fail(err) {
				const errMsg = err
				error && toast({
					title: error === true ? (errMsg ? errMsg : "失败") : error,
					icon: 'none'
				})

				loading && uni.hideLoading()
				reject(err)
			}
		});
	})
}

export default request;
