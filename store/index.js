import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate" // 对vuex数据持久化存储，避免独立操作loaclstorege

Vue.use(Vuex)
// 多模块存储
const modules = {};

const state = {
	code: '', // 微信code
	sessionId: 'oBNYL45e5ycXQweTtmyhV5LQb5SM',
	login: {
		userInfo: {
		}
	},
	username: '',
	nickname: '',
	taskId: '',
	filePrefix: 'https://dtman.guiji.ai/nfs' // 图片前缀
};

const mutations = {
	// 数据统一修改，避免多操作函数情况，缺陷：无法精细化操作变量，操作方式类似微信小程序操作
	set_data(state, data) {
		for (let key in data) {
			state[key] = data[key];
		}
	}
};
export default new Vuex.Store({
	state,
	mutations,
	modules,
	plugins: [
		createPersistedState({
			storage: {
				getItem: key => uni.getStorageSync(key),
				setItem: (key, value) => uni.setStorageSync(key, value),
				removeItem: key => uni.removeStorageSync(key)
			}
		})
	],
})
