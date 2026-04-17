<template>
	<view class="service-list-container">
		<!-- 分类标签 -->
		<view class="category-tabs">
			<scroll-view scroll-x class="tabs-scroll" :scroll-left="scrollLeft">
				<view class="tabs-content">
					<view 
						class="tab-item" 
						v-for="(tab, index) in categoryTabs" 
						:key="index"
						:class="{ active: currentTab === index }"
						@tap="handleTabChange(index)"
					>
						<image :src="tab.iconPath" mode="aspectFit" class="tab-icon"></image>
						<text class="tab-text">{{ tab.name }}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 筛选栏 -->
		<view class="filter-section">
			<view class="filter-item" @tap="showPriceFilter = true">
				<text>价格</text>
				<u-icon name="arrow-down" size="12"></u-icon>
			</view>
			<view class="filter-item" @tap="showSortFilter = true">
				<text>排序</text>
				<u-icon name="arrow-down" size="12"></u-icon>
			</view>
			<view class="filter-item" @tap="showLocationFilter = true">
				<text>区域</text>
				<u-icon name="arrow-down" size="12"></u-icon>
			</view>
		</view>

		<!-- 服务列表 -->
		<view class="service-list">
			<u-empty 
				v-if="serviceList.length === 0" 
				text="暂无相关服务"
				mode="list"
			></u-empty>
			
			<view 
				v-else
				class="service-item" 
				v-for="(item, index) in serviceList" 
				:key="index"
				@tap="handleServiceClick(item)"
			>
				<u-image 
					:src="item.image" 
					width="200" 
					height="150"
					border-radius="8"
					mode="aspectFill"
				></u-image>
				<view class="service-content">
					<text class="service-title">{{ item.name }}</text>
					<text class="service-desc">{{ item.description }}</text>
					<view class="service-tags">
						<u-tag 
							text="上门服务" 
							type="success" 
							size="mini"
							v-if="item.isDoorService"
						></u-tag>
						<u-tag 
							text="质保一年" 
							type="primary" 
							size="mini"
							v-if="item.hasWarranty"
						></u-tag>
					</view>
					<view class="service-bottom">
						<view class="price-section">
							<text class="price-symbol">¥</text>
							<text class="price">{{ item.price }}</text>
							<text class="price-unit">起</text>
						</view>
						<view class="stats-section">
							<text class="sales">已服务{{ item.sales }}次</text>
							<u-rate 
								:current="item.rating" 
								disabled 
								size="16"
							></u-rate>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 加载更多 -->
		<u-loadmore 
			:status="loadStatus" 
			v-if="serviceList.length > 0"
			@loadmore="loadMoreData"
		></u-loadmore>

		<!-- 价格筛选弹窗 -->
		<u-popup 
			v-model="showPriceFilter" 
			mode="bottom"
			border-radius="16"
		>
			<view class="filter-popup">
				<view class="popup-header">
					<text class="popup-title">价格筛选</text>
					<text class="popup-close" @tap="showPriceFilter = false">关闭</text>
				</view>
				<view class="price-range">
					<u-input 
						v-model="minPrice" 
						type="number"
						placeholder="最低价格"
						border="bottom"
					></u-input>
					<text class="range-separator">-</text>
					<u-input 
						v-model="maxPrice" 
						type="number"
						placeholder="最高价格"
						border="bottom"
					></u-input>
				</view>
				<u-button 
					type="primary" 
					@tap="confirmPriceFilter"
				>确定</u-button>
			</view>
		</u-popup>

		<!-- 排序筛选弹窗 -->
		<u-action-sheet 
			:list="sortOptions" 
			v-model="showSortFilter"
			@click="handleSortSelect"
		></u-action-sheet>

		<!-- 区域筛选弹窗 -->
		<u-picker 
			mode="selector" 
			v-model="showLocationFilter"
			:default-selector="[0]"
			:range="locationOptions"
			@confirm="handleLocationSelect"
		></u-picker>
	</view>
</template>

<script>
export default {
	data() {
		return {
			categoryTabs: [
				{ name: '全部', iconPath: '/static/category/all.svg' },
				{ name: '空调维修', iconPath: '/static/category/air-conditioner.svg' },
				{ name: '冰箱维修', iconPath: '/static/category/refrigerator.svg' },
				{ name: '洗衣机维修', iconPath: '/static/category/washing-machine.svg' },
				{ name: '电视维修', iconPath: '/static/category/tv.svg' },
				{ name: '热水器维修', iconPath: '/static/category/water-heater.svg' },
				{ name: '燃气灶维修', iconPath: '/static/category/gas-stove.svg' },
				{ name: '微波炉维修', iconPath: '/static/category/microwave.svg' }
			],
			currentTab: 0,
			scrollLeft: 0,
			serviceList: [],
			loadStatus: 'loadmore',
			page: 1,
			pageSize: 10,
			showPriceFilter: false,
			showSortFilter: false,
			showLocationFilter: false,
			minPrice: '',
			maxPrice: '',
			sortOptions: [
				{ text: '综合排序' },
				{ text: '价格从低到高' },
				{ text: '价格从高到低' },
				{ text: '销量优先' },
				{ text: '评分优先' }
			],
			locationOptions: ['全部区域', '朝阳区', '海淀区', '西城区', '东城区', '丰台区', '石景山区', '通州区'],
			currentCategory: '全部'
		}
	},
	onLoad(options) {
		if (options.category) {
			const categoryIndex = this.categoryTabs.findIndex(item => item.name === options.category)
			if (categoryIndex !== -1) {
				this.currentTab = categoryIndex
				this.currentCategory = options.category
			}
		}
		this.loadServiceList()
	},
	onReachBottom() {
		if (this.loadStatus === 'loadmore') {
			this.loadMoreData()
		}
	},
	onPullDownRefresh() {
		this.page = 1
		this.serviceList = []
		this.loadServiceList()
		uni.stopPullDownRefresh()
	},
	methods: {
		loadServiceList() {
			// 模拟加载服务列表
			const mockData = [
				{
					id: 1,
					name: '空调维修',
					description: '专业空调维修，不制冷，漏水，噪音大等问题快速解决',
					price: 150,
					image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=200&h=150&fit=crop',
					sales: 1280,
					rating: 4.8,
					isDoorService: true,
					hasWarranty: true
				},
				{
					id: 2,
					name: '冰箱维修',
					description: '冰箱不制冷，结霜严重，噪音大等问题专业维修',
					price: 200,
					image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop',
					sales: 856,
					rating: 4.7,
					isDoorService: true,
					hasWarranty: true
				},
				{
					id: 3,
					name: '洗衣机维修',
					description: '洗衣机不排水，不脱水，噪音大等问题快速修复',
					price: 180,
					image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=200&h=150&fit=crop',
					sales: 642,
					rating: 4.6,
					isDoorService: true,
					hasWarranty: true
				},
				{
					id: 4,
					name: '电视维修',
					description: '电视黑屏，花屏，无声音等问题专业维修',
					price: 120,
					image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop',
					sales: 423,
					rating: 4.5,
					isDoorService: true,
					hasWarranty: true
				}
			]
			
			setTimeout(() => {
				this.serviceList = [...this.serviceList, ...mockData]
				this.loadStatus = this.serviceList.length >= 20 ? 'nomore' : 'loadmore'
			}, 1000)
		},
		loadMoreData() {
			if (this.loadStatus === 'nomore') return
			this.loadStatus = 'loading'
			this.page++
			
			setTimeout(() => {
				this.loadServiceList()
				this.loadStatus = 'loadmore'
			}, 1500)
		},
		handleTabChange(index) {
			this.currentTab = index
			this.currentCategory = this.categoryTabs[index].name
			this.page = 1
			this.serviceList = []
			
			// 计算滚动位置，使选中的标签居中
			const tabWidth = 160 // 每个标签的宽度
			const screenWidth = 375 // 屏幕宽度
			const scrollLeft = tabWidth * index - (screenWidth / 2) + (tabWidth / 2)
			this.scrollLeft = scrollLeft > 0 ? scrollLeft : 0
			
			this.loadServiceList()
		},
		handleServiceClick(item) {
			uni.navigateTo({
				url: `/pages/customer/service/detail?id=${item.id}`
			})
		},
		confirmPriceFilter() {
			this.showPriceFilter = false
			this.page = 1
			this.serviceList = []
			this.loadServiceList()
		},
		handleSortSelect(index) {
			console.log('排序选择:', index)
			this.page = 1
			this.serviceList = []
			this.loadServiceList()
		},
		handleLocationSelect(e) {
			console.log('区域选择:', e)
			this.page = 1
			this.serviceList = []
			this.loadServiceList()
		}
	}
}
</script>

<style lang="scss" scoped>
.service-list-container {
	background-color: #f8f8f8;
	min-height: 100vh;
}

.category-tabs {
	background-color: #ffffff;
	padding: 20rpx 0;
	position: sticky;
	top: 0;
	z-index: 100;
}

.tabs-scroll {
	white-space: nowrap;
	width: 100%;
}

.tabs-content {
	display: inline-flex;
	padding: 0 20rpx;
}

.tab-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 10rpx 20rpx;
	margin-right: 20rpx;
	min-width: 140rpx;
	border-radius: 30rpx;
	background-color: #f5f5f5;
	transition: all 0.3s;
	
	&.active {
		background-color: #ff6b35;
		
		.tab-text {
			color: #ffffff;
		}
	}
	
	.tab-icon {
		width: 40rpx;
		height: 40rpx;
		margin-bottom: 6rpx;
	}
	
	.tab-text {
		font-size: 24rpx;
		color: #666666;
		white-space: nowrap;
	}
}

.filter-section {
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: #ffffff;
	padding: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.filter-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 28rpx;
	color: #666666;
}

.service-list {
	padding: 20rpx;
}

.service-item {
	display: flex;
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	gap: 20rpx;
}

.service-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.service-title {
	font-size: 32rpx;
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

.service-tags {
	display: flex;
	gap: 10rpx;
	margin-bottom: 16rpx;
}

.service-bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.price-section {
	display: flex;
	align-items: baseline;
	gap: 4rpx;
}

.price-symbol {
	font-size: 24rpx;
	color: #ff6b35;
}

.price {
	font-size: 36rpx;
	color: #ff6b35;
	font-weight: bold;
}

.price-unit {
	font-size: 24rpx;
	color: #999999;
}

.stats-section {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 8rpx;
}

.sales {
	font-size: 24rpx;
	color: #999999;
}

.filter-popup {
	padding: 40rpx;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.popup-close {
	font-size: 28rpx;
	color: #999999;
}

.price-range {
	display: flex;
	align-items: center;
	gap: 20rpx;
	margin-bottom: 40rpx;
}

.range-separator {
	font-size: 28rpx;
	color: #666666;
}
</style>