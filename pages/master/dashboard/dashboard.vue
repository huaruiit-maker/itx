<template>
	<view class="master-dashboard-container">
		<!-- 师傅信息卡片 -->
		<view class="master-info-card">
			<view class="master-header">
				<view class="master-avatar">
					<u-avatar :src="masterInfo.avatar" size="large"></u-avatar>
				</view>
				<view class="master-info">
					<view class="master-name">{{ masterInfo.name }}</view>
					<view class="master-rating">
						<u-rate :value="masterInfo.rating" disabled></u-rate>
						<text class="rating-text">{{ masterInfo.rating }}分</text>
					</view>
					<view class="master-status">
						<u-tag 
							:text="masterInfo.isOnline ? '在线' : '离线'" 
							:type="masterInfo.isOnline ? 'success' : 'default'"
							size="mini"
						></u-tag>
					</view>
				</view>
				<view class="status-switch">
					<u-switch v-model="masterInfo.isOnline" @change="toggleOnlineStatus"></u-switch>
				</view>
			</view>
			<view class="master-stats">
				<view class="stat-item">
					<text class="stat-value">{{ masterInfo.totalOrders }}</text>
					<text class="stat-label">总订单</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ masterInfo.monthlyOrders }}</text>
					<text class="stat-label">本月订单</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ masterInfo.completionRate }}%</text>
					<text class="stat-label">完成率</text>
				</view>
			</view>
		</view>

		<!-- 今日任务统计 -->
		<view class="today-tasks">
			<view class="section-title">
				<text class="title-text">今日任务</text>
			</view>
			<view class="task-stats">
				<view class="task-item" @tap="goToOrderList('pending')">
					<view class="task-icon">
						<u-icon name="clock" size="40" color="#ff6b35"></u-icon>
					</view>
					<view class="task-content">
						<text class="task-number">{{ todayTasks.pending }}</text>
						<text class="task-label">待接单</text>
					</view>
					<u-badge type="error" :count="todayTasks.pending" size="mini"></u-badge>
				</view>
				<view class="task-item" @tap="goToOrderList('in_progress')">
					<view class="task-icon">
						<u-icon name="play-circle" size="40" color="#007AFF"></u-icon>
					</view>
					<view class="task-content">
						<text class="task-number">{{ todayTasks.inProgress }}</text>
						<text class="task-label">进行中</text>
					</view>
				</view>
				<view class="task-item" @tap="goToOrderList('completed')">
					<view class="task-icon">
						<u-icon name="checkmark-circle" size="40" color="#52c41a"></u-icon>
					</view>
					<view class="task-content">
						<text class="task-number">{{ todayTasks.completed }}</text>
						<text class="task-label">已完成</text>
					</view>
				</view>
				<view class="task-item" @tap="goToOrderList('cancelled')">
					<view class="task-icon">
						<u-icon name="close-circle" size="40" color="#999999"></u-icon>
					</view>
					<view class="task-content">
						<text class="task-number">{{ todayTasks.cancelled }}</text>
						<text class="task-label">已取消</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 快捷操作 -->
		<view class="quick-actions">
			<view class="section-title">
				<text class="title-text">快捷操作</text>
			</view>
			<u-grid :col="3" :border="false">
				<u-grid-item @tap="goToOrderList()">
					<u-icon name="list" size="48" color="#007AFF"></u-icon>
					<text class="action-label">订单列表</text>
				</u-grid-item>
				<u-grid-item @tap="goToSchedule()">
					<u-icon name="calendar" size="48" color="#52c41a"></u-icon>
					<text class="action-label">我的排班</text>
				</u-grid-item>
				<u-grid-item @tap="goToEarnings()">
					<u-icon name="rmb" size="48" color="#ff6b35"></u-icon>
					<text class="action-label">收入明细</text>
				</u-grid-item>
				<u-grid-item @tap="goToSkills()">
					<u-icon name="grid" size="48" color="#722ed1"></u-icon>
					<text class="action-label">技能管理</text>
				</u-grid-item>
				<u-grid-item @tap="goToReviews()">
					<u-icon name="star" size="48" color="#fadb14"></u-icon>
					<text class="action-label">我的评价</text>
				</u-grid-item>
				<u-grid-item @tap="goToProfile()">
					<u-icon name="account" size="48" color="#13c2c2"></u-icon>
					<text class="action-label">个人资料</text>
				</u-grid-item>
			</u-grid>
		</view>

		<!-- 今日预约 -->
		<view class="today-appointments">
			<view class="section-header">
				<text class="section-title">今日预约</text>
				<text class="section-more" @tap="goToSchedule">查看全部 ></text>
			</view>
			<view class="appointment-list">
				<u-empty 
					v-if="todayAppointments.length === 0" 
					text="今日暂无预约"
					mode="list"
				></u-empty>
				
				<view 
					v-else
					class="appointment-item" 
					v-for="(appointment, index) in todayAppointments" 
					:key="appointment.id"
					@tap="goToAppointmentDetail(appointment)"
				>
					<view class="appointment-time">
						<text class="time-text">{{ appointment.time }}</text>
						<text class="duration">{{ appointment.duration }}</text>
					</view>
					<view class="appointment-info">
						<text class="customer-name">{{ appointment.customerName }}</text>
						<text class="service-name">{{ appointment.serviceName }}</text>
						<text class="address">{{ appointment.address }}</text>
					</view>
					<view class="appointment-status">
						<u-tag 
							:text="getAppointmentStatusText(appointment.status)" 
							:type="getAppointmentStatusType(appointment.status)"
							size="mini"
						></u-tag>
					</view>
				</view>
			</view>
		</view>

		<!-- 收入统计 -->
		<view class="earnings-stats">
			<view class="section-title">
				<text class="title-text">今日收入</text>
			</view>
			<view class="earnings-content">
				<view class="earnings-amount">
					<text class="amount-label">今日收入</text>
					<text class="amount-value">¥{{ todayEarnings }}</text>
				</view>
				<view class="earnings-breakdown">
					<view class="breakdown-item">
						<text class="breakdown-label">服务费</text>
						<text class="breakdown-value">¥{{ serviceEarnings }}</text>
					</view>
					<view class="breakdown-item">
						<text class="breakdown-label">配件费</text>
						<text class="breakdown-value">¥{{ partsEarnings }}</text>
					</view>
					<view class="breakdown-item">
						<text class="breakdown-label">上门费</text>
						<text class="breakdown-value">¥{{ visitEarnings }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 技能标签 -->
		<view class="skills-section">
			<view class="section-header">
				<text class="section-title">我的技能</text>
				<text class="section-more" @tap="goToSkills">管理技能 ></text>
			</view>
			<view class="skills-list">
				<u-empty 
					v-if="skills.length === 0" 
					text="暂无技能标签"
					mode="list"
				></u-empty>
				
				<view v-else class="skills-container">
					<u-tag 
						v-for="(skill, index) in skills" 
						:key="index"
						:text="skill.name" 
						:type="skill.level === 'expert' ? 'success' : 'primary'"
						size="mini"
						style="margin-right: 16rpx; margin-bottom: 16rpx;"
					></u-tag>
				</view>
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
			masterInfo: {
				name: '张师傅',
				avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
				rating: 4.8,
				isOnline: true,
				totalOrders: 1286,
				monthlyOrders: 89,
				completionRate: 98
			},
			todayTasks: {
				pending: 3,
				inProgress: 2,
				completed: 5,
				cancelled: 1
			},
			todayEarnings: 580,
			serviceEarnings: 480,
			partsEarnings: 80,
			visitEarnings: 20,
			todayAppointments: [
				{
					id: 1,
					time: '09:00-11:00',
					duration: '2小时',
					customerName: '李女士',
					serviceName: '空调清洗',
					address: '朝阳区建国路88号',
					status: 'confirmed'
				},
				{
					id: 2,
					time: '14:00-16:00',
					duration: '2小时',
					customerName: '王先生',
					serviceName: '冰箱维修',
					address: '海淀区中关村大街1号',
					status: 'confirmed'
				}
			],
			skills: [
				{ name: '空调维修', level: 'expert' },
				{ name: '冰箱维修', level: 'expert' },
				{ name: '洗衣机维修', level: 'intermediate' },
				{ name: '热水器维修', level: 'expert' }
			],
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
					title: '客户评价',
					content: '客户对您的服务给予了五星好评',
					time: '1小时前',
					icon: 'star',
					color: '#fadb14',
					isRead: false
				}
			]
		}
	},
	onLoad() {
		this.loadMasterData()
	},
	methods: {
		loadMasterData() {
			// 模拟加载师傅数据
			setTimeout(() => {
				console.log('师傅工作台数据加载完成')
			}, 1000)
		},
		toggleOnlineStatus(status) {
			// 切换在线状态
			this.masterInfo.isOnline = status
			uni.showToast({
				title: status ? '已上线' : '已下线',
				icon: 'none'
			})
		},
		getAppointmentStatusText(status) {
			const statusMap = {
				'confirmed': '已确认',
				'pending': '待确认',
				'cancelled': '已取消',
				'completed': '已完成'
			}
			return statusMap[status] || '未知状态'
		},
		getAppointmentStatusType(status) {
			const typeMap = {
				'confirmed': 'success',
				'pending': 'warning',
				'cancelled': 'default',
				'completed': 'info'
			}
			return typeMap[status] || 'default'
		},
		goToOrderList(status) {
			const url = status ? 
				`/pages/master/order/list?status=${status}` : 
				'/pages/master/order/list'
			uni.navigateTo({ url })
		},
		goToSchedule() {
			uni.navigateTo({
				url: '/pages/master/schedule/manage'
			})
		},
		goToEarnings() {
			uni.navigateTo({
				url: '/pages/master/order/list'
			})
		},
		goToSkills() {
			uni.navigateTo({
				url: '/pages/master/profile/profile'
			})
		},
		goToReviews() {
			uni.navigateTo({
				url: '/pages/master/order/list'
			})
		},
		goToProfile() {
			uni.navigateTo({
				url: '/pages/master/profile/profile'
			})
		},
		goToAppointmentDetail(appointment) {
			uni.navigateTo({
				url: `/pages/master/order/detail`
			})
		},
		goToNotifications() {
			uni.navigateTo({
				url: '/pages/master/order/list'
			})
		},
		goToNotificationDetail(notification) {
			uni.navigateTo({
				url: `/pages/master/order/list`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.master-dashboard-container {
	background-color: #f8f8f8;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

.master-info-card {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 16rpx;
	margin: 20rpx;
	padding: 30rpx;
	color: #ffffff;
}

.master-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 30rpx;
}

.master-avatar {
	margin-right: 20rpx;
}

.master-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.master-name {
	font-size: 32rpx;
	font-weight: bold;
}

.master-rating {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.rating-text {
	font-size: 24rpx;
}

.master-status {
	margin-top: 8rpx;
}

.status-switch {
	align-self: flex-start;
}

.master-stats {
	display: flex;
	justify-content: space-around;
	padding-top: 20rpx;
	border-top: 1rpx solid rgba(255, 255, 255, 0.2);
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.stat-value {
	font-size: 32rpx;
	font-weight: bold;
}

.stat-label {
	font-size: 24rpx;
	opacity: 0.8;
}

.today-tasks {
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

.task-stats {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20rpx;
}

.task-item {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 20rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	position: relative;
}

.task-content {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.task-number {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.task-label {
	font-size: 24rpx;
	color: #666666;
}

.quick-actions {
	background-color: #ffffff;
	border-radius: 16rpx;
	margin: 0 20rpx 20rpx;
	padding: 30rpx;
}

.action-label {
	font-size: 24rpx;
	color: #666666;
	margin-top: 12rpx;
}

.today-appointments {
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

.appointment-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.appointment-item {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 20rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
}

.appointment-time {
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 120rpx;
}

.time-text {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
}

.duration {
	font-size: 20rpx;
	color: #999999;
}

.appointment-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.customer-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
}

.service-name {
	font-size: 24rpx;
	color: #666666;
}

.address {
	font-size: 20rpx;
	color: #999999;
}

.appointment-status {
	display: flex;
	align-items: center;
}

.earnings-stats {
	background-color: #ffffff;
	border-radius: 16rpx;
	margin: 0 20rpx 20rpx;
	padding: 30rpx;
}

.earnings-content {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.earnings-amount {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	padding: 30rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 16rpx;
	color: #ffffff;
}

.amount-label {
	font-size: 24rpx;
	opacity: 0.8;
}

.amount-value {
	font-size: 48rpx;
	font-weight: bold;
}

.earnings-breakdown {
	display: flex;
	justify-content: space-around;
}

.breakdown-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.breakdown-label {
	font-size: 24rpx;
	color: #999999;
}

.breakdown-value {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
}

.skills-section {
	background-color: #ffffff;
	border-radius: 16rpx;
	margin: 0 20rpx 20rpx;
	padding: 30rpx;
}

.skills-list {
	padding: 20rpx 0;
}

.skills-container {
	display: flex;
	flex-wrap: wrap;
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