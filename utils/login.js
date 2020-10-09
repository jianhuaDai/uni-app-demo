import vuex from "@/store/index.js"
import Utils from "./index.js"
// 检测code登录状态
const checkSession = () => {
	return new Promise((resolve, reject) => {
		uni.checkSession({
			success: () => {
				resolve(vuex.state.code)
			},
			fail: () => {
				reject(false)
			}
		})
	});
}
// 获取code，用以返回code
const obtainCode = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			success: code => {
				vuex.commit('set_data', {
					code: code.code
				});
				resolve(code.code)
			},
			fail() {
				reject(fasle)
			}
		});
	})
}
// 检测code值是否有效，并且最终返回code值
const testCode = async () => {
	// let [err, code] = await Utils.to(checkSession())

	// if (!code) {
	// 只有5分钟有效期 现在还没做失效验证 先做成进入就获取方式
	let [err, code] = await Utils.to(obtainCode())
	console.log(Utils.to(obtainCode()), '', err, code)
	// }
	if (!code) {
		uni.showToast({
			title: '登录失效，请尝试重新授权',
			duration: 2500,
			mask: false,
		})
		return false
	}
	
	return code
}
export {
	testCode
}
