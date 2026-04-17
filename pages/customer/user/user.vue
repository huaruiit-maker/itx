<template>
	<view class="user-container">
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="user-header">
				<u-image 
					:src="userInfo.avatar" 
					width="120" 
					height="120"
					border-radius="60"
					mode="aspectFill"
				></u-image>
				<view class="user-info">
					<text class="user-name">{{ userInfo.name || '未登录' }}</text>
					<text class="user-phone">{{ userInfo.phone || '点击登录' }}</text>
				</view>
				<u-icon name="arrow-right" size="24" color="#999999" @tap="goToProfile"></u-icon>
			</view>
			<view class="user-stats">
				<view class="stat-item" @tap="goToOrderList('all')">
					<text class="stat-number">{{ userInfo.totalOrders }}</text>
					<text class="stat-label">全部订单</text>
				</view>
				<view class="stat-item" @tap="goToCouponList">
					<text class="stat-number">{{ userInfo.coupons }}</text>
					<text class="stat-label">优惠券</text>
				</view>
				<view class="stat-item" @tap="goToPoints">
					<text class="stat-number">{{ userInfo.points }}</text>
					<text class="stat-label">积分</text>
				</view>
			</view>
		</view>

		<!-- 我的订单 -->
		<view class="order-section">
			<view class="section-header">
				<text class="section-title">我的订单</text>
				<text class="section-more" @tap="goToOrderList('all')">查看全部 ></text>
			</view>
			<view class="order-grid">
				<view class="order-item" @tap="goToOrderList('pending_payment')">
					<u-icon name="rmb" size="40" color="#ff6b35"></u-icon>
					<text class="order-label">待支付</text>
					<u-badge :count="userInfo.pendingPayment" type="error" size="mini"></u-badge>
				</view>
				<view class="order-item" @tap="goToOrderList('pending')">
					<u-icon name="clock" size="40" color="#007AFF"></u-icon>
					<text class="order-label">待服务</text>
					<u-badge :count="userInfo.pendingService" type="error" size="mini"></u-badge>
				</view>
				<view class="order-item" @tap="goToOrderList('in_progress')">
					<u-icon name="play-circle" size="40" color="#52c41a"></u-icon>
					<text class="order-label">进行中</text>
					<u-badge :count="userInfo.inProgress" type="error" size="mini"></u-badge>
				</view>
				<view class="order-item" @tap="goToOrderList('completed')">
					<u-icon name="checkmark-circle" size="40" color="#999999"></u-icon>
					<text class="order-label">已完成</text>
					<u-badge :count="userInfo.completed" type="error" size="mini"></u-badge>
				</view>
			</view>
		</view>

		<!-- 常用功能 -->
		<view class="function-section">
			<view class="section-header">
				<text class="section-title">常用功能</text>
			</view>
			<u-grid :col="4" :border="false">
				<u-grid-item @tap="goToAddress">
					<u-icon name="map" size="40" color="#007AFF"></u-icon>
					<text class="function-label">地址管理</text>
				</u-grid-item>
				<u-grid-item @tap="goToCouponList">
					<u-icon name="coupon" size="40" color="#ff6b35"></u-icon>
					<text class="function-label">优惠券</text>
				</u-grid-item>
				<u-grid-item @tap="goToPoints">
					<u-icon name="integral" size="40" color="#52c41a"></u-icon>
					<text class="function-label">积分商城</text>
				</u-grid-item>
				<u-grid-item @tap="goToCollection">
					<u-icon name="star" size="40" color="#fadb14"></u-icon>
					<text class="function-label">我的收藏</text>
				</u-grid-item>
				<u-grid-item @tap="goToHistory">
					<u-icon name="clock" size="40" color="#722ed1"></u-icon>
					<text class="function-label">浏览历史</text>
				</u-grid-item>
				<u-grid-item @tap="goToInvoice">
					<u-icon name="file-text" size="40" color="#eb2f96"></u-icon>
					<text class="function-label">发票管理</text>
				</u-grid-item>
				<u-grid-item @tap="goToCustomerService">
					<u-icon name="server" size="40" color="#13c2c2"></u-icon>
					<text class="function-label">客服中心</text>
				</u-grid-item>
				<u-grid-item @tap="goToHelp">
					<u-icon name="question-circle" size="40" color="#fa8c16"></u-icon>
					<text class="function-label">帮助中心</text>
				</u-grid-item>
			</u-grid>
		</view>

		<!-- 设置与服务 -->
		<view class="setting-section">
			<u-cell-group>
				<u-cell-item icon="setting" title="设置" @tap="goToSetting"></u-cell-item>
				<u-cell-item icon="info-circle" title="关于我们" @tap="goToAbout"></u-cell-item>
				<u-cell-item icon="share" title="分享应用" @tap="shareApp"></u-cell-item>
			</u-cell-group>
		</view>


	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {
				avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
				name: '张三',
				phone: '138****8888',
				totalOrders: 12,
				coupons: 5,
				points: 1280,
				pendingPayment: 1,
				pendingService: 2,
				inProgress: 1,
				completed: 8
			}
		}
	},
	onLoad() {
		this.loadUserInfo()
	},
	methods: {
		loadUserInfo() {
			// 模拟加载用户信息
			const userData = uni.getStorageSync('userInfo')
			if (userData) {
				this.userInfo = { ...this.userInfo, ...userData }
			}
		},
		goToProfile() {
			uni.navigateTo({
				url: '/pages/customer/user/profile'
			})
		},
		goToOrderList(status) {
			let url = '/pages/customer/order/list'
			if (status && status !== 'all') {
				url += `?status=${status}`
			}
			uni.navigateTo({ url })
		},
		goToCouponList() {
			uni.navigateTo({
				url: '/pages/customer/service/list'
			})
		},
		goToPoints() {
			uni.navigateTo({
				url: '/pages/customer/service/list'
			})
		},
		goToAddress() {
			uni.navigateTo({
				url: '/pages/customer/address/list'
			})
		},
		goToCollection() {
			uni.navigateTo({
				url: '/pages/customer/service/list'
			})
		},
		goToHistory() {
			uni.navigateTo({
				url: '/pages/customer/order/list'
			})
		},
		goToInvoice() {
			uni.navigateTo({
				url: '/pages/customer/service/list'
			})
		},
		goToCustomerService() {
			uni.navigateTo({
				url: '/pages/customer/service/list'
			})
		},
		goToHelp() {
			uni.navigateTo({
				url: '/pages/customer/service/list'
			})
		},
		goToSetting() {
			uni.navigateTo({
				url: '/pages/customer/profile/profile'
			})
		},
		goToAbout() {
			uni.navigateTo({
				url: '/pages/customer/service/list'
			})
		},
		shareApp() {
			uni.share({
				provider: 'weixin',
				type: 5,
				imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
				title: '星云家电维修',
				miniProgram: {
					id: 'gh_xxxxxxxxxx',
					path: 'pages/customer/home/home',
					type: 0,
					webUrl: 'http://uniapp.dcloud.io'
				},
				success: ret => {
					console.log(JSON.stringify(ret))
				},
				fail: err => {
					console.log(JSON.stringify(err))
				}
			})
		},

	}
}
</script>

<style lang="scss" scoped>
.user-container {
	background-color: #f8f8f8;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

.user-card {
	background: linear-gradient(135deg, #007AFF 0%, #0056b3 100%);
	border-radius: 0 0 30rpx 30rpx;
	padding: 40rpx 30rpx 30rpx;
	color: #ffffff;
	margin-bottom: 20rpx;
}

.user-header {
	display: flex;
	align-items: center;
	gap: 20rpx;
	margin-bottom: 40rpx;
}

.user-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.user-name {
	font-size: 36rpx;
	font-weight: bold;
}

.user-phone {
	font-size: 28rpx;
	opacity: 0.8;
}

.user-stats {
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.stat-number {
	font-size: 36rpx;
	font-weight: bold;
}

.stat-label {
	font-size: 24rpx;
	opacity: 0.8;
}

.order-section,
.function-section,
.setting-section {
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

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.section-more {
	font-size: 26rpx;
	color: #999999;
}

.order-grid {
	padding: 20rpx 0;
}

.order-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	position: relative;
}

.order-label {
	font-size: 24rpx;
	color: #666666;
}

.function-section {
	margin-top: 20rpx;
}

.function-label {
	font-size: 24rpx;
	color: #666666;
	margin-top: 12rpx;
}


</style>