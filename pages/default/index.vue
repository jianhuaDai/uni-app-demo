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
					v-if="defaultVedioUrl"
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
					@error="defaultError"
					@play="() => {
							loading = false;
						}"
				></video>
			</view>

			<!-- <view class="content"> -->
				
				<!-- 输入内容部分 -->
			<view class="options-content">
				<view @click="jumpToTrain" class="type-chose-img" v-if="eventType != 'train'">
					<image id="type-chose-img" style="width: 100%;height: 100%;" src="../../static/image/type-chose.png"></image>
				</view>
				<template>
					<VoiceInput ref="voiceInput" :quick-option="quickOption" @blur="onVoiceInputBlur" />
				</template>
				<view class="right-chat-icon" v-if="eventType != 'train'" @click="jumpToChatRoom">
					<!-- <van-icon name="comment-o" size="44rpx"/> -->
					<!-- <van-icon custom-class="chat-icon" name="comment" size="48rpx" color="#ffffff" /> -->
					<image class="chat-icon" style="width: 44rpx;height: 44rpx;" src="../../static/image/chat_icon.png"></image>
				</view>
			</view>
			<!-- 蒙层 -->
			<view class="over-modal">
				
			</view>
			<!-- </view> -->
		</view>
	</Layouts>
</template>

<script>
import VoiceInput from './components/VoiceInput.vue';
import vuex from '@/store/index.js';
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
			loading: true,
			isOnPlay: false, // 是否开始播放
			// 事件类型 text button progress_bar tbutton || text,tbutton 需要拼接数据
			quickOption: '', // 快捷选项
			videoSrc: '',
			defaultVedioUrl: ''
		};
	},
	async created() {
		this.defaultVideoContext = null;
		this.innerContext = null;
	},
	onShow() {
		console.log('进入了！');
	},
	onHide() {},
	async onLoad() {
		// 不进行页面渲染的定义
		this.defaultVideoContext = uni.createVideoContext('defaultVideo');
		this.innerContext = uni.createVideoContext('myVideo');
		let [err2, suc2] = await this.$api.Communicate.materialQuery({
			proCode: '4'
		});
		if (err2) return false;
		this.defaultVedioUrl = this.filePrefix + suc2[0].materialContent;
		console.log(this.defaultVedioUrl, 'ddddddd');
		this.defaultVideoContext.play();
	},
	methods: {
		defaultError(err) {
			console.log(err, '33333333');
		},
		// 交流
		async exchange(text) {
			let [err, data] = await this.$api.Communicate.defaultChat({
				data: {
					sentence: text,
					userNick: vuex.state.nickname || '234',
					username: vuex.state.username || '17602530327'
				}
			});
			if (err) return
			this.videoSrc = this.filePrefix + data.vedioUrl;
			this.innerContext.play();
		},
		onVideoPlay() {
			this.isOnPlay = true;
			console.log(this.videoSrc, 'this.videoSrc')
		},
		onVideoError() {
			this.isOnPlay = false;
		},
		onVideoEnd() {
			console.log('视频播放结束');
			this.videoSrc = '';
			this.isOnPlay = false;
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
					title: '请输入内容',
					icon: 'none',
					duration: 2500,
					mask: false
				});
			}
		},
		onVoiceInputQuick(text) {
			this.exchange(text);
		},
		jumpToTrain() {
			uni.navigateTo({
				url: '../train/index',
				events: {
					getAnswer: data => {
						console.log(data);
					}
				},
				success: res => {
					res.eventChannel.emit('getAnswer', vuex.state.taskId);
				}
			});
		},
		jumpToChatRoom() {
			uni.redirectTo({
				url: '../chatRoom/chatRoom',
				success: () => {
					console.log('3333333');
				}
			});
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

.content {
	height: 100vh;
	position: absolute;
	z-index: 1001;
}
.options-content {
	margin-top: 70rpx;
}
.type-chose-img {
	position: absolute;
	bottom: 10rpx;
	left: 10rpx;
	width: 150rpx;
	height: 150rpx;
	z-index: 1001;
}
.right-chat-icon::v-deep {
	width: 90rpx;
	height: 90rpx;
	background-color: #1eaa67;
	border-radius: 50%;
	position: fixed;
	z-index: 1001;
	bottom: 45rpx;
	right: 38rpx;
	.chat-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
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
