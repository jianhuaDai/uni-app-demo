<template>
	<view class="progress-options">
		<template v-for="(item, index) in emojiList">
			<view class="options" :key="index">
				<image @click="onClick(item)" class="emoji" :src="item.url"></image>
				<view class="fraction">{{ item.tem }}</view>
			</view>
		</template>
	</view>
</template>

<script>
export default {
	data() {
		return {
			emojiList: [
				{url: '/static/image/unhappy.png', code: 3, tem: '0-4'},
				{url: '/static/image/cry.png', code: 6, tem: '4-7'},
				{url: '/static/image/crying.png', code: 9, tem: '7-10'}
			]
		}
	},
	methods: {
		onClick(item) {
			this.$emit('back', item.code)
		}
	}
}
</script>

<style lang="scss" scoped>
.progress-options {
	position: absolute;
	bottom: 25rpx;
	display: flex;
	width: 750rpx;
	justify-content: center;
}
.options {
	display: flex;
	flex-flow: column;
	justify-content: center;
	text-align: center;
	color: #323D38;
	font-size: 42rpx;
	font-weight: bold;
	> image {
		width: 80rpx;
		height: 80rpx;
		margin: 18rpx 28rpx;
	}
	.fraction {
		font-size: 26rpx;
		color: #FFFFFF;
	}
}
</style>
