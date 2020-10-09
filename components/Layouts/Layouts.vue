<template>
	<view class="layouts">
		<view class="mask" v-if="loading">
			<image src="/static/image/loading.jpg"></image>
			<!-- <view class="tips">正在加载中…</view> -->
		</view>
		<slot></slot>
	</view>
</template>

<script>
export default {
	props: {
		loading: Boolean
	}
}
</script>

<style lang="scss" scoped>
.layouts {
	
}
.mask {
	position: fixed;
	z-index: 10000;
	width: 100vw;
	height: 100vh;
	background: #fff;
	display: flex;
	align-items: center;
	flex-flow: column;
	text-align: center;
	> image {
		// padding-top: 200rpx;
		width: 100%;
		height: 100%;
	}
	.tips {
		display: inline-block;
		padding-top: 30rpx;
		margin-left: 20rpx;
		text-align: center;
		font-size: 32rpx;
		color: rgba(0, 0, 0, 0.7);
	}
}
</style>
