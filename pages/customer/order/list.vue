<template>
	<view class="order-list-container">
		<!-- 订单状态标签 -->
		<view class="status-tabs">
			<u-tabs 
				:list="statusTabs" 
				:is-scroll="false"
				:current="currentTab"
				@change="handleTabChange"
				active-color="#007AFF"
				inactive-color="#666666"
			></u-tabs>
		</view>

		<!-- 订单列表 -->
		<scroll-view 
			scroll-y 
			class="order-scroll"
			@scrolltolower="loadMoreOrders"
			refresher-enabled
			@refresherrefresh="handleRefresh"
			:refresher-triggered="isRefreshing"
		>
			<view class="order-list">
				<u-empty 
					v-if="orderList.length === 0" 
					text="暂无相关订单"
					mode="list"
				></u-empty>
				
				<view 
						v-else
						class="order-card" 
						v-for="(order, index) in orderList" 
						:key="order.id"
						@click="viewOrderDetail(order)"
					>
						<!-- 订单头部 -->
						<view class="order-header">
							<view class="order-info">
								<text class="order-no">订单号：{{ order.orderNo }}</text>
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

						<!-- 服务内容 -->
						<view class="service-content">
							<image 
								class="service-image" 
								:src="order.serviceImage" 
								mode="aspectFill"
							></image>
							<view class="service-info">
								<view class="service-header">
									<text class="service-name">{{ order.serviceName }}</text>
									<text class="service-price">¥{{ order.price }}</text>
								</view>
								<view class="service-desc">{{ order.serviceDesc }}</view>
								<view class="service-specs" v-if="order.specs">
									<text class="spec-item" v-for="spec in order.specs" :key="spec">
										{{ spec }}
									</text>
								</view>
							</view>
						</view>

						<!-- 师傅信息 -->
						<view class="master-info" v-if="order.master">
							<image 
								class="master-avatar" 
								:src="order.master.avatar" 
								mode="aspectFill"
							></image>
							<view class="master-detail">
								<view class="master-name">{{ order.master.name }}</view>
								<view class="master-rating">
									<u-icon name="star-fill" size="16" color="#ffa500"></u-icon>
									<text class="rating-score">{{ order.master.rating }}</text>
									<text class="rating-count">({{ order.master.orderCount }}单)</text>
								</view>
							</view>
							<view class="master-contact">
								<u-button 
									type="primary" 
									size="mini" 
									plain
									@click.stop="callMaster(order.master)"
								>
									联系师傅
								</u-button>
							</view>
						</view>

						<!-- 预约信息 -->
						<view class="appointment-info" v-if="order.appointmentTime">
							<view class="info-item">
								<u-icon name="clock" size="20" color="#666666"></u-icon>
								<text class="info-text">预约时间：{{ order.appointmentTime }}</text>
							</view>
							<view class="info-item">
								<u-icon name="map" size="20" color="#666666"></u-icon>
								<text class="info-text">服务地址：{{ order.address }}</text>
							</view>
						</view>

						<!-- 订单操作 -->
						<view class="order-actions">
							<view class="action-buttons">
								<u-button 
									v-if="order.status === 'pending'" 
									type="error" 
									size="mini" 
									plain
									@click.stop="cancelOrder(order)"
								>
									取消订单
								</u-button>
								<u-button 
									v-if="order.status === 'completed'" 
									type="primary" 
									size="mini" 
									plain
									@click.stop="evaluateOrder(order)"
								>
									立即评价
								</u-button>
								<u-button 
									v-if="order.status === 'cancelled' || order.status === 'completed'" 
									type="primary" 
									size="mini" 
									plain
									@click.stop="reorder(order)"
								>
									再次预约
								</u-button>
							</view>
							<view class="order-price">
								<text class="price-label">实付：</text>
								<text class="price-value">¥{{ order.actualPrice }}</text>
							</view>
						</view>
					</view>
			</view>
			
			<u-loadmore 
				:status="loadStatus" 
				v-if="orderList.length > 0"
				@loadmore="loadMoreOrders"
			></u-loadmore>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			statusTabs: [
				{ name: '全部' },
				{ name: '待支付' },
				{ name: '待服务' },
				{ name: '进行中' },
				{ name: '已完成' },
				{ name: '已取消' }
			],
			currentTab: 0,
			orderList: [],
			loadStatus: 'loadmore',
			page: 1,
			pageSize: 10,
			isRefreshing: false,
			currentStatus: 'all'
		}
	},
	onLoad() {
		this.loadOrderList()
	},
	methods: {
		loadOrderList() {
			// 模拟加载订单列表
			const mockData = [
				{
					id: 1,
					orderNo: 'XN202401010001',
					status: 'pending_payment',
					serviceName: '空调维修',
					serviceDesc: '空调不制冷，需要加氟',
					serviceImage: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=120&h=90&fit=crop',
					appointmentTime: '2024-01-03 14:00-16:00',
					price: 180,
					masterName: '',
					masterAvatar: '',
					masterRating: 0,
					isEvaluated: false
				},
				{
					id: 2,
					orderNo: 'XN202401010002',
					status: 'pending',
					serviceName: '冰箱维修',
					serviceDesc: '冰箱不制冷，压缩机有异响',
					serviceImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=90&fit=crop',
					appointmentTime: '2024-01-02 10:00-12:00',
					price: 250,
					masterName: '张师傅',
					masterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
					masterRating: 4.8,
					isEvaluated: false
				},
				{
					id: 3,
					orderNo: 'XN202401010003',
					status: 'in_progress',
					serviceName: '洗衣机维修',
					serviceDesc: '洗衣机不排水，需要检查排水管',
					serviceImage: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=120&h=90&fit=crop',
					appointmentTime: '2024-01-01 16:00-18:00',
					price: 150,
					masterName: '李师傅',
					masterAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
					masterRating: 4.9,
					isEvaluated: false
				},
				{
					id: 4,
					orderNo: 'XN202401010004',
					status: 'completed',
					serviceName: '热水器维修',
					serviceDesc: '热水器不加热，更换加热管',
					serviceImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=90&fit=crop',
					appointmentTime: '2023-12-31 14:00-16:00',
					price: 200,
					masterName: '王师傅',
					masterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop',
					masterRating: 4.7,
					isEvaluated: false
				}
			]
			
			setTimeout(() => {
				this.orderList = [...this.orderList, ...mockData]
				this.loadStatus = this.orderList.length >= 20 ? 'nomore' : 'loadmore'
			}, 1000)
		},
		loadMoreOrders() {
			if (this.loadStatus === 'nomore') return
			this.loadStatus = 'loading'
			this.page++
			
			setTimeout(() => {
				this.loadOrderList()
				this.loadStatus = 'loadmore'
			}, 1500)
		},
		handleRefresh() {
			this.isRefreshing = true
			this.page = 1
			this.orderList = []
			this.loadOrderList()
			
			setTimeout(() => {
				this.isRefreshing = false
			}, 1000)
		},
		handleTabChange(index) {
			this.currentTab = index
			const statusMap = ['all', 'pending_payment', 'pending', 'in_progress', 'completed', 'cancelled']
			this.currentStatus = statusMap[index]
			this.page = 1
			this.orderList = []
			this.loadOrderList()
		},
		getStatusText(status) {
			const statusMap = {
				'pending_payment': '待支付',
				'pending': '待服务',
				'in_progress': '进行中',
				'completed': '已完成',
				'cancelled': '已取消'
			}
			return statusMap[status] || '未知状态'
		},
		getStatusType(status) {
			const typeMap = {
				'pending_payment': 'warning',
				'pending': 'primary',
				'in_progress': 'info',
				'completed': 'success',
				'cancelled': 'default'
			}
			return typeMap[status] || 'default'
		},
		handleOrderDetail(order) {
			uni.navigateTo({
				url: `/pages/customer/order/detail?id=${order.id}`
			})
		},
		handleContactMaster(order) {
			uni.showModal({
				title: '联系师傅',
				content: `是否拨打电话：${order.masterPhone || '13800138000'}？`,
				success: (res) => {
					if (res.confirm) {
						uni.makePhoneCall({
							phoneNumber: order.masterPhone || '13800138000'
						})
					}
				}
			})
		},
		handleCancelOrder(order) {
			uni.showModal({
				title: '取消订单',
				content: '确定要取消此订单吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '处理中...' })
						setTimeout(() => {
							uni.hideLoading()
							uni.showToast({
								title: '取消成功',
								icon: 'success'
							})
							this.handleRefresh()
						}, 1500)
					}
				}
			})
		},
		handlePay(order) {
			uni.navigateTo({
				url: `/pages/customer/order/payment?id=${order.id}`
			})
		},
		handleComplete(order) {
			uni.showModal({
				title: '确认完成',
				content: '确认服务已完成？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '处理中...' })
						setTimeout(() => {
							uni.hideLoading()
							uni.showToast({
								title: '确认成功',
								icon: 'success'
							})
							this.handleRefresh()
						}, 1500)
					}
				}
			})
		},
		handleEvaluate(order) {
			uni.navigateTo({
				url: `/pages/customer/order/evaluate?id=${order.id}`
			})
		},
		handleReorder(order) {
			uni.navigateTo({
				url: `/pages/customer/booking/booking?serviceId=${order.serviceId}`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.order-list-container {
	background-color: #f8f8f8;
	height: 100vh;
	display: flex;
	flex-direction: column;
}

.status-tabs {
	background-color: #ffffff;
}

.order-scroll {
	flex: 1;
	overflow: hidden;
}

.order-list {
	padding: 20rpx;
}

.order-card {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.order-no {
	display: flex;
	align-items: center;
}

.order-no .label {
	font-size: 24rpx;
	color: #999999;
}

.order-no .value {
	font-size: 24rpx;
	color: #666666;
}

.service-info {
	display: flex;
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.service-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.service-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

.service-desc {
	font-size: 26rpx;
	color: #666666;
}

.service-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 8rpx;
}

.appointment-time {
	font-size: 24rpx;
	color: #999999;
}

.service-price {
	font-size: 32rpx;
	color: #ff6b35;
	font-weight: bold;
}

.master-info {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 20rpx 0;
	border-top: 1rpx solid #f0f0f0;
	border-bottom: 1rpx solid #f0f0f0;
}

.master-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.master-name {
	font-size: 28rpx;
	color: #333333;
}

.order-actions {
	display: flex;
	justify-content: flex-end;
	gap: 16rpx;
	margin-top: 20rpx;
}
</style>