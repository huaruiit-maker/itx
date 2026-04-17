<template>
	<view class="order-manage-container">
		<!-- 订单状态筛选 -->
		<view class="order-tabs">
			<u-tabs 
				:list="orderTabs" 
				:current="currentTab" 
				@change="changeTab"
				lineColor="#007AFF"
				:activeStyle="{
					color: '#007AFF',
					fontWeight: 'bold'
				}"
			></u-tabs>
		</view>

		<!-- 订单列表 -->
		<view class="order-list">
			<view class="order-item" v-for="(order, index) in orderList" :key="order.id">
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

				<view class="order-content">
					<view class="service-info">
						<view class="service-images">
							<u-image 
								v-for="(image, imgIndex) in order.serviceImages" 
								:key="imgIndex"
								:src="image" 
								width="160rpx" 
								height="160rpx"
								mode="aspectFill"
								@click="previewImage(order.serviceImages, imgIndex)"
							></u-image>
						</view>
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
						<view class="customer-basic">
							<text class="customer-name">客户：{{ order.customerName }}</text>
							<text class="customer-phone">{{ order.customerPhone }}</text>
						</view>
						<view class="appointment-info">
							<text class="appointment-time">预约时间：{{ order.appointmentTime }}</text>
							<text class="appointment-address">服务地址：{{ order.address }}</text>
						</view>
					</view>

					<view class="master-info" v-if="order.masterName">
						<view class="master-basic">
							<text class="master-name">师傅：{{ order.masterName }}</text>
							<text class="master-phone">{{ order.masterPhone }}</text>
						</view>
						<view class="master-rating" v-if="order.masterRating">
							<u-rate :value="order.masterRating" disabled size="mini"></u-rate>
							<text class="rating-text">{{ order.masterRating }}分</text>
						</view>
					</view>
				</view>

				<view class="order-actions">
					<view class="action-buttons">
						<u-button 
							v-if="order.status === 'pending'"
							type="primary" 
							size="mini"
							@click="acceptOrder(order)"
						>
							接单
						</u-button>
						<u-button 
							v-if="order.status === 'pending_payment'"
							type="warning" 
							size="mini"
							@click="remindPayment(order)"
						>
							催付款
						</u-button>
						<u-button 
							v-if="order.status === 'in_progress'"
							type="success" 
							size="mini"
							@click="completeOrder(order)"
						>
							完成服务
						</u-button>
						<u-button 
							v-if="order.status === 'completed'"
							type="info" 
							size="mini"
							@click="viewReview(order)"
						>
							查看评价
						</u-button>
						<u-button 
							type="default" 
							size="mini"
							@click="viewOrderDetail(order)"
						>
							详情
						</u-button>
					</view>
					<view class="more-actions">
						<u-icon name="more-dot-fill" size="32" color="#999" @click="showMoreActions(order)"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<u-empty 
			v-if="orderList.length === 0" 
			mode="list" 
			icon="/static/images/placeholder_1.png"
			text="暂无订单"
		></u-empty>

		<!-- 加载更多 -->
		<u-loadmore 
			v-if="orderList.length > 0"
			:status="loadStatus" 
			:load-text="loadText"
			@loadmore="loadMoreOrders"
		></u-loadmore>

		<!-- 更多操作弹窗 -->
		<u-action-sheet 
			:show="showActionSheet" 
			:actions="actionSheetActions"
			@close="showActionSheet = false"
			@select="handleActionSelect"
		></u-action-sheet>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderTabs: [
				{ name: '全部', value: 'all' },
				{ name: '待接单', value: 'pending' },
				{ name: '待付款', value: 'pending_payment' },
				{ name: '进行中', value: 'in_progress' },
				{ name: '已完成', value: 'completed' },
				{ name: '已取消', value: 'cancelled' }
			],
			currentTab: 0,
			currentStatus: 'all',
			orderList: [],
			page: 1,
			pageSize: 10,
			total: 0,
			loadStatus: 'loadmore',
			loadText: {
				loadmore: '点击加载更多',
				loading: '努力加载中',
				nomore: '没有更多了'
			},
			showActionSheet: false,
			actionSheetActions: [],
			currentOrder: null
		}
	},
	onLoad() {
		this.loadOrderList()
	},
	methods: {
		changeTab(index) {
			this.currentTab = index
			this.currentStatus = this.orderTabs[index].value
			this.page = 1
			this.orderList = []
			this.loadOrderList()
		},
		loadOrderList() {
			// 模拟加载订单列表
			uni.showLoading({ title: '加载中...' })
			
			setTimeout(() => {
				const mockOrders = [
					{
						id: '1',
						orderNo: 'XN202401010001',
						status: 'pending',
						createTime: '2024-01-01 10:30:00',
						serviceImages: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop'],
						serviceName: '空调维修',
						serviceDesc: '空调不制冷，需要检修',
						servicePrice: 150,
						customerName: '李女士',
						customerPhone: '138****8888',
						appointmentTime: '2024-01-03 14:00-16:00',
						address: '朝阳区建国路88号',
						masterName: '',
						masterPhone: '',
						masterRating: null
					},
					{
						id: '2',
						orderNo: 'XN202401010002',
						status: 'pending_payment',
						createTime: '2024-01-01 11:15:00',
						serviceImages: ['https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400&h=300&fit=crop'],
						serviceName: '冰箱维修',
						serviceDesc: '冰箱漏水，需要维修',
						servicePrice: 250,
						customerName: '王先生',
						customerPhone: '139****9999',
						appointmentTime: '2024-01-02 10:00-12:00',
						address: '海淀区中关村大街1号',
						masterName: '张师傅',
						masterPhone: '137****7777',
						masterRating: 4.8
					},
					{
						id: '3',
						orderNo: 'XN202401010003',
						status: 'in_progress',
						createTime: '2024-01-01 09:20:00',
						serviceImages: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'],
						serviceName: '洗衣机维修',
						serviceDesc: '洗衣机不脱水，需要检修',
						servicePrice: 180,
						customerName: '张女士',
						customerPhone: '136****6666',
						appointmentTime: '2024-01-01 15:00-17:00',
						address: '东城区王府井大街99号',
						masterName: '李师傅',
						masterPhone: '135****5555',
						masterRating: 4.7
					}
				]
				
				this.orderList = mockOrders
				this.total = mockOrders.length
				this.loadStatus = 'nomore'
				
				uni.hideLoading()
			}, 1000)
		},
		loadMoreOrders() {
			if (this.loadStatus === 'nomore') return
			
			this.loadStatus = 'loading'
			this.page++
			
			setTimeout(() => {
				// 模拟加载更多数据
				this.loadStatus = 'nomore'
			}, 1000)
		},
		getStatusText(status) {
			const statusMap = {
				'pending': '待接单',
				'pending_payment': '待付款',
				'in_progress': '进行中',
				'completed': '已完成',
				'cancelled': '已取消'
			}
			return statusMap[status] || '未知状态'
		},
		getStatusType(status) {
			const typeMap = {
				'pending': 'primary',
				'pending_payment': 'warning',
				'in_progress': 'info',
				'completed': 'success',
				'cancelled': 'default'
			}
			return typeMap[status] || 'default'
		},
		previewImage(images, currentIndex) {
			uni.previewImage({
				urls: images,
				current: currentIndex
			})
		},
		acceptOrder(order) {
			uni.showModal({
				title: '确认接单',
				content: '确认要接这个订单吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '处理中...' })
						
						setTimeout(() => {
							order.status = 'in_progress'
							order.masterName = '张师傅'
							order.masterPhone = '137****7777'
							
							uni.hideLoading()
							uni.showToast({
								title: '接单成功',
								icon: 'success'
							})
						}, 1000)
					}
				}
			})
		},
		remindPayment(order) {
			uni.showLoading({ title: '发送催款通知...' })
			
			setTimeout(() => {
				uni.hideLoading()
				uni.showToast({
					title: '催款通知已发送',
					icon: 'success'
				})
			}, 1000)
		},
		completeOrder(order) {
			uni.showModal({
				title: '完成服务',
				content: '确认服务已完成？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '处理中...' })
						
						setTimeout(() => {
							order.status = 'completed'
							
							uni.hideLoading()
							uni.showToast({
								title: '服务完成',
								icon: 'success'
							})
						}, 1000)
					}
				}
			})
		},
		viewReview(order) {
			uni.navigateTo({
				url: `/pages/business/reviews/detail?orderId=${order.id}`
			})
		},
		viewOrderDetail(order) {
			uni.navigateTo({
				url: `/pages/business/order/detail?id=${order.id}`
			})
		},
		showMoreActions(order) {
			this.currentOrder = order
			
			const actions = [
				{
					name: '查看详情',
					color: '#007AFF'
				}
			]
			
			if (order.status === 'pending') {
				actions.push({
					name: '接单',
					color: '#52c41a'
				})
				actions.push({
					name: '拒单',
					color: '#ff6b35'
				})
			} else if (order.status === 'pending_payment') {
				actions.push({
					name: '催付款',
					color: '#fadb14'
				})
			} else if (order.status === 'in_progress') {
				actions.push({
					name: '完成服务',
					color: '#52c41a'
				})
			}
			
			actions.push({
				name: '联系客户',
				color: '#007AFF'
			})
			
			this.actionSheetActions = actions
			this.showActionSheet = true
		},
		handleActionSelect(action) {
			const order = this.currentOrder
			
			switch (action.name) {
				case '查看详情':
					this.viewOrderDetail(order)
					break
				case '接单':
					this.acceptOrder(order)
					break
				case '拒单':
					this.rejectOrder(order)
					break
				case '催付款':
					this.remindPayment(order)
					break
				case '完成服务':
					this.completeOrder(order)
					break
				case '联系客户':
					this.contactCustomer(order)
					break
			}
		},
		rejectOrder(order) {
			uni.showModal({
				title: '拒单确认',
				content: '确认要拒绝这个订单吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '处理中...' })
						
						setTimeout(() => {
							order.status = 'cancelled'
							
							uni.hideLoading()
							uni.showToast({
								title: '拒单成功',
								icon: 'success'
							})
						}, 1000)
					}
				}
			})
		},
		contactCustomer(order) {
			uni.showActionSheet({
				itemList: ['拨打电话', '发送短信'],
				success: (res) => {
					if (res.tapIndex === 0) {
						uni.makePhoneCall({
							phoneNumber: order.customerPhone
						})
					} else {
						// 发送短信
						uni.showToast({
							title: '短信功能开发中',
							icon: 'none'
						})
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.order-manage-container {
	background-color: #f8f8f8;
	min-height: 100vh;
}

.order-tabs {
	background-color: #ffffff;
	position: sticky;
	top: 0;
	z-index: 100;
}

.order-list {
	padding: 20rpx;
}

.order-item {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
	padding-bottom: 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.order-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.order-no {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
}

.order-time {
	font-size: 24rpx;
	color: #999999;
}

.order-status {
	display: flex;
	align-items: center;
}

.order-content {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.service-info {
	display: flex;
	gap: 20rpx;
}

.service-images {
	display: flex;
	gap: 12rpx;
}

.service-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.service-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.service-desc {
	font-size: 28rpx;
	color: #666666;
}

.service-price {
	display: flex;
	align-items: baseline;
	gap: 8rpx;
}

.price-label {
	font-size: 24rpx;
	color: #999999;
}

.price-value {
	font-size: 32rpx;
	font-weight: bold;
	color: #ff6b35;
}

.customer-info {
	padding: 20rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
}

.customer-basic {
	display: flex;
	align-items: center;
	gap: 24rpx;
	margin-bottom: 12rpx;
}

.customer-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
}

.customer-phone {
	font-size: 24rpx;
	color: #666666;
}

.appointment-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.appointment-time {
	font-size: 24rpx;
	color: #666666;
}

.appointment-address {
	font-size: 24rpx;
	color: #666666;
}

.master-info {
	padding: 20rpx;
	background-color: #f0f9ff;
	border-radius: 12rpx;
}

.master-basic {
	display: flex;
	align-items: center;
	gap: 24rpx;
	margin-bottom: 12rpx;
}

.master-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
}

.master-phone {
	font-size: 24rpx;
	color: #666666;
}

.master-rating {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.rating-text {
	font-size: 24rpx;
	color: #999999;
}

.order-actions {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 24rpx;
	padding-top: 24rpx;
	border-top: 1rpx solid #f0f0f0;
}

.action-buttons {
	display: flex;
	gap: 16rpx;
}

.more-actions {
	display: flex;
	align-items: center;
}
</style>