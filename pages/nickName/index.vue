<template>
	<Layouts :loading="loading">
		<view class="content">
			<view class="video">
				<video
					id="myVideo"
					v-if="videoSrc"
					class="play-video"
					:style="{ 'z-index': isOnPlay ? 100 : -1 }"
					:autoplay="false"
					:src="videoSrc"
					:controls="false"
					:show-fullscreen-btn="false"
					:show-play-btn="false"
					:show-center-play-btn="false"
					:enable-progress-gesture="false"
					object-fit="cover"
					@ended="onVideoEnd"
					@error="onVideoError"
					@play="onVideoPlay"
				></video>
				<video
					id="defaultVideo"
					class="play-video-back"
					:style="{ 'z-index': isOnPlay ? -1 : 100 }"
					:autoplay="false"
					:loop="true"
					:src="defaultVedioUrl"
					:controls="false"
					:show-fullscreen-btn="false"
					:show-play-btn="false"
					:show-center-play-btn="false"
					:enable-progress-gesture="false"
					object-fit="cover"
					@play="defaultVedioUrlPlay"
				></video>
			</view>

			<view class="content">
				<!-- 输入内容部分 -->
				<view class="options-content">
					<template v-if="!hasSetNiceName">
						<VoiceInput ref="voiceInput" :quick-option="quickOption" @blur="onVoiceInputBlur"/>
					</template>
					<template v-else>
						<view @click="jumpToDefault" class="start-area">
							<view class="start-btn">
								开启心灵之旅
							</view>
						</view>
					</template>
				</view>
			</view>
			<!-- 蒙层 -->
			<view class="over-modal">
				
			</view>
		</view>
	</Layouts>
</template>

<script>
import VoiceInput from './components/VoiceInput.vue'
export default {
	components: {
		VoiceInput
	},
	computed: {
		filePrefix() {
			return this.$store.state.filePrefix;
		}
	},
	data() {
		return {
			videoSrc: '',
			defaultVedioUrl: '',
			uid: '',
			loading: false, // 全局页面加载
			isOnPlay: false, // 是否开始播放
			// 事件类型 text button progress_bar tbutton || text,tbutton 需要拼接数据
			eventType: 'text',
			quickOption: '', // 快捷选项
			hasSetNiceName: false //是否设置了昵称
		};
	},
	async created() {
		// 不进行页面渲染的定义
		this.defaultVideoContext = null;
		this.innerContext = null;
	},
	async onShow() {
		const [err, data] = await this.$api.Communicate.materialQuery({
			proCode: '1'
		})
		if (err) return false
		this.videoSrc = this.filePrefix + data[0].materialContent;
		console.log(this.videoSrc, 'this.videoSrc')
		this.innerContext.play();
		console.log('ddddddddddddddddddddd')
	},
	onHide() {},
	async onLoad() {
		this.innerContext = uni.createVideoContext('myVideo');
		this.defaultVideoContext = uni.createVideoContext('defaultVideo');
		this.defaultVedioUrl = this.filePrefix + '/ss-file/xz/v1/video/background_2.mp4';
		const eventChannel = this.getOpenerEventChannel()
		eventChannel.on('acceptDataFromOpenerPage', (data) => {
			this.uid = data.uid;
		  })
	},
	methods: {
		defaultVedioUrlPlay() {
			this.loading = false;
			// this.isOnPlay = false;
		},
		onVideoPlay() {
			this.isOnPlay = true;
			console.log(this.videoSrc, 'this.videoSrc')
		},
		onVideoError() {
			this.isOnPlay = false;
			console.log('cccccccccccccccccccc')
		},
		onVideoEnd() {
			console.log('视频播放结束');
			this.videoSrc = '';
			this.isOnPlay = false;
		},
		// 交流
		async exchange(nickName) {
			// 设置昵称接口
			const [err, suc] = await this.$api.Communicate.setNickName({
				data: {
					uid: this.uid,
					nickname: nickName
				},
				success: '设置成功'
			});
			if (suc) {
				this.hasSetNiceName = true
				// 设置全局用户名称和用户昵称
				this.$store.commit('set_data', {
					username: suc.username,
					nickname: suc.nickname
				});
				// 建立信任
				const [err2, suc2] = await this.$api.Communicate.materialQuery({
					proCode: '2'
				})
				if (err2) return false
				this.videoSrc = this.filePrefix + suc2[0].materialContent;
				this.innerContext.play();
			};
		},
		// 播放音频
		playerMp3(src) {
			const innerAudioContext = (this.innerAudioContext = uni.createInnerAudioContext());
			innerAudioContext.loop = true;
			innerAudioContext.src = src;
			innerAudioContext.play();
		},
		// 多个组件返回的事件
		// 普通文本输入情况
		onVoiceInputBlur(text) {
			console.log(text, 'text');
			if (text.trim() != '') {
				this.exchange(text);
			} else {
				uni.showToast({
					title: '请输入昵称',
					icon: 'none',
					duration: 2500,
					mask: false
				});
			}
		},
		onVoiceInputQuick(text) {
			this.exchange(text);
		},
		jumpToDefault() {
			// 跳转至话术页面
			uni.redirectTo({
				url: '/pages/index/index'
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.video {
	width: 750rpx;
	height: 100vh;
	.play-video,
	.play-video-back {
		width: 750rpx;
		height: 100vh;
		display: block;
		margin: 0 auto;
	}
	.play-video {
		position: absolute;
		z-index: 100;
	}
	.play-video-back {
		position: absolute;
		z-index: -1;
	}
}

.background-image {
	width: 750rpx;
	min-height: calc(100vh - 420rpx);
	position: absolute;
	z-index: -1;
}
.mask {
	width: 750rpx;
	min-height: calc(100vh - 420rpx);
	position: absolute;
	z-index: 2000;
	background: rgba(255, 255, 255, 0.5);
}
.content {
	position: absolute;
	z-index: 1001;
	.machine-word {
		font-size: 32rpx;
		color: #425249;
		margin-top: -40rpx;
		margin-left: 70rpx;
		width: 610rpx;
		// min-height: 297rpx;
		max-height: calc(100vh - 170rpx - 450rpx);
		box-sizing: border-box;
		padding: 60rpx 35rpx;
		word-break: break-all;
		word-wrap: break-word;
		white-space: pre-wrap;
		//box-shadow: 0 2rpx 11rpx rgba(255, 255, 255, 0.78) inset, 0 5rpx 16rpx #81c1a1;
		//border-radius: 10rpx;
		overflow-x: hidden;
		overflow-y: auto;
		background-size: 100% 100%;
	}
	.machine-img {
		padding: 10rpx 0 0 0;
		max-width: 540rpx;
	}
}
.start-area {
	position: fixed;
	bottom: 120rpx;
	width: 100vw;
	text-align: center;
	.start-btn {
		width: 314rpx;
		height: 90rpx;
		line-height: 90rpx;
		background: #1EAA67;
		border-radius: 45rpx;
		margin: 0 auto;
		font-size: 34rpx;
		color: #FFFFFF;
	}
}
.options-content {
	margin-top: 70rpx;
}
.over-modal {
	width: 100vw;
	position: fixed;
	bottom: 0;
	height: 460rpx;
	background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
	opacity: 0.65;
}
</style>
