<template>
	<view style="height: 100vh;overflow-y: auto;">
		<scroll-view scroll-y class="chat-room-main" id="chat-room-main" :scroll-top="scrollTop">
			<view v-for="(item, index) in chatArr" :key="index">
				<view :class="item.type">
					<image src="../../static/image/avar.png" class="avar" v-if="item.type == 'answer'"></image>
					<view :class="[item.type == 'answer' ? 'answer-text' : 'question-text']">{{ item.text }}</view>
				</view>
			</view>
		</scroll-view>
		<view :class="keyBoardHeight == 0 ? 'text-input-area' : 'input-text-up'" :style="{bottom: keyBoardHeight > 0 ? keyBoardHeight + 'px' : '45rpx' }">
			<input type="text" v-model="messageText" :adjust-position="false" @blur="blur" @keyboardheightchange="keyboardheightchange" @input="inputChange" placeholder="输入文字" confirm-type="done" bindconfirm="doSearch" />
			<view class="icon-bg" @click="sendMessage"><van-icon name="down" class="icon-translate" /></view>
		</view>
	</view>
	
</template>

<script>
import vuex from '@/store/index.js';
export default {
	data() {
		return {
			time: '今天 14:09',
			messageText: '',
			chatArr: [
				{
					type: 'answer',
					text: '嗨！Bobo，我是你的朋友硅姬，很高兴认识你，我可以做的朋友聆听你的心里话'
				},
				{
					type: 'question',
					text: '你好！认识你很高兴'
				}
			],
			scrollId: 'index0',
			keyBoardHeight: 0,
			scrollTop: 0
		};
	},
	methods: {
		doSearch(text) {
			console.log(text, 'text');
			this.exchange();
		},
		sendMessage() {
			console.log('1222222222222');
			this.exchange();
		},
		async exchange() {
			const questionObj = {
				type: 'question',
				text: this.messageText
			};
			this.chatArr.push(questionObj);
			let [err, data] = await this.$api.Communicate.defaultChat({
				data: {
					sentence: this.messageText,
					userNick: vuex.state.nickname || '234',
					username: vuex.state.username || '17602530327'
				}
			});
			this.messageText = '';
			if (err) return
			const answerObj = {
				type: 'answer',
				text: data.content
			};
			this.chatArr.push(answerObj);
			this.scrollTop = this.chatArr.length * 1000;
		},
		inputChange(e) {
			this.value = e.detail.value;
		},
		keyboardheightchange(event) {
			console.log(event.detail, 'keyboardheightchange')
			this.keyBoardHeight = event.detail.height;
		},
		blur(event) {
			console.log(event, 'blurblur');
			this.keyBoardHeight = 0;
		}
	}
};
</script>

<style lang="less" scoped>
.chat-room-main {
	// position: relative;
	background: #f1f1f1;
	height: calc(100vh - 150rpx);
	// height: 500rpx;
	width: calc(100vw - 36rpx);
	padding: 0 0 0 36rpx;
	padding-bottom: 150rpx;
	font-size: 26rpx;
	z-index: -100;
	overflow: auto;
	// overflow-y: auto;
	.time {
		width: 100vw;
		text-align: center;
		height: 33rpx;
		line-height: 33rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #a8a9ba;
		padding-top: 47rpx;
	}
	.answer {
		display: flex;
		.avar {
			width: 82rpx;
			height: 82rpx;
			background: #d8d8d8;
			// border: 1rpx solid #979797;
			border-radius: 50%;
		}
		.answer-text {
			max-width: 427rpx;
			margin-top: 40rpx;
			margin-left: 20rpx;
			padding: 25rpx 27rpx 22rpx 38rpx;
			background: #ffffff;
			opacity: 0.94;
			border-bottom-left-radius: 36rpx;
			border-bottom-right-radius: 36rpx;
			border-top-right-radius: 36rpx;
		}
	}
	.question {
		display: flex;
		justify-content: flex-end;
		.question-text {
			max-width: 427rpx;
			margin-top: 40rpx;
			margin-right: 42rpx;
			padding: 25rpx 27rpx 22rpx 38rpx;
			background: #1EAA67;
			opacity: 0.94;
			border-bottom-left-radius: 36rpx;
			border-top-right-radius: 36rpx;
			border-top-left-radius: 36rpx;
			color: #FFFFFF;
		}
	}
}
.text-input-area {
	position: fixed;
	// bottom: 45rpx;
	left: 0;
	text-align: left;
	width: calc(100vw - 80rpx);
	padding: 0 42rpx 0 38rpx;
	z-index: 99;
	input {
		height: 90rpx;
		background-color: #ffffff;
		padding-left: 49rpx;
		border-radius: 45rpx;
		padding-right: 90rpx;
	}
	// .input-text-up {
	// 	border-radius: 0;
	// }
	.icon-bg {
		width: 72rpx;
		height: 72rpx;
		background: #29ae6e;
		position: absolute;
		z-index: 100;
		right: 54rpx;
		bottom: 10rpx;
		border-radius: 45rpx;
		.icon-translate {
			position: absolute;
			top: 50%;
			left: 50%;
			color: #ffffff;
			font-size: 32rpx;
			transform: translate(-50%, -50%) rotate(180deg);
		}
	}
}
.input-text-up {
	position: fixed;
	// bottom: 45rpx;
	left: 0;
	text-align: left;
	width: 100vw;
	input {
		height: 114rpx;
		line-height: 114rpx;
		background-color: #ffffff;
		padding-left: 49rpx;
		padding-right: 90rpx;
	}
	.icon-bg {
		width: 72rpx;
		height: 72rpx;
		background: #29ae6e;
		position: absolute;
		right: 38rpx;
		bottom: 10rpx;
		border-radius: 45rpx;
		.icon-translate {
			position: absolute;
			top: 50%;
			left: 50%;
			color: #ffffff;
			font-size: 32rpx;
			transform: translate(-50%, -50%) rotate(180deg);
		}
	}
}
</style>
