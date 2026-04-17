<template>
	<view class="dashboard-container">
		<!-- 顶部统计卡片 -->
		<view class="stats-cards">
			<view class="stat-card">
				<view class="stat-icon">
					<u-icon name="rmb" size="40" color="#ff6b35"></u-icon>
				</view>
				<view class="stat-content">
					<text class="stat-value">¥{{ todayRevenue }}</text>
					<text class="stat-label">今日收入</text>
				</view>
			</view>
			<view class="stat-card">
				<view class="stat-icon">
					<u-icon name="list" size="40" color="#007AFF"></u-icon>
				</view>
				<view class="stat-content">
					<text class="stat-value">{{ todayOrders }}</text>
					<text class="stat-label">今日订单</text>
				</view>
			</view>
			<view class="stat-card">
				<view class="stat-icon">
					<u-icon name="users" size="40" color="#52c41a"></u-icon>
				</view>
				<view class="stat-content">
					<text class="stat-value">{{ totalCustomers }}</text>
					<text class="stat-label">服务客户</text>
				</view>
			</view>
			<view class="stat-card">
				<view class="stat-icon">
					<u-icon name="star" size="40" color="#fadb14"></u-icon>
				</view>
				<view class="stat-content">
					<text class="stat-value">{{ averageRating }}</text>
					<text class="stat-label">平均评分</text>
				</view>
			</view>
		</view>

		<!-- 快捷操作 -->
		<view class="quick-actions">
			<view class="section-title">
				<text class="title-text">快捷操作</text>
			</view>
			<u-grid :col="4" :border="false">
				<u-grid-item @tap="goToOrderManage">
					<u-icon name="list" size="48" color="#007AFF"></u-icon>
					<text class="action-label">订单管理</text>
				</u-grid-item>
				<u-grid-item @tap="goToServiceManage">
					<u-icon name="grid" size="48" color="#52c41a"></u-icon>
					<text class="action-label">服务管理</text>
				</u-grid-item>
				<u-grid-item @tap="goToMasterManage">
					<u-icon name="account" size="48" color="#ff6b35"></u-icon>
					<text class="action-label">师傅管理</text>
				</u-grid-item>
				<u-grid-item @tap="goToFinance">
					<u-icon name="rmb" size="48" color="#722ed1"></u-icon>
					<text class="action-label">财务管理</text>
				</u-grid-item>
				<u-grid-item @tap="goToStatistics">
					<u-icon name="chart" size="48" color="#eb2f96"></u-icon>
					<text class="action-label">数据统计</text>
				</u-grid-item>
				<u-grid-item @tap="goToCustomerService">
					<u-icon name="server" size="48" color="#13c2c2"></u-icon>
					<text class="action-label">客服中心</text>
				</u-grid-item>
				<u-grid-item @tap="goToSettings">
					<u-icon name="setting" size="48" color="#fa8c16"></u-icon>
					<text class="action-label">店铺设置</text>
				</u-grid-item>
				<u-grid-item @tap="goToHelp">
					<u-icon name="question-circle" size="48" color="#fa541c"></u-icon>
					<text class="action-label">帮助中心</text>
				</u-grid-item>
			</u-grid>
		</view>

		<!-- 待处理订单 -->
		<view class="pending-orders">
			<view class="section-header">
				<text class="section-title">待处理订单</text>
				<text class="section-more" @tap="goToOrderManage">查看全部 ></text>
			</view>
			<view class="order-list">
				<u-empty 
					v-if="pendingOrders.length === 0" 
					text="暂无待处理订单"
					mode="list"
				></u-empty>
				
				<view 
					v-else
					class="order-item" 
					v-for="(order, index) in pendingOrders" 
					:key="order.id"
					@tap="goToOrderDetail(order)"
				>
					<view class="order-info">
						<text class="order-no">订单号：{{ order.orderNo }}</text>
						<text class="service-name">{{ order.serviceName }}</text>
						<text class="appointment-time">预约时间：{{ order.appointmentTime }}</text>
					</view>
					<view class="order-status">
						<u-tag 
							:text="getStatusText(order.status)" 
							:type="getStatusType(order.status)"
							size="mini"
						></u-tag>
						<text class="order-price">¥{{ order.price }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 服务状态 -->
		<view class="service-status">
			<view class="section-title">
				<text class="title-text">服务状态</text>
			</view>
			<u-grid :col="2" :border="false">
				<u-grid-item>
					<view class="status-item">
						<text class="status-number">{{ activeServices }}</text>
						<text class="status-label">在售服务</text>
					</view>
				</u-grid-item>
				<u-grid-item>
					<view class="status-item">
						<text class="status-number">{{ pausedServices }}</text>
						<text class="status-label">暂停服务</text>
					</view>
				</u-grid-item>
				<u-grid-item>
					<view class="status-item">
						<text class="status-number">{{ activeMasters }}</text>
						<text class="status-label">在线师傅</text>
					</view>
				</u-grid-item>
				<u-grid-item>
					<view class="status-item">
						<text class="status-number">{{ pendingReviews }}</text>
						<text class="status-label">待审核评价</text>
					</view>
				</u-grid-item>
			</u-grid>
		</view>

		<!-- 最近7天收入趋势 -->
		<view class="revenue-chart">
			<view class="section-title">
				<text class="title-text">收入趋势</text>
			</view>
			<view class="chart-container">
				<u-empty 
					v-if="!chartData" 
					text="暂无数据"
					mode="data"
				></u-empty>
				<canvas canvas-id="revenueChart" class="chart-canvas" v-else></canvas>
			</view>
		</view>

		<!-- 系统通知 -->
		<view class="notifications">
			<view class="section-header">
				<text class="section-title">系统通知</text>
				<text class="section-more" @tap="goToNotifications">查看全部 ></text>
			</view>
			<view class="notification-list">
				<u-empty 
					v-if="notifications.length === 0" 
					text="暂无通知"
					mode="message"
				></u-empty>
				
				<view 
					v-else
					class="notification-item" 
					v-for="(notification, index) in notifications" 
					:key="index"
					@tap="goToNotificationDetail(notification)"
				>
					<view class="notification-icon">
						<u-icon :name="notification.icon" size="24" :color="notification.color"></u-icon>
					</view>
					<view class="notification-content">
						<text class="notification-title">{{ notification.title }}</text>
						<text class="notification-desc">{{ notification.content }}</text>
						<text class="notification-time">{{ notification.time }}</text>
					</view>
					<u-badge type="error" size="mini" v-if="!notification.isRead"></u-badge>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			todayRevenue: 2580,
			todayOrders: 12,
			totalCustomers: 1568,
			averageRating: 4.8,
			activeServices: 25,
			pausedServices: 3,
			activeMasters: 18,
			pendingReviews: 5,
			pendingOrders: [],
			chartData: null,
			notifications: [
				{
					id: 1,
					title: '新订单提醒',
					content: '您有新的维修订单，请及时处理',
					time: '5分钟前',
					icon: 'bell',
					color: '#ff6b35',
					isRead: false
				},
				{
					id: 2,
					title: '师傅评价提醒',
					content: '有客户对您的服务进行了评价',
					time: '1小时前',
					icon: 'star',
					color: '#fadb14',
					isRead: false
				}
			]
		}
	},
	onLoad() {
		this.loadDashboardData()
		this.initChart()
	},
	methods: {
		loadDashboardData() {
			// 模拟加载仪表板数据
			setTimeout(() => {
				this.pendingOrders = [
					{
						id: 1,
						orderNo: 'XN202401010001',
						status: 'pending',
						serviceName: '空调维修',
						appointmentTime: '2024-01-03 14:00-16:00',
						price: 180
					},
					{
						id: 2,
						orderNo: 'XN202401010002',
						status: 'pending_payment',
						serviceName: '冰箱维修',
						appointmentTime: '2024-01-02 10:00-12:00',
						price: 250
					}
				]
			}, 1000)
		},
		initChart() {
			// 模拟图表数据
			this.chartData = {
				categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
				data: [1200, 1500, 1800, 2200, 2500, 2800, 3200]
			}
		},
		getStatusText(status) {
			const statusMap = {
				'pending': '待接单',
				'pending_payment': '待支付',
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
		goToOrderManage() {
			uni.navigateTo({
				url: '/pages/business/order/manage'
			})
		},
		goToServiceManage() {
			uni.navigateTo({
				url: '/pages/business/service/manage'
			})
		},
		goToMasterManage() {
			uni.navigateTo({
				url: '/pages/business/master/manage'
			})
		},
		goToFinance() {
			uni.navigateTo({
				url: '/pages/business/finance/overview'
			})
		},
		goToStatistics() {
			uni.navigateTo({
				url: '/pages/business/finance/overview'
			})
		},
		goToCustomerService() {
			uni.navigateTo({
				url: '/pages/business/service/manage'
			})
		},
		goToSettings() {
			uni.navigateTo({
				url: '/pages/business/profile/profile'
			})
		},
		goToHelp() {
			uni.navigateTo({
				url: '/pages/business/service/manage'
			})
		},
		goToOrderDetail(order) {
			uni.navigateTo({
				url: `/pages/business/order/detail`
			})
		},
		goToNotifications() {
			uni.navigateTo({
				url: '/pages/business/service/manage'
			})
		},
		goToNotificationDetail(notification) {
			uni.navigateTo({
				url: `/pages/business/service/manage`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.dashboard-container {
	background-color: #f8f8f8;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

.stats-cards {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20rpx;
	padding: 20rpx;
}

.stat-card {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.stat-icon {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f8f8f8;
	border-radius: 16rpx;
}

.stat-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.stat-value {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.stat-label {
	font-size: 24rpx;
	color: #999999;
}

.quick-actions {
	background-color: #ffffff;
	border-radius: 16rpx;
	margin: 0 20rpx 20rpx;
	padding: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 30rpx;
}

.action-label {
	font-size: 24rpx;
	color: #666666;
	margin-top: 12rpx;
}

.pending-orders {
	background-color: #ffffff;
	border-radius: 16rpx;
	margin: 0 20rpx 20rpx;
	padding: 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.section-more {
	font-size: 26rpx;
	color: #999999;
}

.order-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.order-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
}

.order-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.order-no {
	font-size: 24rpx;
	color: #999999;
}

.service-name {
	font-size: 28rpx;
	color: #333333;
	font-weight: bold;
}

.appointment-time {
	font-size: 24rpx;
	color: #666666;
}

.order-status {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 8rpx;
}

.order-price {
	font-size: 28rpx;
	color: #ff6b35;
	font-weight: bold;
}

.service-status {
	background-color: #ffffff;
	border-radius: 16rpx;
	margin: 0 20rpx 20rpx;
	padding: 30rpx;
}

.status-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	padding: 20rpx;
}

.status-number {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
}

.status-label {
	font-size: 24rpx;
	color: #999999;
}

.revenue-chart {
	background-color: #ffffff;
	border-radius: 16rpx;
	margin: 0 20rpx 20rpx;
	padding: 30rpx;
}

.chart-container {
	height: 400rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.chart-canvas {
	width: 100%;
	height: 100%;
}

.notifications {
	background-color: #ffffff;
	border-radius: 16rpx;
	margin: 0 20rpx;
	padding: 30rpx;
}

.notification-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.notification-item {
	display: flex;
	align-items: flex-start;
	gap: 20rpx;
	padding: 20rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	position: relative;
}

.notification-icon {
	width: 48rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.notification-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.notification-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
}

.notification-desc {
	font-size: 24rpx;
	color: #666666;
}

.notification-time {
	font-size: 20rpx;
	color: #999999;
}
</style>