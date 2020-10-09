import vuex from "@/store/index.js"

// to.js,解决await无法捕获reject的处理方式
const to = (promise) => {
	return promise
		.then(data => {
			return [null, data];
		})
		.catch(err => [err]);
}
// 对提示信息提前进行封装，简化代码操作
const showToast = ({
	title = '网络环境异常',
	icon = 'none',
	duration = 2500,
	mask = false,
	position = 'center',
	image,
}) => {
	uni.showToast({
		title,
		icon,
		duration,
		mask,
		position,
		image
	});
}
// 模态弹窗类型提示封装
const showModel = async ({
	title = '提示',
	content = '',
	showCancel = false,
	cancelText = '取消',
	cancelColor = '#000000',
	confirmText = '确定',
	confirmColor = '#000000'
}) => {
	const [err, suc] = await uni.showModal({
		title,
		content,
		showCancel,
		cancelText,
		cancelColor,
		confirmText,
		confirmColor
	})
	if (suc.confirm) {
		return Promise.resolve()
	}
	if (suc.cancel) {
		return Promise.reject(err)
	}
}

export default {
	to,
	showToast,
	showModel,
}
