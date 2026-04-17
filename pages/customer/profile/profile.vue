<template>
	<view class="profile-container">
		<!-- 用户信息头部 -->
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
						{{ userInfo.nickname }}
						<view class="vip-badge" v-if="userInfo.isVip">
							<u-icon name="star-fill" color="#ffa500" size="20"></u-icon>
							<text>VIP</text>
						</view>
					</view>
					<view class="user-phone">{{ userInfo.phone }}</view>
					<view class="user-level">
						<view class="level-info">
							<text class="level-text">{{ userInfo.level }}</text>
							<text class="level-desc">{{ userInfo.levelDesc }}</text>
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
				<view class="stat-item" @click="goToOrders">
					<view class="stat-value">{{ userInfo.totalOrders }}</view>
					<view class="stat-label">总订单</view>
				</view>
				<view class="stat-item" @click="goToCoupons">
					<view class="stat-value">{{ userInfo.coupons }}</view>
					<view class="stat-label">优惠券</view>
				</view>
				<view class="stat-item" @click="goToPoints">
					<view class="stat-value">{{ userInfo.points }}</view>
					<view class="stat-label">积分</view>
				</view>
			</view>
		</view>

		<!-- 会员权益 -->
		<view class="vip-section" v-if="userInfo.isVip">
			<view class="vip-card">
				<view class="vip-header">
					<view class="vip-title">VIP会员</view>
					<view class="vip-expire">{{ userInfo.vipExpireDate }}到期</view>
				</view>
				<view class="vip-benefits">
					<view class="benefit-item">
						<u-icon name="coupon" color="#ffa500" size="24"></u-icon>
						<text>专属优惠券</text>
					</view>
					<view class="benefit-item">
						<u-icon name="star" color="#ffa500" size="24"></u-icon>
						<text>优先服务</text>
					</view>
					<view class="benefit-item">
						<u-icon name="gift" color="#ffa500" size="24"></u-icon>
						<text>生日礼品</text>
					</view>
				</view>
				<view class="vip-action">
					<u-button type="warning" size="mini" @click="renewVip">立即续费</u-button>
				</view>
			</view>
		</view>
		<view class="vip-section" v-else>
			<view class="vip-card">
				<view class="vip-header">
					<view class="vip-title">开通VIP会员</view>
				</view>
				<view class="vip-benefits">
					<view class="benefit-item">
						<u-icon name="coupon" color="#999" size="24"></u-icon>
						<text>专属优惠券</text>
					</view>
					<view class="benefit-item">
						<u-icon name="star" color="#999" size="24"></u-icon>
						<text>优先服务</text>
					</view>
					<view class="benefit-item">
						<u-icon name="gift" color="#999" size="24"></u-icon>
						<text>生日礼品</text>
					</view>
				</view>
				<view class="vip-action">
					<u-button type="warning" size="mini" @click="openVip">立即开通</u-button>
				</view>
			</view>
		</view>

		<!-- 我的订单 -->
		<view class="orders-section">
			<view class="section-header">
				<view class="section-title">我的订单</view>
				<view class="section-more" @click="goToOrders">查看全部</view>
			</view>
			<view class="orders-grid">
				<view class="order-item" @click="goToOrdersByStatus(0)">
					<u-icon name="order" size="40" color="#007AFF"></u-icon>
					<view class="order-label">全部订单</view>
					<view class="order-count" v-if="userInfo.totalOrders > 0">{{ userInfo.totalOrders }}</view>
				</view>
				<view class="order-item" @click="goToOrdersByStatus(1)">
					<u-icon name="clock" size="40" color="#ff9500"></u-icon>
					<view class="order-label">待支付</view>
					<view class="order-count" v-if="userInfo.pendingPayment > 0">{{ userInfo.pendingPayment }}</view>
				</view>
				<view class="order-item" @click="goToOrdersByStatus(2)">
					<u-icon name="play-circle" size="40" color="#52c41a"></u-icon>
					<view class="order-label">进行中</view>
					<view class="order-count" v-if="userInfo.inProgress > 0">{{ userInfo.inProgress }}</view>
				</view>
				<view class="order-item" @click="goToOrdersByStatus(3)">
					<u-icon name="star" size="40" color="#ffa500"></u-icon>
					<view class="order-label">待评价</view>
					<view class="order-count" v-if="userInfo.pendingReview > 0">{{ userInfo.pendingReview }}</view>
				</view>
			</view>
		</view>

		<!-- 常用功能 -->
		<view class="functions-section">
			<view class="section-title">常用功能</view>
			<view class="functions-grid">
				<view class="function-item" @click="goToAddresses">
					<view class="function-icon">
						<u-icon name="map" size="32" color="#007AFF"></u-icon>
					</view>
					<view class="function-label">收货地址</view>
				</view>
				<view class="function-item" @click="goToCoupons">
					<view class="function-icon">
						<u-icon name="coupon" size="32" color="#ff9500"></u-icon>
					</view>
					<view class="function-label">优惠券</view>
				</view>
				<view class="function-item" @click="goToPoints">
					<view class="function-icon">
						<u-icon name="star" size="32" color="#ffa500"></u-icon>
					</view>
					<view class="function-label">积分商城</view>
				</view>
				<view class="function-item" @click="goToFavorites">
					<view class="function-icon">
						<u-icon name="heart" size="32" color="#ff4757"></u-icon>
					</view>
					<view class="function-label">我的收藏</view>
				</view>
				<view class="function-item" @click="goToHistory">
					<view class="function-icon">
						<u-icon name="clock" size="32" color="#666666"></u-icon>
					</view>
					<view class="function-label">浏览历史</view>
				</view>
				<view class="function-item" @click="goToCustomerService">
					<view class="function-icon">
						<u-icon name="phone" size="32" color="#52c41a"></u-icon>
					</view>
					<view class="function-label">客服中心</view>
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
					title="账号设置" 
					@click="goToAccountSettings"
				></u-cell-item>
				<u-cell-item 
					icon="bag" 
					title="商家管理" 
					@click="goToBusinessManage"
				></u-cell-item>
				<u-cell-item 
					icon="calendar" 
					title="师傅接单" 
					@click="goToMasterOrders"
				></u-cell-item>
				<u-cell-item 
					icon="lock" 
					title="隐私设置" 
					@click="goToPrivacySettings"
				></u-cell-item>
				<u-cell-item 
					icon="bell" 
					title="消息通知" 
					@click="goToNotifications"
				></u-cell-item>
				<u-cell-item 
					icon="star" 
					title="我的评价" 
					:value="userInfo.totalReviews + '条'"
					@click="goToReviews"
				></u-cell-item>
				<u-cell-item 
					icon="question-circle" 
					title="帮助中心" 
					@click="goToHelp"
				></u-cell-item>
				<u-cell-item 
					icon="info-circle" 
					title="关于我们" 
					@click="goToAbout"
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
				nickname: '张先生',
				phone: '138****8888',
				avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
				isVip: true,
				level: '黄金会员',
				levelDesc: '再消费¥500升级铂金',
				levelProgress: 75,
				totalOrders: 23,
				coupons: 8,
				points: 2580,
				balance: 0,
				vipExpireDate: '2025-12-31',
				pendingPayment: 2,
				inProgress: 1,
				pendingReview: 3,
				totalReviews: 15,
				registrationDate: '2023-01-15'
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
		renewVip() {
			uni.navigateTo({
				url: '/pages/customer/vip/renew'
			})
		},
		openVip() {
			uni.navigateTo({
				url: '/pages/customer/vip/open'
			})
		},
		goToOrders() {
			uni.navigateTo({
				url: '/pages/customer/order/list'
			})
		},
		goToOrdersByStatus(status) {
			uni.navigateTo({
				url: `/pages/customer/order/list?status=${status}`
			})
		},
		goToAddresses() {
			uni.navigateTo({
				url: '/pages/customer/address/list'
			})
		},
		goToCoupons() {
			uni.navigateTo({
				url: '/pages/customer/service/list'
			})
		},
		goToPoints() {
			uni.navigateTo({
				url: '/pages/customer/service/list'
			})
		},
		goToFavorites() {
			uni.navigateTo({
				url: '/pages/customer/service/list'
			})
		},
		goToHistory() {
			uni.navigateTo({
				url: '/pages/customer/order/list'
			})
		},
		goToCustomerService() {
			uni.navigateTo({
				url: '/pages/customer/service/list'
			})
		},
		goToPersonalInfo() {
			uni.navigateTo({
				url: '/pages/customer/profile/profile'
			})
		},
		goToAccountSettings() {
			uni.navigateTo({
				url: '/pages/customer/profile/profile'
			})
		},
		goToPrivacySettings() {
			uni.navigateTo({
				url: '/pages/customer/profile/profile'
			})
		},
		goToNotifications() {
			uni.navigateTo({
				url: '/pages/customer/profile/profile'
			})
		},
		goToReviews() {
			uni.navigateTo({
				url: '/pages/customer/order/list'
			})
		},
		goToHelp() {
			uni.navigateTo({
				url: '/pages/customer/service/list'
			})
		},
		goToAbout() {
			uni.navigateTo({
				url: '/pages/customer/service/list'
			})
		},
		goToSettings() {
			uni.navigateTo({
				url: '/pages/customer/profile/profile'
			})
		},
		goToBusinessManage() {
			// 检查商家认证状态
			const isBusinessAuthed = uni.getStorageSync('businessAuth') || false
			if (!isBusinessAuthed) {
				uni.showModal({
					title: '未认证',
					content: '您还未完成商家认证，是否立即认证？',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/business/auth/auth'
							})
						}
					}
				})
			} else {
				uni.navigateTo({
					url: '/pages/business/workbench/workbench'
				})
			}
		},
		goToMasterOrders() {
			// 检查师傅认证状态
			const isMasterAuthed = uni.getStorageSync('masterAuth') || false
			if (!isMasterAuthed) {
				uni.showModal({
					title: '未认证',
					content: '您还未完成师傅认证，是否立即认证？',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/master/auth/auth'
							})
						}
					}
				})
			} else {
				uni.navigateTo({
					url: '/pages/master/workbench/workbench'
				})
			}
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

.vip-badge {
	display: flex;
	align-items: center;
	gap: 4rpx;
	background-color: rgba(255, 165, 0, 0.2);
	padding: 4rpx 12rpx;
	border-radius: 16rpx;
	font-size: 20rpx;
	color: #ffa500;
	font-weight: 500;
}

.user-phone {
	font-size: 28rpx;
	opacity: 0.9;
}

.user-level {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.level-info {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.level-text {
	font-size: 24rpx;
	font-weight: 500;
}

.level-desc {
	font-size: 20rpx;
	opacity: 0.8;
}

.level-progress {
	display: flex;
	align-items: center;
	gap: 12rpx;
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

.vip-section {
	background-color: #ffffff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.vip-card {
	background: linear-gradient(135deg, #fffaf0 0%, #fff8e6 100%);
	border: 2rpx solid #ffa500;
	border-radius: 16rpx;
	padding: 30rpx;
}

.vip-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.vip-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.vip-expire {
	font-size: 24rpx;
	color: #666666;
}

.vip-benefits {
	display: flex;
	justify-content: space-around;
	margin-bottom: 24rpx;
}

.benefit-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	font-size: 24rpx;
	color: #666666;
}

.vip-action {
	display: flex;
	justify-content: center;
}

.orders-section,
.functions-section {
	background-color: #ffffff;
	margin-bottom: 20rpx;
}

.orders-section {
	padding: 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.section-more {
	font-size: 26rpx;
	color: #007AFF;
}

.orders-grid {
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.order-item {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	padding: 20rpx;
}

.order-label {
	font-size: 24rpx;
	color: #666666;
}

.order-count {
	position: absolute;
	top: 10rpx;
	right: 10rpx;
	background-color: #ff4757;
	color: #ffffff;
	font-size: 20rpx;
	font-weight: bold;
	padding: 4rpx 8rpx;
	border-radius: 12rpx;
	min-width: 32rpx;
	text-align: center;
}

.functions-section {
	padding: 30rpx;
}

.functions-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 30rpx;
}

.function-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
	padding: 24rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
}

.function-icon {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.function-label {
	font-size: 26rpx;
	color: #333333;
}

.settings-section {
	background-color: #ffffff;
}
</style>