<template>
	<view class="home-container">
		<!-- 搜索栏 -->
		<view class="search-section">
			<u-search 
				placeholder="搜索维修服务" 
				v-model="searchKeyword"
				:show-action="false"
				@search="handleSearch"
				@custom="handleSearch"
			></u-search>
		</view>

		<!-- 轮播图 -->
		<view class="banner-section">
			<u-swiper 
				:list="bannerList" 
				:indicator="true"
				:autoplay="true"
				:circular="true"
				@change="handleBannerChange"
			></u-swiper>
		</view>

		<!-- 服务分类 -->
		<view class="category-section">
			<view class="section-title">
				<text class="title-text">维修服务</text>
			</view>
			<u-grid :col="4" :border="false">
				<u-grid-item 
					v-for="(item, index) in serviceCategories" 
					:key="index"
					@tap="handleCategoryClick(item)"
				>
					<u-image 
						:src="item.icon" 
						width="48" 
						height="48"
						border-radius="8"
					></u-image>
					<text class="category-name">{{ item.name }}</text>
				</u-grid-item>
			</u-grid>
		</view>

		<!-- 热门服务 -->
		<view class="hot-service-section">
			<view class="section-title">
				<text class="title-text">热门服务</text>
				<text class="more-text" @tap="handleMoreHot">更多 ></text>
			</view>
			<scroll-view scroll-x class="hot-service-scroll">
				<view class="hot-service-list">
					<view 
						class="hot-service-item" 
						v-for="(item, index) in hotServices" 
						:key="index"
						@tap="handleServiceClick(item)"
					>
						<u-image 
							:src="item.image" 
							width="120" 
							height="90"
							border-radius="8"
						></u-image>
						<text class="service-name">{{ item.name }}</text>
						<text class="service-price">¥{{ item.price }}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 推荐服务 -->
		<view class="recommend-section">
			<view class="section-title">
				<text class="title-text">推荐服务</text>
			</view>
			<view class="service-list">
				<view 
					class="service-card" 
					v-for="(item, index) in recommendServices" 
					:key="index"
					@tap="handleServiceClick(item)"
				>
					<u-image 
						:src="item.image" 
						width="100" 
						height="100"
						border-radius="8"
					></u-image>
					<view class="service-info">
						<text class="service-title">{{ item.name }}</text>
						<text class="service-desc">{{ item.description }}</text>
						<view class="service-bottom">
							<text class="service-price">¥{{ item.price }}</text>
							<text class="service-sales">已服务 {{ item.sales }} 次</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchKeyword: '',
			bannerList: [
				'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=750&h=300&fit=crop',
				'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=750&h=300&fit=crop',
				'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=750&h=300&fit=crop'
			],
			serviceCategories: [
				{ name: '空调维修', icon: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=48&h=48&fit=crop' },
				{ name: '冰箱维修', icon: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=48&h=48&fit=crop' },
				{ name: '洗衣机维修', icon: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=48&h=48&fit=crop' },
				{ name: '电视维修', icon: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=48&h=48&fit=crop' },
				{ name: '热水器维修', icon: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=48&h=48&fit=crop' },
				{ name: '燃气灶维修', icon: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=48&h=48&fit=crop' },
				{ name: '微波炉维修', icon: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=48&h=48&fit=crop' },
				{ name: '更多服务', icon: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=48&h=48&fit=crop' }
			],
			hotServices: [
				{ name: '空调清洗', price: 88, image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=120&h=90&fit=crop' },
				{ name: '冰箱除味', price: 68, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=90&fit=crop' },
				{ name: '洗衣机清洗', price: 128, image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=120&h=90&fit=crop' },
				{ name: '热水器清洗', price: 158, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=90&fit=crop' }
			],
			recommendServices: [
				{ 
					name: '空调维修', 
					description: '专业空调维修，快速上门服务', 
					price: 150, 
					sales: 1280,
					image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=100&h=100&fit=crop'
				},
				{ 
					name: '冰箱维修', 
					description: '冰箱不制冷，噪音大等问题维修', 
					price: 200, 
					sales: 856,
					image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop'
				},
				{ 
					name: '洗衣机维修', 
					description: '洗衣机故障维修，专业师傅上门', 
					price: 180, 
					sales: 642,
					image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=100&h=100&fit=crop'
				},
				{ 
					name: '电视维修', 
					description: '电视黑屏，花屏等问题维修', 
					price: 120, 
					sales: 423,
					image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop'
				}
			]
		}
	},
	onLoad() {
		this.initData()
	},
	methods: {
		initData() {
			// 初始化数据
			console.log('首页数据初始化')
		},
		handleSearch(value) {
			uni.navigateTo({
				url: `/pages/common/search/search?keyword=${encodeURIComponent(value)}`
			})
		},
		handleBannerChange(index) {
			console.log('轮播图切换:', index)
		},
		handleCategoryClick(item) {
			if (item.name === '更多服务') {
				uni.switchTab({
					url: '/pages/customer/service/list'
				})
			} else {
				uni.navigateTo({
					url: `/pages/customer/service/list?category=${encodeURIComponent(item.name)}`
				})
			}
		},
		handleServiceClick(item) {
			uni.navigateTo({
				url: `/pages/customer/service/detail`
			})
		},
		handleMoreHot() {
			uni.switchTab({
				url: '/pages/customer/service/list'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.home-container {
	padding: 20rpx;
	background-color: #f8f8f8;
	min-height: 100vh;
}

.search-section {
	margin-bottom: 20rpx;
}

.banner-section {
	margin-bottom: 30rpx;
	border-radius: 16rpx;
	overflow: hidden;
}

.category-section {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx 20rpx;
	margin-bottom: 20rpx;
}

.section-title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.title-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.more-text {
	font-size: 26rpx;
	color: #999999;
}

.category-name {
	font-size: 24rpx;
	color: #666666;
	margin-top: 10rpx;
}

.hot-service-section {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx 20rpx;
	margin-bottom: 20rpx;
}

.hot-service-scroll {
	height: 220rpx;
}

.hot-service-list {
	display: flex;
	flex-direction: row;
	gap: 20rpx;
}

.hot-service-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 140rpx;
}

.service-name {
	font-size: 26rpx;
	color: #333333;
	margin-top: 10rpx;
}

.service-price {
	font-size: 28rpx;
	color: #ff6b35;
	font-weight: bold;
	margin-top: 6rpx;
}

.recommend-section {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx 20rpx;
	margin-bottom: 20rpx;
}

.service-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.service-card {
	display: flex;
	flex-direction: row;
	padding: 20rpx;
	background-color: #f9f9f9;
	border-radius: 12rpx;
	gap: 20rpx;
}

.service-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.service-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 8rpx;
}

.service-desc {
	font-size: 26rpx;
	color: #666666;
	margin-bottom: 12rpx;
	flex: 1;
}

.service-bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.service-sales {
	font-size: 24rpx;
	color: #999999;
}
</style>