<template>
	<view class="voice-input" :style="{bottom: keyBoardHeight > 0 ? keyBoardHeight + 'px' : '45rpx' }">
		<view :class="keyBoardHeight == 0 ? 'input-text' : 'input-text-up'">
			<input :adjust-position="false" placeholder="请输入" @blur="onblur" v-model="voiceText" @input="inputChange" @keyboardheightchange="keyboardheightchange"/>
			<view v-if="keyBoardHeight > 0" class="icon-bg" @click="sendMessage"><van-icon name="down" class="icon-translate" /></view>
		</view>
	</view>
</template>

<script>
const plugin = requirePlugin('WechatSI')
const manager = plugin.getRecordRecognitionManager()
export default {
	components: {
	},
	props: {
	},
	data() {
		return {
			keyBoardHeight: 0,
			voiceType: 1, // 1 默认状态， 2录音中
			voiceImg: {
				1: '/static/image/microphone.png',
				2: '/static/image/band.png'
			},
			voiceText: '' //当前输入的内容
		}
	},
	mounted() {
	},
	methods: {
		sendMessage() {
			console.log(this.voiceText, 'voiceTextvoiceText');
			if (this.voiceText) {
				this.$emit('blur', this.voiceText)
			}
			this.voiceText = '';
			this.keyBoardHeight = 0;
		},
		inputChange(e) {
			const value = e.detail.value
			if (value) this.voiceText = e.detail.value
		},
		// 失去焦点
		onblur(e) {
			let msg = ''
			if (e.detail) msg = e.detail.value
			else msg = e

			msg && this.$emit('blur', msg)
			this.voiceText = '';
			this.keyBoardHeight = 0;
		},
		// 监听键盘事件
		keyboardheightchange(event) {
			console.log(event.detail, 'keyboardheightchange')
			this.keyBoardHeight = event.detail.height;
		}
	}
}
</script>

<style lang="scss" scoped>
.voice-input {
	z-index: 1001;
	position: fixed;
	bottom: 120rpx;
	display: flex;
	flex-flow: column;
	align-items: center;
	width: 400rpx;
	left: 50%;
	transform: translate(-50%, 0);
}
.voice-click {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-flow: column;
	.img-tips {
		color: #119b57;
		font-size: 24rpx;
	}
	> image {
		width: 150rpx;
		height: 150rpx;
		padding: 15rpx;
	}
}
.quick-click {
	text-align: right;
	position: absolute;
	right: 70rpx;
	font-size: 24rpx;
	top: -10rpx;
	padding: 10rpx;
	.tips {
		color: rgba(0, 0, 0, 0.4);
	}
	.quick-button {
		display: inline-block;
		margin-top: 10rpx;
		line-height: 60rpx;
		height: 60rpx;
		padding: 0 30rpx;
		border-radius: 30rpx;
		background-color: #7db49a;
		color: #fff;
	}
}
.input-text {
	> input {
		width: 400rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 30rpx;
		background: #fff;
		text-align: center;
		border-radius: 40rpx;
	}
}
.input-text-up {
	position: relative;
	> input {
		width: calc(100vw - 180rpx);
		height: 114rpx;
		line-height: 114rpx;
		font-size: 30rpx;
		background: #fff;
		text-align: left;
		padding-left: 50rpx;
		padding-right: 130rpx;
		// border-radius: 40rpx;
	}
}
.icon-bg {
			width: 72rpx;
			height: 72rpx;
			background: #29ae6e;
			position: absolute;
			right: 54rpx;
			bottom: 20rpx;
			border-radius: 45rpx;
			z-index: 1001;
			.icon-translate {
				position: absolute;
				top: 50%;
				left: 50%;
				color: #ffffff;
				font-size: 32rpx;
				transform: translate(-50%, -50%) rotate(180deg);
			}
		}
</style>
