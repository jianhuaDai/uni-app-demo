<template>
	<view class="type-button">
		<template v-if="isdouble">
			<div @click="cancel" class="cancel-button">{{ canceltext }}</div>
			<div @click="ok" class="ok-button">{{ text  }}</div>
		</template>
		<template v-else>
			<div @click="ok" class="one-button">{{ text }}</div>
		</template>
	</view>
</template>

<script>
export default {
	props: {
		text: String,
		canceltext: String,
		isdouble: Boolean // 是否是双按钮
	},
	methods: {
		ok() {
			this.$emit('ok')
		},
		cancel() {
			this.$emit('cancel')
		}
	}
}
</script>

<style lang="scss" scoped>
.one-button {
	position: fixed;
	left: 70rpx;
	bottom: 90rpx;
	height: 80rpx;
	text-align: center;
	line-height: 80rpx;
	background: #008845;
	font-size: 34rpx;
	color: #fff;
	width: 610rpx;
	border-radius: 45rpx;
}
.type-button {
	position: fixed;
	width: 750rpx;
	bottom: 90rpx;
	display: flex;
	box-sizing: border-box;
	padding: 0 70rpx;
	justify-content: space-between;
}
.cancel-button, .ok-button {
	width: 260rpx;
	text-align: center;
	line-height: 70rpx;
	height: 70rpx;
	background: #008845;
	text-align: center;
	font-size: 30rpx;
	color: #fff;
	border-radius: 6rpx;
}
.cancel-button {
	background: #fff;
	color: #000;
}
</style>
