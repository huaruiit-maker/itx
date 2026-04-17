<template>
	<view class="master-order-list-container">
		<!-- 订单状态标签 -->
		<view class="order-tabs">
			<view 
				class="tab-item" 
				v-for="tab in orderTabs" 
				:key="tab.value"
				:class="{ active: currentTab === tab.value }"
				@click="changeTab(tab.value)"
			>
				<text class="tab-text">{{ tab.label }}</text>
				<view class="tab-count" v-if="tab.count > 0">{{ tab.count }}</view>
			</view>
		</view>

		<!-- 筛选栏 -->
		<view class="filter-section">
			<view class="filter-item" @click="showDistanceFilter = true">
				<u-icon name="map" size="24" color="#666666"></u-icon>
				<text class="filter-text">{{ distanceFilter.label }}</text>
				<u-icon name="arrow-down" size="16" color="#999999"></u-icon>
			</view>
			<view class="filter-item" @click="showPriceFilter = true">
				<u-icon name="rmb" size="24" color="#666666"></u-icon>
				<text class="filter-text">{{ priceFilter.label }}</text>
				<u-icon name="arrow-down" size="16" color="#999999"></u-icon>
			</view>
			<view class="filter-item" @click="showSortFilter = true">
				<u-icon name="sort" size="24" color="#666666"></u-icon>
				<text class="filter-text">{{ sortFilter.label }}</text>
				<u-icon name="arrow-down" size="16" color="#999999"></u-icon>
			</view>
		</view>

		<!-- 订单列表 -->
		<scroll-view 
			scroll-y 
			class="order-list" 
			@scrolltolower="loadMore"
			refresher-enabled
			@refresherrefresh="onRefresh"
			:refresher-triggered="isRefreshing"
		>
			<view class="order-item" v-for="order in orderList" :key="order.id">
				<view class="order-header">
					<view class="order-info">
						<text class="order-id">订单号：{{ order.orderNo }}</text>
						<text class="order-time">{{ order.createTime }}</text>
					</view>
					<view class="order-status">
						<u-tag 
							:text="getStatusText(order.status)" 
							:type="getStatusType(order.status)"
							size="mini"
						></u-tag>
					</view>
				</view>

				<view class="order-content">
					<view class="service-info">
						<u-image 
							:src="order.serviceImage" 
							width="120rpx" 
							height="120rpx"
							border-radius="8"
							mode="aspectFill"
						></u-image>
						<view class="service-details">
							<text class="service-name">{{ order.serviceName }}</text>
							<text class="service-desc">{{ order.serviceDesc }}</text>
							<view class="service-price">
								<text class="price-label">服务费用：</text>
								<text class="price-value">¥{{ order.servicePrice }}</text>
							</view>
						</view>
					</view>

					<view class="customer-info">
						<view class="customer-header">
							<u-icon name="account" size="24" color="#666666"></u-icon>
							<text class="customer-name">{{ order.customerName }}</text>
							<u-icon name="phone" size="24" color="#007AFF" @click="makePhoneCall(order.customerPhone)"></u-icon>
						</view>
						<view class="customer-address">
							<u-icon name="map" size="24" color="#666666"></u-icon>
							<text class="address-text">{{ order.customerAddress }}</text>
							<text class="distance">{{ order.distance }}km</text>
						</view>
					</view>

					<view class="order-time-info" v-if="order.appointmentTime">
						<view class="time-item">
							<u-icon name="clock" size="24" color="#666666"></u-icon>
							<text class="time-text">预约时间：{{ order.appointmentTime }}</text>
						</view>
					</view>
				</view>

				<view class="order-actions">
					<view class="action-left">
						<u-button 
							type="primary" 
							size="mini" 
							plain
							icon="map"
							@click="navigateToCustomer(order)"
						>
							导航
						</u-button>
						<u-button 
							type="info" 
							size="mini" 
							plain
							icon="file-text"
							@click="viewOrderDetail(order)"
						>
							详情
						</u-button>
					</view>
					<view class="action-right">
						<u-button 
							v-if="order.status === 'pending'"
							type="success" 
							size="mini"
							icon="checkmark"
							@click="acceptOrder(order)"
						>
							接单
						</u-button>
						<u-button 
							v-if="order.status === 'processing'"
							type="primary" 
							size="mini"
							icon="checkmark"
							@click="completeOrder(order)"
						>
							完成
						</u-button>
						<u-button 
							v-if="order.status === 'pending' || order.status === 'processing'"
							type="error" 
							size="mini"
							icon="close"
							@click="cancelOrder(order)"
						>
							取消
						</u-button>
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<u-loadmore 
				:status="loadStatus" 
				:load-text="loadText"
				v-if="orderList.length > 0"
			/>
		</scroll-view>

		<!-- 空状态 -->
		<view class="empty-state" v-if="orderList.length === 0 && !isLoading">
			<u-empty 
				mode="order"
				text="暂无订单"
				icon="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop"
			>
			</u-empty>
			<view class="empty-tips">
				<text>{{ getEmptyText() }}</text>
			</view>
		</view>

		<!-- 筛选弹窗 -->
		<u-picker 
			v-model="showDistanceFilter" 
			mode="selector" 
			:range="distanceOptions"
			@confirm="handleDistanceSelect"
		></u-picker>
		
		<u-picker 
			v-model="showPriceFilter" 
			mode="selector" 
			:range="priceOptions"
			@confirm="handlePriceSelect"
		></u-picker>
		
		<u-picker 
			v-model="showSortFilter" 
			mode="selector" 
			:range="sortOptions"
			@confirm="handleSortSelect"
		></u-picker>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderTabs: [
				{ label: '待接单', value: 'pending', count: 5 },
				{ label: '进行中', value: 'processing', count: 2 },
				{ label: '已完成', value: 'completed', count: 15 },
				{ label: '已取消', value: 'cancelled', count: 3 }
			],
			currentTab: 'pending',
			distanceFilter: { label: '距离', value: 'all' },
			priceFilter: { label: '价格', value: 'all' },
			sortFilter: { label: '排序', value: 'time' },
			orderList: [],
			isLoading: false,
			isRefreshing: false,
			loadStatus: 'loadmore',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '加载中...',
				nomore: '没有更多了'
			},
			showDistanceFilter: false,
			showPriceFilter: false,
			showSortFilter: false,
			distanceOptions: ['不限距离', '1km以内', '3km以内', '5km以内', '10km以内'],
			priceOptions: ['不限价格', '100元以下', '100-200元', '200-300元', '300元以上'],
			sortOptions: ['按时间排序', '按距离排序', '按价格排序', '按评分排序']
		}
	},
	onLoad() {
		this.loadOrderList()
	},
	methods: {
		loadOrderList(refresh = false) {
			if (refresh) {
				this.isRefreshing = true
			} else {
				this.isLoading = true
				this.loadStatus = 'loading'
			}
			
			// 模拟加载订单数据
			setTimeout(() => {
				const orders = [
					{
						id: 1,
						orderNo: 'WD20241201001',
						createTime: '2024-12-01 14:30',
						status: 'pending',
						serviceName: '空调清洗保养',
						serviceDesc: '挂机空调深度清洗，包含内外机清洁',
						serviceImage: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop',
						servicePrice: 120,
						customerName: '张先生',
						customerPhone: '138****1234',
						customerAddress: '北京市朝阳区建国路88号SOHO现代城A座1502室',
						distance: 2.5,
						appointmentTime: '2024-12-01 16:00'
					},
					{
						id: 2,
						orderNo: 'WD20241201002',
						createTime: '2024-12-01 13:15',
						status: 'processing',
						serviceName: '冰箱不制冷维修',
						serviceDesc: '冰箱不制冷故障检测与维修',
						serviceImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
						servicePrice: 200,
						customerName: '李女士',
						customerPhone: '139****5678',
						customerAddress: '北京市海淀区中关村大街1号中关村广场3号楼1201室',
						distance: 1.8,
						appointmentTime: '2024-12-01 15:30'
					},
					{
						id: 3,
						orderNo: 'WD20241201003',
						createTime: '2024-12-01 12:45',
						status: 'pending',
						serviceName: '洗衣机漏水维修',
						serviceDesc: '洗衣机底部漏水，需要检查密封圈',
						serviceImage: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=300&fit=crop',
						servicePrice: 180,
						customerName: '王女士',
						customerPhone: '137****9012',
						customerAddress: '北京市西城区金融街甲9号金融街中心15层',
						distance: 3.2,
						appointmentTime: '2024-12-01 17:00'
					}
				]
				
				if (refresh) {
					this.orderList = orders
					this.isRefreshing = false
					uni.showToast({
						title: '刷新成功',
						icon: 'success'
					})
				} else {
					this.orderList = [...this.orderList, ...orders]
					this.loadStatus = orders.length < 3 ? 'nomore' : 'loadmore'
				}
				
				this.isLoading = false
			}, 1000)
		},
		changeTab(tab) {
			this.currentTab = tab
			this.orderList = []
			this.loadOrderList(true)
		},
		loadMore() {
			if (this.loadStatus === 'loadmore') {
				this.loadOrderList()
			}
		},
		onRefresh() {
			this.orderList = []
			this.loadOrderList(true)
		},
		getStatusText(status) {
			const statusMap = {
				pending: '待接单',
				processing: '进行中',
				completed: '已完成',
				cancelled: '已取消'
			}
			return statusMap[status] || '未知状态'
		},
		getStatusType(status) {
			const typeMap = {
				pending: 'warning',
				processing: 'primary',
				completed: 'success',
				cancelled: 'info'
			}
			return typeMap[status] || 'info'
		},
		getEmptyText() {
			const emptyTextMap = {
				pending: '暂无待接单订单',
				processing: '暂无进行中订单',
				completed: '暂无已完成订单',
				cancelled: '暂无已取消订单'
			}
			return emptyTextMap[this.currentTab] || '暂无订单'
		},
		makePhoneCall(phone) {
			const realPhone = phone.replace(/\*/g, '')
			uni.makePhoneCall({
				phoneNumber: realPhone
			})
		},
		navigateToCustomer(order) {
			uni.openLocation({
				latitude: 39.9042,
				longitude: 116.4074,
				name: order.customerAddress,
				address: order.customerAddress,
				success: () => {
					console.log('导航成功')
				},
				fail: (err) => {
					uni.showToast({
						title: '导航失败',
						icon: 'error'
					})
				}
			})
		},
		viewOrderDetail(order) {
			uni.navigateTo({
				url: `/pages/master/order/detail?id=${order.id}`
			})
		},
		acceptOrder(order) {
			uni.showModal({
				title: '确认接单',
				content: `确定要接取订单 ${order.orderNo} 吗？`,
				success: (res) => {
					if (res.confirm) {
						// 模拟接单
						order.status = 'processing'
						uni.showToast({
							title: '接单成功',
							icon: 'success'
						})
						this.loadOrderList(true)
					}
				}
			})
		},
		completeOrder(order) {
			uni.showModal({
				title: '确认完成',
				content: '确定要完成该订单吗？',
				success: (res) => {
					if (res.confirm) {
						// 模拟完成订单
						order.status = 'completed'
						uni.showToast({
							title: '订单已完成',
							icon: 'success'
						})
						this.loadOrderList(true)
					}
				}
			})
		},
		cancelOrder(order) {
			uni.showModal({
				title: '取消订单',
				content: '确定要取消该订单吗？',
				success: (res) => {
					if (res.confirm) {
						// 模拟取消订单
						order.status = 'cancelled'
						uni.showToast({
							title: '订单已取消',
							icon: 'success'
						})
						this.loadOrderList(true)
					}
				}
			})
		},
		handleDistanceSelect(e) {
			this.distanceFilter = {
				label: this.distanceOptions[e[0]],
				value: e[0]
			}
			this.loadOrderList(true)
		},
		handlePriceSelect(e) {
			this.priceFilter = {
				label: this.priceOptions[e[0]],
				value: e[0]
			}
			this.loadOrderList(true)
		},
		handleSortSelect(e) {
			this.sortFilter = {
				label: this.sortOptions[e[0]],
				value: e[0]
			}
			this.loadOrderList(true)
		}
	}
}
</script>

<style lang="scss" scoped>
.master-order-list-container {
	background-color: #f8f8f8;
	min-height: 100vh;
}

.order-tabs {
	display: flex;
	background-color: #ffffff;
	padding: 0 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.tab-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 30rpx 20rpx;
	position: relative;
	cursor: pointer;
}

.tab-item.active {
	color: #007AFF;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 20rpx;
	right: 20rpx;
	height: 4rpx;
	background-color: #007AFF;
	border-radius: 2rpx;
}

.tab-text {
	font-size: 28rpx;
	font-weight: 500;
}

.tab-count {
	background-color: #FF6B35;
	color: #ffffff;
	font-size: 20rpx;
	padding: 4rpx 8rpx;
	border-radius: 12rpx;
	margin-left: 8rpx;
	min-width: 32rpx;
	text-align: center;
}

.filter-section {
	display: flex;
	background-color: #ffffff;
	padding: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.filter-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	padding: 16rpx;
	cursor: pointer;
}

.filter-text {
	font-size: 28rpx;
	color: #666666;
}

.order-list {
	height: calc(100vh - 200rpx);
	padding: 20rpx;
}

.order-item {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.order-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.order-id {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
}

.order-time {
	font-size: 24rpx;
	color: #999999;
}

.order-status {
	flex-shrink: 0;
}

.order-content {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.service-info {
	display: flex;
	gap: 20rpx;
	align-items: flex-start;
}

.service-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.service-name {
	font-size: 32rpx;
	color: #333333;
	font-weight: 500;
}

.service-desc {
	font-size: 26rpx;
	color: #666666;
	line-height: 1.4;
}

.service-price {
	display: flex;
	align-items: baseline;
	gap: 8rpx;
	margin-top: 8rpx;
}

.price-label {
	font-size: 24rpx;
	color: #999999;
}

.price-value {
	font-size: 32rpx;
	font-weight: bold;
	color: #FF6B35;
}

.customer-info {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	padding: 20rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
}

.customer-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.customer-name {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
	flex: 1;
}

.customer-address {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.address-text {
	font-size: 26rpx;
	color: #666666;
	flex: 1;
	line-height: 1.4;
}

.distance {
	font-size: 24rpx;
	color: #007AFF;
	font-weight: 500;
}

.order-time-info {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.time-item {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.time-text {
	font-size: 26rpx;
	color: #666666;
}

.order-actions {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #f0f0f0;
}

.action-left {
	display: flex;
	gap: 16rpx;
}

.action-right {
	display: flex;
	gap: 16rpx;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 40rpx;
}

.empty-tips {
	text-align: center;
	margin-top: 40rpx;
}

.empty-tips text {
	display: block;
	font-size: 28rpx;
	color: #999999;
	margin-bottom: 8rpx;
}
</style>