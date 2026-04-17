<template>
	<view class="profile-container">
		<!-- 商家信息头部 -->
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
					<view class="business-type">{{ userInfo.businessType }}</view>
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

		<!-- 营业统计 -->
		<view class="stats-section">
			<view class="section-title">营业统计</view>
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

		<!-- 服务分类 -->
		<view class="service-categories-section">
			<view class="section-header">
				<view class="section-title">服务分类</view>
				<u-button type="primary" size="mini" @click="editCategories">编辑</u-button>
			</view>
			<view class="categories-content">
				<view class="categories-list" v-if="userInfo.serviceCategories && userInfo.serviceCategories.length > 0">
					<u-tag 
						v-for="category in userInfo.serviceCategories" 
						:key="category"
						:text="category" 
						size="medium"
						type="primary"
						style="margin-right: 16rpx; margin-bottom: 16rpx;"
					></u-tag>
				</view>
				<view class="empty-categories" v-else>
					<text>暂无服务分类</text>
					<u-button type="default" size="mini" @click="addCategories">添加分类</u-button>
				</view>
			</view>
		</view>

		<!-- 营业时间 -->
		<view class="business-hours-section">
			<view class="section-header">
				<view class="section-title">营业时间</view>
				<u-button type="primary" size="mini" @click="editBusinessHours">编辑</u-button>
			</view>
			<view class="business-hours-content">
				<view class="hours-list" v-if="userInfo.businessHours && userInfo.businessHours.length > 0">
					<view 
						v-for="(hours, index) in userInfo.businessHours" 
						:key="index"
						class="hours-item"
					>
						<view class="day-name">{{ hours.day }}</view>
						<view class="time-range">{{ hours.startTime }} - {{ hours.endTime }}</view>
					</view>
				</view>
				<view class="empty-hours" v-else>
					<text>暂无营业时间设置</text>
					<u-button type="default" size="mini" @click="addBusinessHours">设置时间</u-button>
				</view>
			</view>
		</view>

		<!-- 商家地址 -->
		<view class="address-section">
			<view class="section-header">
				<view class="section-title">商家地址</view>
				<u-button type="primary" size="mini" @click="editAddress">编辑</u-button>
			</view>
			<view class="address-content">
				<view class="address-info" v-if="userInfo.address">
					<view class="address-text">{{ userInfo.address }}</view>
					<view class="address-coordinates" v-if="userInfo.coordinates">
						经纬度: {{ userInfo.coordinates.latitude }}, {{ userInfo.coordinates.longitude }}
					</view>
				</view>
				<view class="empty-address" v-else>
					<text>暂无商家地址</text>
					<u-button type="default" size="mini" @click="addAddress">添加地址</u-button>
				</view>
			</view>
		</view>

		<!-- 设置列表 -->
		<view class="settings-section">
			<u-cell-group>
				<u-cell-item 
					icon="account" 
					title="商家信息" 
					@click="goToBusinessInfo"
				></u-cell-item>
				<u-cell-item 
					icon="setting" 
					title="服务管理" 
					@click="goToServiceManage"
				></u-cell-item>
				<u-cell-item 
					icon="calendar" 
					title="营业时间" 
					@click="goToBusinessHours"
				></u-cell-item>
				<u-cell-item 
					icon="star" 
					title="评价管理" 
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
				name: '啄木鸟维修服务',
				phone: '400-123-4567',
				avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
				isCertified: true,
				businessType: '家电维修服务商',
				totalOrders: 1234,
				monthlyOrders: 156,
				rating: 4.9,
				balance: 12850.75,
				completedOrders: 1156,
				pendingOrders: 12,
				averageRating: 4.8,
				monthlyIncome: 45680,
				totalReviews: 234,
				serviceCategories: ['空调维修', '冰箱维修', '洗衣机维修', '热水器维修', '电视维修'],
				businessHours: [
					{ day: '周一', startTime: '09:00', endTime: '18:00' },
					{ day: '周二', startTime: '09:00', endTime: '18:00' },
					{ day: '周三', startTime: '09:00', endTime: '18:00' },
					{ day: '周四', startTime: '09:00', endTime: '18:00' },
					{ day: '周五', startTime: '09:00', endTime: '18:00' },
					{ day: '周六', startTime: '09:00', endTime: '17:00' },
					{ day: '周日', startTime: '10:00', endTime: '16:00' }
				],
				address: '北京市朝阳区建国门外大街1号',
				coordinates: {
					latitude: 39.9042,
					longitude: 116.4074
				}
			}
		}
	},
	onLoad() {
		this.loadUserInfo()
	},
	methods: {
		loadUserInfo() {
			// 模拟加载商家信息
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
				url: '/pages/business/finance/withdraw'
			})
		},
		goToTransactions() {
			uni.navigateTo({
				url: '/pages/business/finance/transactions'
			})
		},
		editCategories() {
			uni.navigateTo({
				url: '/pages/business/profile/categories'
			})
		},
		addCategories() {
			this.editCategories()
		},
		editBusinessHours() {
			uni.navigateTo({
				url: '/pages/business/profile/business-hours'
			})
		},
		addBusinessHours() {
			this.editBusinessHours()
		},
		editAddress() {
			uni.navigateTo({
				url: '/pages/business/profile/address'
			})
		},
		addAddress() {
			this.editAddress()
		},
		goToBusinessInfo() {
			uni.navigateTo({
				url: '/pages/business/profile/business-info'
			})
		},
		goToServiceManage() {
			uni.navigateTo({
				url: '/pages/business/service/manage'
			})
		},
		goToBusinessHours() {
			this.editBusinessHours()
		},
		goToReviews() {
			uni.navigateTo({
				url: '/pages/business/profile/reviews'
			})
		},
		goToOrders() {
			uni.navigateTo({
				url: '/pages/business/order/list'
			})
		},
		goToFinance() {
			uni.navigateTo({
				url: '/pages/business/finance/overview'
			})
		},
		goToHelp() {
			uni.navigateTo({
				url: '/pages/business/help/index'
			})
		},
		contactCustomerService() {
			uni.makePhoneCall({
				phoneNumber: '400-123-4567'
			})
		},
		goToSettings() {
			uni.navigateTo({
				url: '/pages/business/settings/index'
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

.business-type {
	font-size: 26rpx;
	opacity: 0.8;
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
.service-categories-section,
.business-hours-section,
.address-section,
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

.categories-content,
.business-hours-content,
.address-content {
	padding: 0 30rpx 30rpx;
}

.categories-list {
	display: flex;
	flex-wrap: wrap;
}

.empty-categories,
.empty-hours,
.empty-address {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
	padding: 40rpx 0;
	color: #999999;
	font-size: 28rpx;
}

.hours-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.hours-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.day-name {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
	min-width: 80rpx;
}

.time-range {
	font-size: 28rpx;
	color: #666666;
}

.address-info {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.address-text {
	font-size: 30rpx;
	color: #333333;
	line-height: 1.5;
}

.address-coordinates {
	font-size: 24rpx;
	color: #999999;
}
</style>