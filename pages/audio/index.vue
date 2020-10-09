<template>
	<view class="audio-main" style="background-size:cover;" :style="{backgroundImage: `url(${filePrefix}${bgObj.url})`}">
		<Train v-if="showTrain" @back="getBackItem"></Train>
		<!-- <audio style="margin-top: 100rpx;" :src="audioSrc" controls></audio> -->
		<!-- <view class="back-icon" @click="back"><van-icon name="arrow-left" color="#FFFFFF" size="32rpx" /></view> -->
		<view class="content-area">
			<view class="title">{{bgObj.name}}</view>
			<view class="content">{{bgObj.desc}}</view>
			<!-- <view class="content">培养应对思绪的能力</view> -->
		</view>
		<view class="control-btns">
			<view class="btns">
				<view @click="showSelectMusic"><image class="btn-image-small" src="../../static/image/slect_music.png"></image></view>
				<view @click="changePlayState">
					<image class="btn-image" v-if="playing == true" src="../../static/image/on_play.png"></image>
					<image class="btn-image" v-else src="../../static/image/on_purse.png"></image>
				</view>
				<view @click="stopPlay"><image class="btn-image-small" src="../../static/image/stop.png"></image></view>
			</view>
			<view class="process-area">
				<!-- <van-slider custom-class="slider-custom-class" :value="sliderValue" @change="onSliderChange" @drag-end="dragEnd"/> -->
				<slider activeColor="#1EAA67" block-size="20" block-color="#1EAA67" :value="sliderValue" @change="onSliderChange" step="0.5" />
				<view class="time-area">
					<view class="start-time">{{ currentTimeText }}</view>
					<view class="duration-time">{{ durationTimeText }}</view>
				</view>
			</view>
		</view>
		<!-- 选择背景音乐弹出层 -->
		<van-popup :show="showPopup" position="bottom" custom-style="height: 100vh;background-color: rgba(255, 255, 255, 0.9);">
			<!-- <view class="close-icon" @click="onClose"><van-icon name="cross" /></view> -->
			<musicList :playing="playing" v-if="picBtnArr.length > 0 && showPopup" :picBtnArr="picBtnArr" @closePopup="onClose" @send="getSaveData"></musicList>
		</van-popup>
	</view>
</template>

<script>
import Train from './component/Train.vue';
import musicList from './component/musicList.vue';
import vuex from '@/store/index.js';
export default {
	data() {
		return {
			durationTime: 0,
			playing: true,
			sliderValue: 0,
			canSetSlider: true,
			currentTime: 0,
			currentTimeText: '00:00',
			durationTimeText: '00:00',
			showPopup: false,
			showTrain: false,
			answer: null,
			bgObj: null,
			picBtnArr: [],
			num: 0 //第一次进入会自动进入播放结束 组织操作
		};
	},
	components: { Train, musicList },
	computed: {
		filePrefix() {
			return this.$store.state.filePrefix;
		}
	},
	created() {
		this.innerAudioContext = null;
		this.bgAudioContext = null;
	},
	onHide() {
		this.clearResources()
	},
	onUnload() {
		this.clearResources()
	},
	onShow() {
		
	},
	watch: {
	},
	async onLoad() {
		// 接收index页面传递过来得answer数据 数字人音频
		const eventChannel = this.getOpenerEventChannel();
		eventChannel.on('sendAnswer', answer => {
			this.answer = answer;
			
			this.bgObj = this.answer.attrs.filter(item => {
				return item.type === 'img';
			})[0]['variables'][0];
			this.picBtnArr = this.answer.attrs.filter(item => {
				return item.type === 'audio';
			}).length > 0 ? this.answer.attrs.filter(item => {
				return item.type === 'audio';
			})[0].variables : [];
			this.picBtnArr = this.picBtnArr.map((item, index) => {
				if (index == 0) {
					return {
						...item,
						checked: true,
						url: this.filePrefix + item.url,
						img: this.filePrefix + item.img
					};
				} else {
					return {
						...item,
						checked: false,
						url: this.filePrefix + item.url,
						img: this.filePrefix + item.img
					};
				}
			});
			// 音频播放逻辑
			this.innerAudioContext = uni.createInnerAudioContext();
			this.innerAudioContext.autoplay = false;
			console.log(this.answer.vedioUrl, 'this.answer.vedioUrl')
			this.innerAudioContext.src = this.$store.state.filePrefix + this.answer.vedioUrl;
			this.innerAudioContext.play();
			// 
			this.innerAudioContext.onPlay(() => {
				console.log('开始播放');
			});
			this.innerAudioContext.onError(res => {
				console.log(res.errMsg, 'eeeeeeeeeeee');
				console.log(res.errCode, 'ccccccccc');
				this.innerAudioContext && this.innerAudioContext.stop();
				this.allReplay();
			});
			this.innerAudioContext.onSeeked(() => {
				this.canSetSlider = true;
			});
			this.innerAudioContext.onSeeking(() => {
				this.canSetSlider = false;
			});
			this.innerAudioContext.onTimeUpdate(() => {
				// console.log(this.innerAudioContext.duration, this.innerAudioContext.currentTime, 'console.log(this.innerAudioContext)');
				if (this.innerAudioContext.duration && this.canSetSlider) {
					this.durationTime = this.innerAudioContext.duration;
					this.currentTime = this.innerAudioContext.currentTime;
					// *1000000原因 默认current保留6位小数
					this.sliderValue = (((this.innerAudioContext.currentTime * 1000000) / (this.durationTime * 1000000)) * 100).toFixed(0);
					// console.log(this.sliderValue, 'sliderValue');
					// 设置当前播放时间和总时间
					let seek = this.currentTime.toFixed(0);
					let duration = this.durationTime.toFixed(0);
					let min = parseInt(seek / 60);
					let sec = parseInt(seek % 60);
					//填充字符串，使3:1这种呈现出 03：01 的样式
					if (min.toString().length == 1) {
						min = `0${min}`;
					}
					if (sec.toString().length == 1) {
						sec = `0${sec}`;
					}
					this.currentTimeText = `${min}:${sec}`;
					let min1 = parseInt(duration / 60);
					let sec1 = parseInt(duration % 60);
					if (min1.toString().length == 1) {
						min1 = `0${min1}`;
					}
					if (sec1.toString().length == 1) {
						sec1 = `0${sec1}`;
					}
					this.durationTimeText = `${min1}:${sec1}`;
				}
			});
			// 数字人话术播放结束监听
			this.innerAudioContext.onEnded(() => {
				this.exchange({ type: 'answer' });	
			})
			// 背景音乐播放
			this.bgAudioContext = uni.createInnerAudioContext();
			this.bgAudioContext.loop = true;
			// this.bgAudioContext.src = this.picBtnArr.filter((item) => {
			// 	return item.checked == true
			// })[0].url;
			this.bgAudioContext.src = '';
			this.bgAudioContext.play();
		});
	},
	mounted() {
	},
	methods: {
		// 播放背景音乐和话术
		allReplay() {
			this.innerAudioContext.src = this.$store.state.filePrefix + this.answer.vedioUrl;
			this.innerAudioContext.play();
		},
		// 清除缓存资源
		clearResources() {
			this.innerAudioContext && this.innerAudioContext.stop();
			this.bgAudioContext && this.bgAudioContext.stop();
		},
		// 话术
		async exchange({ type = 'answer', sentence }) {
			const data = {
				cfgCode: this.answer.cfgCode,
				sentence: '',
				seqId: this.answer.seqId,
				taskId: this.answer.taskId,
				exchangeType: type,
				userNick: vuex.state.nickname || '234',
				username: vuex.state.username || '17602530327'
			};
			// 调取话术接口获取返回
			const [err, suc] = await this.$api.Communicate.exchange({ data: data });
			if (err) return false;
			// 成功并且类型是end 跳转至默认页面
			if (type === 'end') {
				this.bgAudioContext.stop();
				this.innerAudioContext.stop();
				uni.navigateTo({
					url: '../default/index',
					success: () => {
						console.log('success')
					}
				})
				return
			}
			const { answer, cbtEndState, seqId, cfgCode, taskId } = suc;
			// 判断当前话术是否结束 cbtEndState: 0继续 cbtEndState:1切换至固定页面选择放松类型
			this.answer = {
				...answer,
				seqId: seqId,
				cfgCode: cfgCode,
				taskId: taskId
			};
			// 判断当前正式训练话术是否结束
			if (cbtEndState === 1) {
				// 跳转至默认页面
				uni.navigateTo({
					url: '../default/index',
					success: () => {
						console.log('success')
						this.innerAudioContext.stop();
						this.bgAudioContext.stop();
					}
				})
				return
			}
			if (answer.nodeType === -1) {
				uni.navigateTo({
					url: '../index/index',
					success: () => {
						this.innerAudioContext.stop();
						this.bgAudioContext.stop();
					}
				})
			}
			this.innerAudioContext.src = this.answer.vedioUrl;
			this.innerAudioContext.stop();
			this.innerAudioContext.play();
		},
		startPlay() {
			this.innerAudioContext.play();
		},
		rePlay() {
			this.innerAudioContext.stop();
			this.innerAudioContext.seek(0);
			this.innerAudioContext.play();
			this.playing = true;
		},
		reStart(time) {
			this.innerAudioContext.seek(time);
			this.innerAudioContext.play();
			this.playing = true;
			// this.canSetSlider = true;
		},
		stopPlay() {
			this.playing = false;
			this.innerAudioContext.pause();
			this.showTrain = true;
		},
		pause() {
			this.innerAudioContext.pause();
		},
		changePlayState() {
			this.playing = !this.playing;
			this.playing ? this.startPlay() : this.pause();
		},
		onSliderChange(event) {
			// this.canSetSlider = false;
			console.log(this.durationTime, event.detail, 'timetimetimetimetime1111111111111');
			const time = (this.durationTime.toFixed(0) * event.detail.value) / 100;
			console.log(time, 'timetimetimetimetime22222222222222');
			this.reStart(time);
		},
		dragEnd(event) {
			console.log(event, 'event');
		},
		back() {
			uni.navigateTo({
				url: '../train/index'
			});
		},
		onClose() {
			this.showPopup = false;
			this.bgAudioContext.play();
			if (this.playing) {
				this.innerAudioContext.play();
			} else {
				this.innerAudioContext.pause();
			}
		},
		showSelectMusic() {
			this.showPopup = true;
			this.innerAudioContext.pause();
			this.bgAudioContext.pause();
		},
		getBackItem(name) {
			console.log(name, 'ddddddddd');
			if (name == '继续') {
				this.showTrain = false;
				this.innerAudioContext.play();
				this.playing = true;
			} else {
				this.showTrain = false;
				this.exchange({type: 'end'})
				// 返回至默认页面
			}
		},
		getSaveData(src) {
			this.showPopup = false;
			// this.playing = true;
			// 切换音乐
			this.bgAudioContext.src = src; // 获取obj中的背景音乐路径
			this.bgAudioContext.play();
			this.picBtnArr = this.picBtnArr.map((item, index) => {
				if (item.url === src) {
					return {
						...item,
						checked: true
					};
				} else {
					return {
						...item,
						checked: false
					};
				}
			});
			// 话术继续播放
			if (this.playing) {
				this.innerAudioContext.play();
			} else {
				this.innerAudioContext.pause();
			}
		}
	}
};
</script>

<style lang="less" scoped>
.audio-main {
	height: 100vh;
	background-color: #000000;
	width: 100vw;
	position: relative;
	.back-icon {
		position: absolute;
		top: 58rpx;
		left: 32rpx;
	}
	.content-area {
		width: 100vw;
		color: #ffffff;
		position: absolute;
		top: 507rpx;
		text-align: center;
		.title {
			font-size: 50rpx;
			height: 66rpx;
			line-height: 66rpx;
		}
		.content {
			margin-top: 15rpx;
			font-size: 24rpx;
			font-weight: 300;
			height: 49rpx;
			line-height: 49rpx;
		}
	}
	.control-btns::v-deep {
		position: absolute;
		bottom: 88rpx;
		width: 100vw;
		.btns {
			padding-left: 206rpx;
			padding-right: 206rpx;
			display: flex;
			height: 100rpx;
			line-height: 120px;
			& > view {
				color: #ffffff;
				width: 33%;
				height: 90rpx;
				position: relative;
				image {
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
				}
			}
		}
		.btn-image {
			width: 120rpx;
			height: 120rpx;
		}
		.btn-image-small {
			width: 90rpx;
			height: 90rpx;
		}
		.process-area {
			padding: 30rpx 27rpx 0 27rpx;
			.time-area {
				position: relative;
				font-size: 18rpx;
				color: #ffffff;
				padding: 0 18rpx;
				.start-time {
					position: absolute;
					left: 18rpx;
				}
				.duration-time {
					position: absolute;
					right: 18rpx;
				}
			}
		}
		.van-slider__button {
			height: 30rpx;
			width: 30rpx;
			background-color: #4bbb86;
		}
	}
}
// .close-icon {
// 	margin-top: 62rpx;
// 	margin-left: 40rpx;
// 	font-size: 46rpx;
// 	font-weight: 500;
// 	color: #000000;
// }
</style>
