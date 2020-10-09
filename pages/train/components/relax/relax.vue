<template>
	<view class="relax">
		<view v-for="(item, index) in list" :key="index" class="pic-area" @click="jumpToAudio(item.cfgCode)">
			<image :src="item.cardImg"></image>
			<view class="text-area">
				<view class="title">{{ item.cardName }}</view>
				<view class="content">{{ item.cardDesc }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import vuex from '@/store/index.js';
// const list = [
// 	{
// 		id: '1',
// 		imgUrl: '../../../../static/image/breath_bg.png',
// 		title: '呼吸训练',
// 		content: '专注呼吸的体验 觉察身体 觉察自我 培养应对思绪的能力',
// 		cfgCode: 'breathing'
// 	},
// 	{
// 		id: '2',
// 		imgUrl: '../../../../static/image/think_bg.png',
// 		title: '想象放松',
// 		content: '专注呼吸的体验 觉察身体 觉察自我 培养应对思绪的能力',
// 		cfgCode: 'imagine'
// 	},
// 	{
// 		id: '3',
// 		imgUrl: '../../../../static/image/muscle_bg.png',
// 		title: '肌肉放松',
// 		content: '专注呼吸的体验 觉察身体 觉察自我 培养应对思绪的能力',
// 		cfgCode: 'muscle'
// 	}
// ]
export default {
	data() {
		return {
			btnList: []
		};
	},
	props: {
		list: Array,
		taskId: String
	},
	created() {
	},
	methods: {
		async jumpToAudio(cfgCode) {
			console.log(cfgCode, 'cfgCode')
			const data = {
				cfgCode: cfgCode,
				sentence: '',
				seqId: '',
				taskId: vuex.state.taskId,
				exchangeType: 'start',
				userNick: vuex.state.nickname || '234',
				username: vuex.state.username || '17602530327'
			};
			// 调取exchange话术接口
			const [err, suc] =await this.$api.Communicate.exchange({
				data: data
			})
			if (err) return false;
			let { answer, seqId, cbtEndState, taskId } = suc;
			if (cbtEndState === 1 && answer.nodeType === 0) {
				answer.cfgCode = cfgCode;
				answer.seqId = seqId;
				answer.taskId = taskId;
				uni.navigateTo({
					url: '../audio/index',
					events: {
						// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
						sendAnswer: data => {}
					},
					success: response => {
						response.eventChannel.emit('sendAnswer', answer);
					}
				});
				return
			}
			uni.navigateTo({
				url: '/pages/index/index',
				events: {
					sendTrainAnswer: (data) => {
						console.log(data)
					}
				},
				success: (response) => {
					response.eventChannel.emit('sendTrainAnswer',
							{
								answer: answer,
								seqId: seqId,
								cfgCode: cfgCode
							}
					)
				},
				fail: (err) => {
					console.log(err, 'err')
				}
			})
		}
	}
};
</script>

<style lang="less" scoped>
.relax {
	padding-top: 30rpx;
	.pic-area {
		text-align: center;
		padding: 10rpx;
		position: relative;
		image {
			width: 670rpx;
			height: 250rpx;
		}
		.text-area {
			position: absolute;
			top: 77rpx;
			width: 100vw;
			text-align: center;
			.title {
				font-size: 46rpx;
				color: #ffffff;
				height: 61rpx;
				line-height: 61rpx;
			}
			.content {
				color: #ffffff;
				margin-top: 8rpx;
				font-size: 20rpx;
			}
		}
	}
}
</style>
