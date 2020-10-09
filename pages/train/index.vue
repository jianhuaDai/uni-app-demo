<template>
	<view class="main">
		<!-- 头部tabs -->
		<view class="tabs-nav">
			<view v-for="(item, index) in tabs" :key="index" class="tab" :class="{ 'active-tab': activeIndex == index }" @click="tabClick(index)">
				{{ item }}
				<view class="under_line"></view>
			</view>
		</view>
		<view class="tabs-content"><Relax :list="list" :taskId="taskId"></Relax></view>
	</view>
</template>

<script>
import Relax from './components/relax/relax';
export default {
	components: {
		Relax
	},
	data() {
		return {
			activeIndex: 0,
			tabs: [],
			relaxArr: [],
			list: []
		};
	},
	computed: {
		filePrefix() {
			return this.$store.state.filePrefix;
		}
	},
	async created() {
		this.getList();
	},
	onShow() {},
	onHide() {},
	onLoad() {
		const eventChannel = this.getOpenerEventChannel();
		eventChannel.on('getAnswer', (taskId) => {
			this.taskId = taskId;
		  })
	},
	methods: {
		tabClick(index) {
			this.activeIndex = index;
			this.list = this.relaxArr[this.activeIndex];
		},
		async getList() {
			const [err, data] = await this.$api.Communicate.cardQuery({
				proCode: 0
			});
			if (err) return false;
			console.log(data, 'dadasdsadsads')
			if (data) {
				const tabs = data.map(item => {
					return item.cardTypeName
				});
				this.tabs = Array.from(new Set(tabs));
			}
			this.tabs.forEach((item, index) => {
				this.relaxArr[index] = data.filter((ele) => {
					return ele.cardTypeName == item
				}).map((child) => {
					return {
						...child,
						cardImg: this.filePrefix + child.cardImg
					}
				})
			})
			this.list = this.relaxArr[0];
		}
	}
};
</script>

<style scoped lang="less">
.main {
	.tabs-nav {
		display: flex;
		height: 56rpx;
		line-height: 56rpx;
		.tab {
			width: 50vw;
			text-align: center;
			font-size: 32rpx;
			font-weight: 500;
			height: 56rpx;
			line-height: 56rpx;
		}
		.active-tab {
			color: #1eaa67;
			position: relative;
			.under_line {
				position: absolute;
				bottom: 0;
				left: calc(25vw - 18.5rpx);
				height: 7rpx;
				width: 37rpx;
				background-color: #1eaa67;
			}
		}
	}
	.tabs-content {
		height: calc(100vh - 56rpx);
		background-color: #f1f1f1;
	}
}
</style>
