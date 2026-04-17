<template>
	<view class="profile-container">
		<!-- 个人信息头部 -->
		<view class="profile-header">
			<view class="user-info">
				<image 
					class="avatar" 
					:src="userInfo.avatar" 
					mode="aspectFill"
					@click="changeAvatar"
				></image>
				<view class="user-details">
					<view class="user-name">
						{{ userInfo.name }}
						<view class="certification-status" v-if="userInfo.isCertified">
							<u-icon name="checkmark-circle-fill" color="#007AFF" size="24"></u-icon>
							<text>已认证</text>
						</view>
					</view>
					<view class="user-phone">{{ userInfo.phone }}</view>
					<view class="user-level">
						<view class="level-badge">
							<u-icon name="star-fill" color="#ffa500" size="20"></u-icon>
							<text>{{ userInfo.level }}</text>
						</view>
						<view class="level-progress">
							<view class="progress-bar">
								<view class="progress-fill" :style="{ width: userInfo.levelProgress + '%' }"></view>
							</view>
							<text class="progress-text">{{ userInfo.levelProgress }}%</text>
						</view>
					</view>
				</view>
			</view>
			<view class="header-stats">
				<view class="stat-item">
					<view class="stat-value">{{ userInfo.totalOrders }}</view>
					<view class="stat-label">总订单</view>
				</view>
				<view class="stat-item">
					<view class="stat-value">{{ userInfo.monthlyOrders }}</view>
					<view class="stat-label">本月订单</view>
				</view>
				<view class="stat-item">
					<view class="stat-value">{{ userInfo.rating }}</view>
					<view class="stat-label">评分</view>
				</view>
			</view>
		</view>

		<!-- 账户余额 -->
		<view class="balance-section">
			<view class="balance-card">
				<view class="balance-info">
					<view class="balance-label">账户余额</view>
					<view class="balance-amount">¥{{ userInfo.balance }}</view>
				</view>
				<view class="balance-actions">
					<u-button type="primary" size="mini" @click="goToWithdraw">提现</u-button>
					<u-button type="default" size="mini" @click="goToTransactions">明细</u-button>
				</view>
			</view>
		</view>

		<!-- 服务统计 -->
		<view class="stats-section">
			<view class="section-title">服务统计</view>
			<view class="stats-grid">
				<view class="stat-card">
					<view class="stat-icon">
						<u-icon name="list" size="32" color="#007AFF"></u-icon>
					</view>
					<view class="stat-content">
						<view class="stat-number">{{ userInfo.completedOrders }}</view>
						<view class="stat-title">已完成订单</view>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon">
						<u-icon name="clock" size="32" color="#ff9500"></u-icon>
					</view>
					<view class="stat-content">
						<view class="stat-number">{{ userInfo.pendingOrders }}</view>
						<view class="stat-title">待处理订单</view>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon">
						<u-icon name="star-fill" size="32" color="#ffa500"></u-icon>
					</view>
					<view class="stat-content">
						<view class="stat-number">{{ userInfo.averageRating }}</view>
						<view class="stat-title">平均评分</view>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon">
						<u-icon name="rmb" size="32" color="#52c41a"></u-icon>
					</view>
					<view class="stat-content">
						<view class="stat-number">¥{{ userInfo.monthlyIncome }}</view>
						<view class="stat-title">本月收入</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 技能标签 -->
		<view class="skills-section">
			<view class="section-header">
				<view class="section-title">技能标签</view>
				<u-button type="primary" size="mini" @click="editSkills">编辑</u-button>
			</view>
			<view class="skills-content">
				<view class="skills-list" v-if="userInfo.skills && userInfo.skills.length > 0">
					<u-tag 
						v-for="skill in userInfo.skills" 
						:key="skill"
						:text="skill" 
						size="medium"
						type="primary"
						style="margin-right: 16rpx; margin-bottom: 16rpx;"
					></u-tag>
				</view>
				<view class="empty-skills" v-else>
					<text>暂无技能标签</text>
					<u-button type="default" size="mini" @click="addSkills">添加技能</u-button>
				</view>
			</view>
		</view>

		<!-- 服务区域 -->
		<view class="service-area-section">
			<view class="section-header">
				<view class="section-title">服务区域</view>
				<u-button type="primary" size="mini" @click="editServiceArea">编辑</u-button>
			</view>
			<view class="service-area-content">
				<view class="area-list" v-if="userInfo.serviceAreas && userInfo.serviceAreas.length > 0">
					<u-tag 
						v-for="area in userInfo.serviceAreas" 
						:key="area"
						:text="area" 
						size="medium"
						type="success"
						style="margin-right: 16rpx; margin-bottom: 16rpx;"
					></u-tag>
				</view>
				<view class="empty-areas" v-else>
					<text>暂无服务区域</text>
					<u-button type="default" size="mini" @click="addServiceArea">添加区域</u-button>
				</view>
			</view>
		</view>

		<!-- 设置列表 -->
		<view class="settings-section">
			<u-cell-group>
				<u-cell-item 
					icon="account" 
					title="个人信息" 
					@click="goToPersonalInfo"
				></u-cell-item>
				<u-cell-item 
					icon="setting" 
					title="服务设置" 
					@click="goToServiceSettings"
				></u-cell-item>
				<u-cell-item 
					icon="calendar" 
					title="工作时间" 
					@click="goToWorkSchedule"
				></u-cell-item>
				<u-cell-item 
					icon="star" 
					title="我的评价" 
					:value="userInfo.totalReviews + '条'"
					@click="goToReviews"
				></u-cell-item>
				<u-cell-item 
					icon="order" 
					title="订单管理" 
					@click="goToOrders"
				></u-cell-item>
				<u-cell-item 
					icon="wallet" 
					title="财务管理" 
					@click="goToFinance"
				></u-cell-item>
				<u-cell-item 
					icon="question-circle" 
					title="帮助中心" 
					@click="goToHelp"
				></u-cell-item>
				<u-cell-item 
					icon="phone" 
					title="联系客服" 
					@click="contactCustomerService"
				></u-cell-item>
				<u-cell-item 
					icon="setting" 
					title="设置" 
					@click="goToSettings"
				></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {
				id: 1,
				name: '王师傅',
				phone: '138****8888',
				avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
				isCertified: true,
				level: '金牌师傅',
				levelProgress: 75,
				totalOrders: 156,
				monthlyOrders: 23,
				rating: 4.8,
				balance: 2580.50,
				completedOrders: 142,
				pendingOrders: 3,
				averageRating: 4.9,
				monthlyIncome: 5680,
				totalReviews: 89,
				skills: ['空调维修', '冰箱维修', '洗衣机维修', '热水器维修', '电视维修'],
				serviceAreas: ['朝阳区', '海淀区', '西城区', '东城区', '丰台区']
			}
		}
	},
	onLoad() {
		this.loadUserInfo()
	},
	methods: {
		loadUserInfo() {
			// 模拟加载用户信息
			// 这里可以从后端获取数据
		},
		changeAvatar() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					const tempFilePath = res.tempFilePaths[0]
					// 这里可以上传到服务器
					this.userInfo.avatar = tempFilePath
					uni.showToast({
						title: '头像更新成功',
						icon: 'success'
					})
				}
			})
		},
		goToWithdraw() {
			uni.navigateTo({
				url: '/pages/master/order/list'
			})
		},
		goToTransactions() {
			uni.navigateTo({
				url: '/pages/master/order/list'
			})
		},
		editSkills() {
			uni.navigateTo({
				url: '/pages/master/profile/profile'
			})
		},
		addSkills() {
			this.editSkills()
		},
		editServiceArea() {
			uni.navigateTo({
				url: '/pages/master/profile/profile'
			})
		},
		addServiceArea() {
			this.editServiceArea()
		},
		goToPersonalInfo() {
			uni.navigateTo({
				url: '/pages/master/profile/profile'
			})
		},
		goToServiceSettings() {
			uni.navigateTo({
				url: '/pages/master/profile/profile'
			})
		},
		goToWorkSchedule() {
			uni.navigateTo({
				url: '/pages/master/schedule/schedule'
			})
		},
		goToReviews() {
			uni.navigateTo({
				url: '/pages/master/order/list'
			})
		},
		goToOrders() {
			uni.navigateTo({
				url: '/pages/master/order/list'
			})
		},
		goToFinance() {
			uni.navigateTo({
				url: '/pages/master/order/list'
			})
		},
		goToHelp() {
			uni.navigateTo({
				url: '/pages/master/order/list'
			})
		},
		contactCustomerService() {
			uni.makePhoneCall({
				phoneNumber: '400-123-4567'
			})
		},
		goToSettings() {
			uni.navigateTo({
				url: '/pages/master/profile/profile'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.profile-container {
	background-color: #f8f8f8;
	min-height: 100vh;
}

.profile-header {
	background: linear-gradient(135deg, #007AFF 0%, #0056b3 100%);
	padding: 40rpx 30rpx;
	color: #ffffff;
}

.user-info {
	display: flex;
	align-items: center;
	gap: 24rpx;
	margin-bottom: 40rpx;
}

.avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	border: 4rpx solid #ffffff;
	object-fit: cover;
}

.user-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.user-name {
	display: flex;
	align-items: center;
	gap: 12rpx;
	font-size: 36rpx;
	font-weight: bold;
}

.certification-status {
	display: flex;
	align-items: center;
	gap: 4rpx;
	font-size: 24rpx;
	background-color: rgba(255, 255, 255, 0.2);
	padding: 4rpx 12rpx;
	border-radius: 16rpx;
}

.user-phone {
	font-size: 28rpx;
	opacity: 0.9;
}

.user-level {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.level-badge {
	display: flex;
	align-items: center;
	gap: 8rpx;
	background-color: rgba(255, 255, 255, 0.2);
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: 500;
}

.level-progress {
	display: flex;
	align-items: center;
	gap: 12rpx;
	flex: 1;
}

.progress-bar {
	flex: 1;
	height: 8rpx;
	background-color: rgba(255, 255, 255, 0.3);
	border-radius: 4rpx;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background-color: #ffffff;
	border-radius: 4rpx;
	transition: width 0.3s ease;
}

.progress-text {
	font-size: 20rpx;
	font-weight: 500;
}

.header-stats {
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.stat-item {
	text-align: center;
}

.stat-value {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.stat-label {
	font-size: 24rpx;
	opacity: 0.8;
}

.balance-section {
	background-color: #ffffff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.balance-card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
	padding: 30rpx;
	border-radius: 16rpx;
}

.balance-info {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.balance-label {
	font-size: 28rpx;
	color: #666666;
}

.balance-amount {
	font-size: 48rpx;
	font-weight: bold;
	color: #007AFF;
}

.balance-actions {
	display: flex;
	gap: 16rpx;
}

.stats-section,
.skills-section,
.service-area-section,
.settings-section {
	background-color: #ffffff;
	margin-bottom: 20rpx;
}

.stats-section {
	padding: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 24rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 30rpx 0;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 0;
}

.stats-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20rpx;
}

.stat-card {
	display: flex;
	align-items: center;
	gap: 20rpx;
	background-color: #f8f8f8;
	padding: 24rpx;
	border-radius: 12rpx;
}

.stat-icon {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #ffffff;
	border-radius: 50%;
}

.stat-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.stat-number {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.stat-title {
	font-size: 24rpx;
	color: #666666;
}

.skills-content,
.service-area-content {
	padding: 0 30rpx 30rpx;
}

.skills-list,
.area-list {
	display: flex;
	flex-wrap: wrap;
}

.empty-skills,
.empty-areas {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
	padding: 40rpx 0;
	color: #999999;
	font-size: 28rpx;
}
</style>