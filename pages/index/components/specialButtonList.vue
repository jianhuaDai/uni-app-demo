<template>
	<view class="button-list">
		<template v-if="buttonList.length <= 1">
			<view @click="onClick(buttonList[0], 0)" class="one-button">{{ buttonList[0].name }}</view>
		</template>
		<template v-else>
			<template v-for="(item, index) in buttonList">
				<view :class="[!hasOverFiveWords ? 'many-button' : 'long-width-btn', { 'check-button': item.check }]" @click="onClick(item, index)" :key="index">{{ item.name }}</view>
			</template>
		</template>
	</view>
</template>

<script>
export default {
	props: {
		list: {
			type: Array,
			default() {
				return []
			}
		}
	},
	watch: {
		list: {
			deep: true,
			immediate: true,
			handler(list) {
				this.hasOverFiveWords = list.some((item) => {
					return item.button.length > 4
				})
				this.buttonList = []
				this.buttonList = list.map(item => {
					return {
						...item,
						check: false,
						name: item.button
					}
				})
			}
		}
	},
	data() {
		return {
			buttonList: [],
			hasOverFiveWords: false
		}
	},
	methods: {
		onClick(item, index) {
			this.buttonList.map(li => {
				li.check = false
			})
			this.buttonList[index].check = true
			this.$emit('back', item)
		}
	},
}
</script>

<style lang="scss" scoped>
.button-list {
	position: absolute;
	bottom: 25rpx;
	width: 750rpx;
	display: flex;
	box-sizing: border-box;
	flex-flow: wrap;
	padding: 0 70rpx;
	justify-content: center;
}
.one-button {
	position: fixed;
	left: 21vw;
	bottom: 50rpx;
	height: 90rpx;
	text-align: center;
	line-height: 90rpx;
	background: rgba(255, 255, 255, 0.94);
	font-size: 30rpx;
	font-weight: 600;
    color: #2AAF6F;
	width: 58vw;
	border-radius: 45rpx;
}
.many-button {
	width: 204rpx;
	height: 90rpx;
	line-height: 90rpx;
	text-align: center;
	font-weight: 600;
	color: #2AAF6F;
	font-size: 30rpx;
	background: rgba(255, 255, 255, 0.94);
	border-radius: 45rpx;
	margin-bottom: 20rpx;
	margin-right: 10rpx;
	margin-left: 45rpx;
}
.long-width-btn {
	width: 420rpx;
	height: 90rpx;
	line-height: 90rpx;
	text-align: center;
	font-weight: 600;
	color: #2AAF6F;
	font-size: 30rpx;
	background: rgba(255, 255, 255, 0.94);
	border-radius: 45rpx;
	margin-bottom: 20rpx;
	margin-right: 10rpx;
	margin-left: 10rpx;
}
.check-button {
	font-weight: bold;
	color: #fff;
	background: #008845;
}
</style>
