<template>
	<view class="main-body" :style="{ transform: 'translateY(' + keyBoardHeight + 'rpx)' }">
		<view class="top-area">
			<image class="login-bg" src="../../../static/image/login-bg.png" mode=""></image>
			<view class="login-welcome">
				<!-- <view class="welcome">WELCOME</view>
				<view class="plan">to relax, to find peace of mind</view> -->
				<!-- <view>未注册手机验证过后，将自动创建账号</view> -->
			</view>
			<view class="login-text">登录</view>
		</view>
		<!-- !showCodeLogin -->
		<view v-if="false">
			<!-- <view class="wechatLogin-area">
				<van-button type="primary" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber" round size="normal" custom-class="wechatLogin-btn">
					微信一键登录
				</van-button>
			</view> -->
			<view class="phoneLogin-area"><van-button type="default" @click="showCodeLogin = true" size="normal" round custom-class="phoneLogin-btn">手机号登录</van-button></view>

			<!-- <button @click="showCodeLogin = true">手机号登录 -->
		</view>

		<view v-if="true">
			<view class="bottom-area">
				<van-field
					:value="phoneNumber"
					@change="onPhoneNumberChange"
					@keyboardheightchange="keyboardheightchange"
					@blur="blur"
					center
					clearable
					:border="false"
					placeholder="请输入手机号码"
					input-class="input-class"
					use-button-slot
					custom-style="padding: 29rpx 0;border-bottom: 2rpx solid rgba(11, 41, 27, 0.23);background-color: #F0F2F5;"
				>
					<view slot="left-icon"><image style="width: 36rpx;height: 36rpx;margin-top: 14rpx;" src="../../../static/image/login-phone.png" mode=""></image></view>
					<!-- <van-button slot="button" size="small" type="primary">发送验证码</van-button> -->
				</van-field>
				<van-field
					:value="code"
					@change="onCodeChange"
					@keyboardheightchange="keyboardheightchange"
					@blur="blur"
					center
					clearable
					:border="false"
					input-class="code-input"
					placeholder="验证码"
					use-button-slot
					custom-style="padding: 29rpx 0;border-bottom: 2rpx solid rgba(11, 41, 27, 0.23);background-color: #F0F2F5;"
				>
					<view slot="left-icon"><image style="width: 36rpx;height: 36rpx;margin-top: 14rpx;" src="../../../static/image/login-code.png" mode=""></image></view>
					<van-button
						@click="sendCode"
						slot="button"
						:disabled="disabledGetCode"
						size="small"
						custom-style="background: #FFFFFF;border-radius: 66rpx;color: #1EAA67;font-size: 30rpx;"
					>
						{{ showTime ? timeTips : codeBtnName }}
					</van-button>
				</van-field>
			</view>
			<!-- <view class="check-area"><van-checkbox :value="checked" shape="square" @change="onChange">我已阅读并同意《服务协议和隐私政策》</van-checkbox></view> -->
			<view class="btn-area">
				<!-- <button class="login-btn">登录</button> -->
				<van-button
					v-if="phoneNumber != '' && code != ''"
					custom-class="disabled-login"
					:loading="isLogining"
					type="info"
					loading-size="16rpx"
					loading-text="登录中..."
					@click="login"
				>
					登录
				</van-button>
				<van-button v-else custom-class="login-btn" :loading="isLogining" type="info" loading-size="16rpx" loading-text="登录中..." @click="login">登录</van-button>
			</view>
		</view>
	</view>
</template>

<script>
import { testCode } from '@/utils/login.js';
export default {
	data() {
		return {
			phoneNumber: '',
			code: '',
			checked: false,
			isLogining: false,
			showCodeLogin: false,
			showTime: false,
			countdown: 60,
			timeTips: '',
			codeBtnName: '发送验证码',
			keyBoardHeight: 0
		};
	},
	async created() {
		const code = await testCode();
		if (!code) return false;
		const ceshi = null;
		// 特殊接口特别处理部分
		this.$api.Login.wechatLogin({
			data: {
				applet: 'psychotherapy-miapp-uniapp',
				js_code: code
			}
		}).then(data => {
			if (data.code === 0) {
				// 设置全局的sessionId
				this.$store.commit('set_data', {
					sessionId: data.result.rows[0].openid
				});
			} else {
				uni.showToast({
					title: data.messageExt,
					icon: 'none'
				});
			}
		});
		// 判断当前本地是否存有手机号
		uni.getStorage({
			key: 'storage_phoneNumber',
			success: res => {
				if (res) {
					console.log(res, 'resssssssss');
					this.isOldUser(res.data);
				}
			}
		});
	},
	async onLoad() {
	},
	methods: {
		settime() {
			if (this.countdown == 0) {
				this.showTime = false;
				this.timeTips = '';
				this.countdown = 60;
				this.codeBtnName = '重新发送';
				return;
			} else {
				this.showTime = true;
				this.timeTips = this.countdown + 's';
				this.countdown--;
			}
			setTimeout(() => {
				this.settime();
			}, 1000);
		},
		// 发送验证码
		async sendCode() {
			let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
			const isPass = this.phoneNumber.match(reg);
			if (isPass == null) {
				uni.showToast({
					title: '手机号格式错误！',
					icon: 'none'
				});
				return;
			}
			const option = {
				data: {
					username: this.phoneNumber
				},
				error: true
			};
			const [err, data] = await this.$api.Login.sendCode(option);
			if (err) return false;
			this.settime();
		},
		onPhoneNumberChange(event) {
			this.phoneNumber = event.detail;
		},
		onCodeChange(event) {
			this.code = event.detail;
		},
		onChange(event) {
			console.log('dsdsds', event);
			this.checked = event.detail;
		},
		async login() {
			if (this.phoneNumber == '' || this.code == '') {
				return;
			}
			const params = {
				username: this.phoneNumber,
				smsCode: this.code
			};
			// 实际登陆部分
			this.isLogining = true;
			const [loginBycodeErr] = await this.$api.Login.loginByCode({ data: params, error: true });
			if (loginBycodeErr) {
				this.isLogining = false;
				return false;
			}
			// 登陆成功后保存当前手机号
			uni.setStorage({
				key: 'storage_phoneNumber',
				data: this.phoneNumber,
				success: function() {
					console.log('success');
				}
			});
			// 调取接口判断是否是老用户 老用户直接跳转至话术页面
			this.isOldUser(this.phoneNumber);
		},
		async isOldUser(phoneNumber) {
			const [isUserErr, isUser] = await this.$api.Login.isUser({ username: phoneNumber, error: true });
			this.isLogining = false;
			console.log('isUser', isUser);
			if (isUserErr) return false;
			if (isUser.isNewUser === 10) {
				uni.navigateTo({
					url: '/pages/nickName/index',
					events: {
						// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
						acceptDataFromOpenedPage: data => {
							console.log(data);
						}
					},
					success: response => {
						response.eventChannel.emit('acceptDataFromOpenerPage', { uid: isUser.id });
					}
				});
			} else {
				// 设置全局用户名称和用户昵称
				this.$store.commit('set_data', {
					username: isUser.username,
					nickname: isUser.nickname
				});
				uni.redirectTo({ url: '/pages/index/index' });
			}
		},
		onGetPhoneNumber(e) {
			console.log(e);
			if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
				//用户决绝授权
				//拒绝授权后弹出一些提示
			} else {
				//允许授权
				console.log(e.detail.encryptedData);
				e.detail.encryptedData; //加密的用户信息
				e.detail.iv; //加密算法的初始向量  时要用到
			}
		},
		// 监听键盘弹出
		keyboardheightchange(event) {
			console.log(event.detail.height);
			this.keyBoardHeight = event.detail.height * -1;
		},
		blur() {
			this.keyBoardHeight = 0;
		},
		// 静态资源图片预加载
		imgPreloading() {
			const imageList = ['https://dht.red/test/load (1).jpg'];
			imageList.forEach(async li => {
				const [err, suc] = await uni.getImageInfo({ src: li });
				// 全局存储
				// this.$store.commit('set_data', {
				// 	img: suc.path
				// });
				console.log(err, suc);
			});
		}
	}
};
</script>

<style scoped lang="less">
.main-body {
	background-color: #f0f2f5;
	height: 100vh;
}
.wechatLogin-area::v-deep {
	margin-top: 20rpx;
	width: 100vw;
	text-align: center;
	.wechatLogin-btn {
		width: 60vw;
		margin-top: 40rpx;
		height: 90rpx;
		font-weight: 500;
		background-color: #1eaa67;
		font-size: 34rpx;
		color: #ffffff;
	}
}
.phoneLogin-area::v-deep {
	margin-top: 43rpx;
	width: 100vw;
	text-align: center;
	.phoneLogin-btn {
		width: 60vw;
		// margin-top: 50rpx;
		height: 90rpx;
		font-weight: 500;
		background: #ffffff;
		font-size: 34rpx;
		color: #1eaa67;
	}
}
.top-area::v-deep {
	text-align: center;
	.login-bg {
		width: 100vw;
		height: 732rpx;
	}
	.login-welcome {
		position: absolute;
		top: 147rpx;
		width: 100vw;
		.welcome {
			font-size: 54rpx;
			color: #ffffff;
		}
		.plan {
			font-size: 32rpx;
			height: 59rpx;
			line-height: 59rpx;
			color: #ffffff;
		}
	}
	.van-cell {
		padding: 20rpx 0;
	}
	.login-text {
		position: absolute;
		top: 611rpx;
		width: 100vw;
		font-size: 50rpx;
		color: #0b291b;
		font-weight: 600;
	}
}
.bottom-area::v-deep {
	background-color: #f0f2f5;
	padding: 10rpx 103rpx;
	.input-class {
		padding-left: 24rpx;
	}
	.code-input {
		padding-left: 24rpx;
		color: rgba(11, 41, 27, 0.5);
	}
}
.check-area {
	margin-left: 103rpx;
	margin-top: 50rpx;
}
.btn-area::v-deep {
	text-align: center;
	.login-btn {
		margin-top: 50rpx;
		width: 243rpx;
		height: 90rpx;
		font-weight: 600;
		background: rgba(30, 170, 103, 0.3);
		border-radius: 45rpx;
		border: none;
		// opacity: 0.3;
		font-size: 34rpx;
		color: #1eaa67;
	}
	.disabled-login {
		margin-top: 50rpx;
		width: 243rpx;
		height: 90rpx;
		font-weight: 600;
		background: #1eaa67;
		border-radius: 45rpx;
		border: none;
		// opacity: 0.3;
		font-size: 34rpx;
		color: #ffffff;
	}
}
</style>
