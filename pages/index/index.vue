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
				<!-- loading = false; -->
				<!-- <image class="play-video-back" :src="`${filePrefix}/ss-file/xz/img/guiji_bg_v2.png`"></image> -->
			</view>
			<!-- 暂时不需要video全屏展示 -->
			<!-- <image class="background-image" src="/static/image/background-image.png"></image> -->
			<view class="content">
				<!-- <view v-if="machineWord" class="machine-word" :style="{'background-image': 'url(' + chatBackground + ')'}">
					<view>
						<text>{{ machineWord }}</text>
					</view>
					<image v-if="machineImg" class="machine-img" :src="filePrefix + machineImg"></image>
				</view> -->
				<!-- 按钮,选项, 内容部分 -->
				<view class="options-content">
					<view @click="jumpToTrain" class="type-chose-img" v-if="eventType != 'train'">
						<image id="type-chose-img" style="width: 100%;height: 100%;" src="../../static/image/type-chose.png"></image>
					</view>
					<template v-if="eventType === 'button' && nodeType != 1">
						<ListButton :isFixedText="isFixedText" :list="buttonList" @back="onListButton" />
					</template>
					<template v-if="eventType === 'button' && nodeType === 1">
						<specialButtonList :list="buttonList" @back="onSpecialButtonList" />
					</template>
					<template v-if="eventType === 'picture'">
						<view class="event-picture"><Picture></Picture></view>
					</template>
					<template v-if="eventType === 'train'">
						<view class="event-picture"><Train></Train></view>
					</template>
					<template v-if="eventType === 'progress_bar'">
						<ProgressOptions @back="onProgressOptions" />
					</template>
					<template v-if="eventType === 'text' || eventType === 'tbutton'">
						<VoiceInput ref="voiceInput" :quick-option="quickOption" @blur="onVoiceInputBlur" @quick="onVoiceInputQuick" />
					</template>
					<view class="right-chat-icon" v-if="eventType != 'train'" @click="jumpToChatRoom">
						<!-- <van-icon name="comment-o" size="44rpx"/> -->
						<!-- <van-icon custom-class="chat-icon" name="comment" size="48rpx" color="#ffffff" /> -->
						<image class="chat-icon" style="width: 44rpx;height: 44rpx;" src="../../static/image/chat_icon.png"></image>
					</view>
				</view>
			</view>
			<!-- 蒙层 -->
			<view class="over-modal">
				
			</view>
		</view>
	</Layouts>
</template>

<script>
import ProgressOptions from './components/ProgressOptions.vue';
import VoiceInput from './components/VoiceInput.vue';
import Picture from './components/Picture.vue';
import Train from './components/Train.vue';
import { chatBackground } from '@/assets/image/base64.js';
import specialButtonList from './components/specialButtonList.vue';
import vuex from '@/store/index.js';
function throttle(fn) {
    let canRun = true; 
    return function () {
        if (!canRun) return;
        canRun = false;
        setTimeout(() => { 
            fn.apply(this, arguments);
            canRun = true;
        }, 500);
    };
}
export default {
	components: {
		ProgressOptions,
		VoiceInput,
		Picture,
		Train,
		specialButtonList
	},
	computed: {
		filePrefix() {
			return this.$store.state.filePrefix;
		}
	},
	data() {
		return {
			chatBackground: chatBackground(), // 聊天背景图
			loading: true, // 全局页面加载
			isOnPlay: false, // 是否开始播放
			// 事件类型 text button progress_bar tbutton || text,tbutton 需要拼接数据
			eventType: 'button',
			videoSrc: '',
			// 机器人的话语
			machineWord: '',
			machineImg: '',
			buttonList: [], // button数组
			quickOption: '', // 快捷选项
			taskId: null,
			cfgCode: '',
			isFixedText: false,
			nodeType: 0,
			defaultVedioUrl: ''
		};
	},
	async created() {
		// 不进行页面渲染的定义
		this.videoContext = null;
		this.innerAudioContext = null; // 音频流
		this.seqId = null;
		this.answer = null; // 当前话语
		console.log('重新加载本页面');
	},
	onShow() {
		this.userInit();
	},
	onHide() {},
	onLoad() {
		// 获取录音权限
		this.defaultVideoContext = uni.createVideoContext('defaultVideo');
		// 第一次直接默认赋值默认话术音频地址
		this.defaultVedioUrl = this.filePrefix + '/ss-file/xz/v1/video/background_2.mp4';
		this.videoContext = uni.createVideoContext('myVideo');
		this.defaultVideoContext.play();
		// uni.authorize({
		// 	scope: 'scope.record',
		// 	complete: () => {
		// 		// 确认授权后开始播放默认音频
		// 		this.defaultVideoContext.play();
		// 	}
		// });
	},
	methods: {
		defaultVedioUrlPlay() {
			this.loading = false;
		},
		// 初始化用户信息 判定是否有历史话术流程
		async userInit() {
			const [err, suc] = await this.$api.Communicate.userInit({
				data: {
					userNick: vuex.state.nickname || '234',
					username: vuex.state.username || '17602530327'
				}
			});
			if (err) return false;
			console.log(suc, 'ddddddddddddd');
			if (suc) {
				// 初始化获取taskId和cfgCode
				this.taskId = suc.taskId;
				this.$store.commit('set_data', {
					taskId: suc.taskId
				});
				this.cfgCode = suc.cfgCode;
				const { end, lastResponse } = suc;
				if (end) {
					//如果end为true走固定初始化选择推荐练习
					this.isFixedText = true;
					this.exchange({ type: 'first' });
					// 获取开头引导地址
					let [err2, suc2] = await this.$api.Communicate.materialQuery({
						proCode: '3'
					});
					if (err2) return false;
					this.videoSrc = this.filePrefix + suc2[0].materialContent;
					this.videoContext.play();
				} else {
					this.isFixedText = false;
					this.seqId = lastResponse.seqId;
					lastResponse.answer = {
						...lastResponse.answer,
						seqId: lastResponse.seqId,
						cfgCode: lastResponse.cfgCode,
						taskId: lastResponse.taskId
					};
					this.handleAnswer(lastResponse.answer);
				}
			}
		},
		onVideoPlay() {
			this.loading = false;
			this.isOnPlay = true;
		},
		onVideoError(err) {
			console.log(err, 'errrrrrrrrrrre');
			this.isOnPlay = false;
			this.videoSrc = '';
		},
		onVideoEnd() {
			console.log('视频播放结束');
			this.videoSrc = '';
			this.isOnPlay = false;
			// this.defaultVideoContext.stop();
			// this.defaultVedioUrl = this.filePrefix + '/ss-file/xz/v1/video/background_2.mp4';
			// this.defaultVideoContext.play();
		},
		// 交流
		async exchange({ type = 'answer', sentence }) {
			// 如果type是start 进入推荐练习 默认设置buttons 不做其他操作
			if (type === 'first') {
				this.eventType = 'button';
				this.buttonList = ['放松', '正念'];
				return;
			}
			// 重置视频状态
			this.videoContext && this.videoContext.stop();
			this.onVideoEnd();

			// console.log(type)
			const data = {
				cfgCode: this.cfgCode,
				sentence: '',
				seqId: '',
				taskId: this.taskId,
				exchangeType: type,
				userNick: vuex.state.nickname || '234',
				username: vuex.state.username || '17602530327'
			};

			if (type === 'answer') data.seqId = this.seqId;
			if (sentence) data.sentence = sentence;
			// 调取话术接口获取返回
			const [err, suc] = await this.$api.Communicate.exchange({ data: data, loading: false });
			if (err) return false;
			let { answer, seqId, cbtEndState, cfgCode, taskId } = suc;
			this.seqId = seqId;
			this.isFixedText = false;
			// 判断当前话术是否结束 cbtEndState: 0继续 cbtEndState:1切换至固定页面选择放松类型
			// 为nodeType为0得页面特殊处理字段
			if (answer.nodeType === 0) {
				answer.cfgCode = cfgCode;
				answer.seqId = seqId;
				answer.taskId = taskId;
			}
			if (cbtEndState === 1 && answer.nodeType !== 0 && answer.nodeType !== 1) {
				console.log('跳转至默认页面！')
				this.videoContext.stop();
				uni.navigateTo({
					url: '../default/index'
				});
				return;
			}
			this.handleAnswer(answer);
		},
		// 处理返回的话语
		handleAnswer(answer) {
			this.nodeType = answer.nodeType;
			// 如果nodeType为0 跳转至正式训练页面 audio
			console.log(this.nodeType, 'this.nodeType')
			if (this.nodeType === 0) {
				// this.videoContext.stop();
				// this.defaultVedioUrl.stop();
				uni.navigateTo({
					url: '../audio/index',
					events: {
						// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
						sendAnswer: data => {}
					},
					success: response => {
						this.videoSrc = '';
						response.eventChannel.emit('sendAnswer', answer);
					}
				});
				return
			}
			// 下一次事件触发的时候关闭音乐
			this.innerAudioContext && this.innerAudioContext.stop();
			this.answer = answer;
			const filePrefix = this.filePrefix;
			const { audioUrl, buttons, content, contentId, eventType, imgUrl, maxScore, vedioUrl, minScore, text, attrs } = answer;
			this.eventType = eventType;
			if (eventType === 'text' && text === '*') {
				this.exchange({type: 'answer'})
				return false
			}
			this.machineWord = content;
			this.machineImg = imgUrl;
			// 视频处理
			this.videoSrc = filePrefix + vedioUrl;
			this.videoContext.play();
			//多按钮处理 nodeType为1时 开始选择放松类型的新话术
			if (this.nodeType === 1) {
				if (attrs && attrs.length > 0) this.buttonList = attrs[0].variables;
			} else {
				if (buttons && buttons.length > 0) this.buttonList = buttons;
			}
			if (eventType === 'tbutton') this.quickOption = buttons[0];
			else this.quickOption = '';
			// 音乐播放
			audioUrl && this.playerMp3(filePrefix + audioUrl);
			// 事件触发完成之后清空输入框
			this.$refs.voiceInput && (this.$refs.voiceInput.voiceText = '');
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
			this.exchange({ sentence: `${this.answer.text}:${text}` });
		},
		onVoiceInputQuick(text) {
			this.exchange({ sentence: `${this.answer.text}:${text}` });
		},
		onListButton(text) {
			if (this.isFixedText) {
				text === '放松' ? (this.cfgCode = 'relaxation') : (this.cfgCode = 'breathing_space');
				this.exchange({ type: 'start' });
			} else {
				this.exchange({ sentence: text });
			}
		},
		onSpecialButtonList(item) {
			this.cfgCode = item.cfgCode;
			// 做节流处理
			throttle(this.exchange({ type: 'start', sentence: item.name }))
		},
		onProgressOptions(code) {
			this.exchange({ sentence: `${this.answer.text}:${code}` });
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
					res.eventChannel.emit('getAnswer', taskId);
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
	height: 0;
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
.options-content {
	margin-top: 70rpx;
}
.type-chose-img {
	position: absolute;
	bottom: 15rpx;
	left: 10rpx;
	width: 150rpx;
	height: 150rpx;
	z-index: 100;
}
.event-picture {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 150rpx;
	height: 150rpx;
	z-index: 100;
	color: #fff;
}
.right-chat-icon::v-deep {
	width: 90rpx;
	height: 90rpx;
	background-color: #1eaa67;
	border-radius: 50%;
	position: fixed;
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
