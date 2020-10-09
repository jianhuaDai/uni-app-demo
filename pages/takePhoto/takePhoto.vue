<template>
	<view>
		<camera :device-position="devicePosition" flash="off" binderror="error" style="margin-left: 50rpx;width: 300rpx; height: 300rpx;"></camera>
		<button @click="openCamera">拍照</button>
		<button @click="devicePositionChange">前后切换</button>
		<image style="margin-left: 50rpx;width: 300rpx; height: 300rpx;" :src="src"></image>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cameraText: null,
			src: '',
			devicePosition: 'back'
		};
	},
	methods: {
		openCamera() {
			console.log('拍照！');
			this.cameraText = uni.createCameraContext();
			this.cameraText.takePhoto({
				 success: (res) => {
					 this.src = res.tempImagePath;
				 }
			});
		},
		devicePositionChange() {
			this.devicePosition = this.devicePosition == 'back' ? 'front' : 'back'
		}
	}
};
</script>

<style></style>
