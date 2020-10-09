<template>
	<view class="main">
		<image class="picture" src="../../../static/image/bg_btn_img.png"></image>
		<!-- <view class="train-text"><text class="text">放松练习</text></view>
		<view class="think-text">冥想放松</view> -->
		<view class="button-list">
			<template v-for="(item, index) in buttonList">
				<view class="many-btn" :class="{ 'check-button': item.check }" @click="onClick(item, index)" :key="index">{{ item.name }}</view>
			</template>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		list: {
			type: Array,
			default() {
				return ['停止', '继续'];
			}
		},
		bgImage: {
			type: String,
			default: ''
		}
	},
	// watch: {
	// 	list: {
	// 		deep: true,
	// 		immediate: true,
	// 		handler(list) {
	// 			this.buttonList = [];
	// 			this.buttonList = list.map((item, index) => {
	// 				return {
	// 					check: index % 1 == 0 ? false : true,
	// 					name: item
	// 				};
	// 			});
	// 		}
	// 	}
	// },
	data() {
		return {
			buttonList: [
				{
					check: false,
					name: '退出'
				},
				{
					check: true,
					name: '继续'
				}
			]
		};
	},
	methods: {
		onClick(item, index) {
			this.buttonList.map(li => {
				li.check = false;
			});
			this.buttonList[index].check = true;
			this.$emit('back', item.name);
		}
	}
};
</script>

<style scoped lang="less">
.main {
	position: absolute;
	width: 100vw;
	bottom: 0;
	height: 460rpx;
	text-align: center;
	z-index: 101;
	.picture {
		height: 100%;
		width: 100vw;
		// margin-bottom: 50rpx;
	}
	// .train-text {
	// 	position: absolute;
	// 	top: 65rpx;
	// 	text-align: center;
	// 	width: 100vw;
	// 	.text {
	// 		padding: 6rpx 10rpx;
	// 		background-color: rgba(0, 0, 0, 0.7);
	// 		border-radius: 30rpx;
	// 		color: #FFFFFF;
	// 		font-size: 26rpx;
	// 		height: 37rpx;
	// 		line-height: 37rpx;
	// 	}
	// }
	// .think-text {
	// 	position: absolute;
	// 	top: 130rpx;
	// 	text-align: center;
	// 	width: 100vw;
	// 	font-size: 52rpx;
	// 	color: #FFFFFF;
	// }
	.button-list {
		position: absolute;
		bottom: 154rpx;
		width: 100vw;
		display: flex;
		box-sizing: border-box;
		flex-flow: wrap;
		padding: 0 70rpx;
		justify-content: center;
		.many-btn {
			width: 243rpx;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			color: #2AAF6F;
			font-size: 36rpx;
			background: #fff;
			border-radius: 45rpx;
			margin-right: 14rpx;
		}
		.many-btn:nth-child(2) {
			width: 243rpx;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			color: #2AAF6F;
			font-size: 36rpx;
			background: #fff;
			border-radius: 45rpx;
			margin-left: 14rpx;
		}
		.check-button {
			color: #fff!important;
			background: #1EAA67!important;
		}
	}
}
</style>
