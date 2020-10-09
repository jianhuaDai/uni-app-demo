<template>
	<view>
		<view class="music-area">
			<view class="close-icon" @click="onClose"><van-icon name="cross" /></view>
			<view class="title_music">音乐</view>
			<view class="picture-btn" v-for="(item, index) in btnList" :key="index" @click="setChecked(index)">
				<image :src="item.img" style="width: 100%;height: 100%;"></image>
				<view class="title">
					{{ item.name }}
					<image v-if="item.checked && item.name != '静音'" class="play_image" src="../../../static/image/on_play_music.gif"></image>
					<image v-if="item.checked && item.name == '静音'" class="play_image" src="../../../static/image/mute_musci.png"></image>
				</view>
			</view>
		</view>
		<view class="save-area">
			<view class="save-btn" @click="sendSaveData">保存</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			btnList: [],
			checkedIndex: 0
		};
	},
	props: {
		picBtnArr: {
			type: Array,
			default: () => {
				return [];
			}
		},
		playing: Boolean
	},
	async created() {
		this.btnList = JSON.parse(JSON.stringify(this.picBtnArr));
		this.selectAudioContext = null;
		this.selectAudioContext = uni.createInnerAudioContext();
		// 遍历音乐数组 播放默认选中的背景音乐
		this.selectAudioContext.src = this.btnList.length > 0 ? this.btnList.filter((item) => {
			return item.checked == true
		})[0].url : '';
		this.selectAudioContext.play();
	},
	methods: {
		onClose() {
			this.selectAudioContext.stop();
			this.$emit('closePopup');
		},
		setChecked(index) {
			this.checkedIndex = index;
			this.btnList = this.btnList.map((item, i) => {
				if ( i == index) {
					this.selectAudioContext.src = item.url;
					this.selectAudioContext.play();
					return {
						...item,
						checked: true
					}
				} else {
					return {
						...item,
						checked: false
					}
				}
			})
		},
		sendSaveData() {
			this.selectAudioContext.stop();
			// 发送当前this.checkedIndex的数据
			let src = this.btnList.filter((item) => {
				return item.checked == true
			})[0].url
			this.$emit('send', src)
		}
	}
};
</script>

<style lang="less" scoped>
.music-area {
	padding: 154rpx 40rpx 40rpx 40rpx;
	position: relative;
	.title_music {
		font-size: 36rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		font-weight: 500;
		color: #3D3E50;
		position: absolute;
		top: 102rpx;
		left: 50%;
		transform: translate(-50%, 0);
	}
	.close-icon {
		font-size: 46rpx;
		font-weight: 500;
		color: #000000;
		position: absolute;
		top: 92rpx;
		left: 22rpx;
	}
	.picture-btn {
		position: relative;
		height: 150rpx;
		margin-top: 60rpx;
		
		image {
			border-radius: 24rpx;
			width: 100%;
			height: 100%;
		}
		.title {
			position: absolute;
			top: 50rpx;
			left: 48rpx;
			color: #ffffff;
			font-size: 38rpx;
			height: 50rpx;
			line-height: 50rpx;
			.play_image {
				position: absolute;
				right: -40rpx;
				top: 10rpx;
				width: 34rpx;
				height: 34rpx;
			}
		}
	}
}
.save-area {
	margin: 0 auto;
	width: 100vw;
	display: flex;
	justify-content: center;
	text-align: center;
	padding-bottom: 45rpx;
	.save-btn {
		width: 204rpx;
		height: 90rpx;
		line-height: 90rpx;
		background: #1EAA67;
		border-radius: 45rpx;
		opacity: 0.94;
		font-size: 34rpx;
		color: #FFFFFF;
	}
}
</style>
