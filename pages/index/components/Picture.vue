<template>
	<view class="main">
		<image class="picture" src=""></image>
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
				return ['继续', '明白了'];
			}
		}
	},
	watch: {
		list: {
			deep: true,
			immediate: true,
			handler(list) {
				this.buttonList = [];
				this.buttonList = list.map((item, index) => {
					return {
						check: index % 2 == 0 ? false : true,
						name: item
					};
				});
			}
		}
	},
	data() {
		return {
			buttonList: []
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
	bottom: 0;
	width: 100vw;
	text-align: center;
	.picture {
		height: 386rpx;
		width: 670rpx;
		margin-bottom: 50rpx;
	}
	.button-list {
		width: 100vw;
		display: flex;
		box-sizing: border-box;
		flex-flow: wrap;
		padding: 0 70rpx;
		justify-content: center;
		.many-btn {
			width: 204rpx;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			color: rgba(0, 0, 0, 0.6);
			font-size: 36rpx;
			background: #fff;
			border-radius: 45rpx;
			margin-bottom: 50rpx;
			margin-left: 26rpx;
		}
		.check-button {
			font-weight: bold;
			color: #fff;
			background: #008845;
		}
	}
}
</style>
