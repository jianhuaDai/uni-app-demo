<template>
	<view class="voice-tips" :style="{'background': content[type].background}">
		<view class="li">
			<image :class="content[type].class" :src="content[type].src"></image>
		</view>
		<view class="li">
			<view class="title">{{ content[type].title }}</view>
			<view class="detail">{{ content[type].tips }}</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		type: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			content: {
				// 录音中
				0: {
					background: 'rgba(0, 0, 0, 0.6)',
					class: 'microphone',
					src: '/static/image/icon-microphone.png',
					title: '松开发送',
					tips: '滑动取消'
				},
				// 录音取消提示
				1: {
					background: 'rgba(255, 56, 56, 0.6)',
					class: 'icon-return',
					src: '/static/image/icon-return.png',
					title: '松开手指',
					tips: '取消发送'
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.voice-tips {
	position: absolute;
	left: 265rpx;
	top: -280rpx;
	background: rgba(0, 0, 0, 0.6);
	width: 220rpx;
	height: 220rpx;
	border-radius: 10rpx;
	display: flex;
	flex-flow: column;
	justify-content: center;
	align-items: center;
}
.li {
	color: #fff;
	padding: 7rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-flow: column;
	.microphone {
		width: 46rpx;
		height: 64rpx;
	}
	.icon-return {
		width: 61rpx;
		height: 47rpx;
	}
	.title {
		font-size: 30rpx;
	}
	.detail {
		font-size: 24rpx;
	}
}
</style>
