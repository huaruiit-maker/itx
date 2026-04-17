<template>
	<view class="service-detail-container">
		<!-- 服务图片轮播 -->
		<view class="service-images">
			<u-swiper 
				:list="serviceImages" 
				:height="400"
				indicator
				circular
				@click="previewImage"
			></u-swiper>
		</view>

		<!-- 服务基本信息 -->
		<view class="service-info">
			<view class="service-title">
				<text class="title-text">{{ serviceInfo.name }}</text>
				<view class="service-rating">
					<u-rate :value="serviceInfo.rating" disabled></u-rate>
					<text class="rating-text">{{ serviceInfo.rating }}分 ({{ serviceInfo.reviewCount }}条评价)</text>
				</view>
			</view>
			<view class="service-price">
				<text class="price-label">价格：</text>
				<text class="price-value">¥{{ serviceInfo.price }}</text>
				<text class="price-unit">起</text>
			</view>
			<view class="service-stats">
				<view class="stat-item">
					<u-icon name="list" size="24" color="#999"></u-icon>
					<text class="stat-text">已服务{{ serviceInfo.orderCount }}次</text>
				</view>
				<view class="stat-item">
					<u-icon name="man" size="24" color="#999"></u-icon>
					<text class="stat-text">{{ serviceInfo.masterCount }}位师傅</text>
				</view>
				<view class="stat-item">
					<u-icon name="clock" size="24" color="#999"></u-icon>
					<text class="stat-text">{{ serviceInfo.duration }}</text>
				</view>
			</view>
		</view>

		<!-- 服务详情 -->
		<view class="service-details">
			<view class="detail-section">
				<view class="section-header">
					<u-icon name="info-circle" size="28" color="#007AFF"></u-icon>
					<text class="section-title">服务介绍</text>
				</view>
				<view class="section-content">
					<text class="content-text">{{ serviceInfo.description }}</text>
				</view>
			</view>

			<view class="detail-section">
				<view class="section-header">
					<u-icon name="grid" size="28" color="#007AFF"></u-icon>
					<text class="section-title">服务内容</text>
				</view>
				<view class="section-content">
					<view class="service-items">
						<view 
							class="service-item" 
							v-for="(item, index) in serviceInfo.serviceItems" 
							:key="index"
						>
							<u-icon name="checkmark" size="20" color="#52c41a"></u-icon>
							<text class="item-text">{{ item }}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="detail-section">
				<view class="section-header">
					<u-icon name="warning" size="28" color="#ff6b35"></u-icon>
					<text class="section-title">注意事项</text>
				</view>
				<view class="section-content">
					<view class="notice-items">
						<view 
							class="notice-item" 
							v-for="(item, index) in serviceInfo.notices" 
							:key="index"
						>
							<u-icon name="info" size="20" color="#ff6b35"></u-icon>
							<text class="item-text">{{ item }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 师傅列表 -->
		<view class="masters-section">
			<view class="section-header">
				<u-icon name="account" size="28" color="#007AFF"></u-icon>
				<text class="section-title">可接单师傅 ({{ masters.length }})</text>
			</view>
			<view class="masters-list">
				<view 
					class="master-item" 
					v-for="(master, index) in masters" 
					:key="master.id"
					@tap="selectMaster(master)"
				>
					<view class="master-avatar">
						<u-avatar :src="master.avatar" size="default"></u-avatar>
					</view>
					<view class="master-info">
						<view class="master-name-rating">
								<text class="master-name">{{ master.name }}</text>
								<u-rate :value="master.rating" disabled size="20"></u-rate>
								<text class="master-rating">{{ master.rating }}</text>
							</view>
						<view class="master-experience">
							<text class="experience-text">{{ master.experience }}年经验</text>
							<text class="order-count">已接{{ master.orderCount }}单</text>
						</view>
						<view class="master-price">
							<text class="price-label">报价：</text>
							<text class="price-value">¥{{ master.price }}</text>
							<text class="price-unit">起</text>
						</view>
					</view>
					<view class="master-selection">
						<u-radio-group v-model="selectedMasterId">
							<u-radio :name="master.id"></u-radio>
						</u-radio-group>
					</view>
				</view>
			</view>
		</view>

		<!-- 用户评价 -->
		<view class="reviews-section">
			<view class="section-header">
				<u-icon name="star" size="28" color="#007AFF"></u-icon>
				<text class="section-title">用户评价 ({{ reviews.length }})</text>
				<text class="section-more" @tap="goToAllReviews">查看全部 ></text>
			</view>
			<view class="reviews-list">
				<view 
					class="review-item" 
					v-for="(review, index) in reviews" 
					:key="review.id"
				>
					<view class="review-header">
						<view class="reviewer-info">
								<u-avatar :src="review.avatar" size="60"></u-avatar>
								<text class="reviewer-name">{{ review.name }}</text>
								<u-rate :value="review.rating" disabled size="20"></u-rate>
							</view>
						<text class="review-date">{{ review.date }}</text>
					</view>
					<view class="review-content">
						<text class="review-text">{{ review.content }}</text>
					</view>
					<view class="review-images" v-if="review.images && review.images.length > 0">
						<view 
							class="review-image" 
							v-for="(image, imgIndex) in review.images" 
							:key="imgIndex"
							@tap="previewReviewImage(review.images, imgIndex)"
						>
							<u-image :src="image" width="200rpx" height="200rpx" mode="aspectFill"></u-image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-actions">
			<view class="action-buttons">
				<u-button 
					type="primary" 
					size="default" 
					shape="circle"
					@tap="bookService"
					:disabled="!selectedMasterId"
				>
					立即预约
				</u-button>
			</view>
			<view class="service-actions">
				<view class="action-item" @tap="addToFavorites">
					<u-icon :name="isFavorited ? 'star-fill' : 'star'" size="24" :color="isFavorited ? '#fadb14' : '#999'"></u-icon>
					<text class="action-text">收藏</text>
				</view>
				<view class="action-item" @tap="shareService">
					<u-icon name="share" size="24" color="#999"></u-icon>
					<text class="action-text">分享</text>
				</view>
				<view class="action-item" @tap="contactService">
					<u-icon name="kefu-ermai" size="24" color="#999"></u-icon>
					<text class="action-text">客服</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			serviceId: '',
			serviceImages: [
				'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop',
				'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&h=600&fit=crop',
				'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop'
			],
			serviceInfo: {
				name: '空调维修',
				rating: 4.8,
				reviewCount: 1286,
				price: 150,
				orderCount: 2568,
				masterCount: 25,
				duration: '1-2小时',
				description: '专业空调维修服务，包括故障检测、维修、清洗、保养等。我们的师傅都经过专业培训，经验丰富，能够快速准确地诊断和解决各种空调问题。',
				serviceItems: [
					'空调故障检测',
					'空调维修',
					'空调清洗',
					'空调保养',
					'空调移机',
					'空调安装'
				],
				notices: [
					'请提前预约，方便安排师傅时间',
					'维修前请告知空调品牌、型号和故障现象',
					'维修费用根据具体故障情况而定',
					'配件费用另计，会提前告知客户',
					'维修完成后提供3个月质保服务'
				]
			},
			masters: [],
			selectedMasterId: '',
			reviews: [],
			isFavorited: false
		}
	},
	onLoad(options) {
		this.serviceId = options.id
		this.loadServiceDetail()
		this.loadMasters()
		this.loadReviews()
	},
	methods: {
		loadServiceDetail() {
			// 模拟加载服务详情
			console.log('加载服务详情:', this.serviceId)
		},
		loadMasters() {
			// 模拟加载师傅列表
			setTimeout(() => {
				this.masters = [
					{
						id: '1',
						name: '张师傅',
						avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
						rating: 4.9,
						experience: 8,
						orderCount: 1286,
						price: 150
					},
					{
						id: '2',
						name: '李师傅',
						avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
						rating: 4.8,
						experience: 6,
						orderCount: 856,
						price: 180
					},
					{
						id: '3',
						name: '王师傅',
						avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
						rating: 4.7,
						experience: 10,
						orderCount: 1568,
						price: 200
					}
				]
			}, 1000)
		},
		loadReviews() {
			// 模拟加载评价
			setTimeout(() => {
				this.reviews = [
					{
						id: '1',
						name: '李女士',
						avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face',
						rating: 5,
						date: '2024-01-15',
						content: '张师傅很专业，空调修好了，价格也合理，服务态度很好！',
						images: [
							'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop',
							'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400&h=300&fit=crop'
						]
					},
					{
						id: '2',
						name: '王先生',
						avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
						rating: 4,
						date: '2024-01-14',
						content: '服务不错，师傅很准时，技术也很好，就是价格稍微有点贵。'
					}
				]
			}, 1000)
		},
		previewImage(index) {
			uni.previewImage({
				urls: this.serviceImages,
				current: index
			})
		},
		previewReviewImage(images, currentIndex) {
			uni.previewImage({
				urls: images,
				current: currentIndex
			})
		},
		selectMaster(master) {
			this.selectedMasterId = master.id
		},
		bookService() {
			if (!this.selectedMasterId) {
				uni.showToast({
					title: '请选择师傅',
					icon: 'none'
				})
				return
			}
			uni.navigateTo({
				url: `/pages/customer/booking/booking?serviceId=${this.serviceId}&masterId=${this.selectedMasterId}`
			})
		},
		addToFavorites() {
			this.isFavorited = !this.isFavorited
			uni.showToast({
				title: this.isFavorited ? '已收藏' : '取消收藏',
				icon: 'none'
			})
		},
		shareService() {
			uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
		},
		contactService() {
			// 由于客服中心页面不存在，改为显示客服联系方式
			uni.showActionSheet({
				itemList: ['在线客服', '电话客服: 400-123-4567'],
				success: (res) => {
					if (res.tapIndex === 0) {
						// 在线客服 - 可以跳转到客服聊天页面或显示客服二维码
						uni.showToast({
							title: '在线客服功能开发中',
							icon: 'none'
						})
					} else {
						// 电话客服
						uni.makePhoneCall({
							phoneNumber: '400-123-4567'
						})
					}
				}
			})
		},
		goToAllReviews() {
			// 由于评价列表页面不存在，改为跳转到订单列表页面查看相关订单评价
			uni.navigateTo({
				url: `/pages/customer/order/list?tab=reviews&serviceId=${this.serviceId}`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.service-detail-container {
	background-color: #f8f8f8;
	min-height: 100vh;
	padding-bottom: 120rpx;
}

.service-images {
	width: 100%;
	height: 400rpx;
}

.service-info {
	background-color: #ffffff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.service-title {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	margin-bottom: 24rpx;
}

.title-text {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
}

.service-rating {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.rating-text {
	font-size: 24rpx;
	color: #999999;
}

.service-price {
	display: flex;
	align-items: baseline;
	gap: 8rpx;
	margin-bottom: 24rpx;
}

.price-label {
	font-size: 24rpx;
	color: #999999;
}

.price-value {
	font-size: 48rpx;
	font-weight: bold;
	color: #ff6b35;
}

.price-unit {
	font-size: 24rpx;
	color: #999999;
}

.service-stats {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.stat-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.stat-text {
	font-size: 24rpx;
	color: #666666;
}

.service-details {
	background-color: #ffffff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.detail-section {
	margin-bottom: 40rpx;
}

.detail-section:last-child {
	margin-bottom: 0;
}

.section-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 24rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.section-content {
	padding-left: 40rpx;
}

.content-text {
	font-size: 28rpx;
	color: #666666;
	line-height: 1.6;
}

.service-items {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.service-item {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.item-text {
	font-size: 28rpx;
	color: #666666;
}

.notice-items {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.notice-item {
	display: flex;
	align-items: flex-start;
	gap: 12rpx;
}

.masters-section {
	background-color: #ffffff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.masters-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.master-item {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 20rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
}

.master-avatar {
	flex-shrink: 0;
}

.master-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.master-name-rating {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.master-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
}

.master-rating {
	font-size: 24rpx;
	color: #999999;
}

.master-experience {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.experience-text {
	font-size: 24rpx;
	color: #666666;
}

.order-count {
	font-size: 24rpx;
	color: #999999;
}

.master-price {
	display: flex;
	align-items: baseline;
	gap: 4rpx;
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

.price-unit {
	font-size: 24rpx;
	color: #999999;
}

.master-selection {
	flex-shrink: 0;
}

.reviews-section {
	background-color: #ffffff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.section-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 24rpx;
}

.section-more {
	font-size: 26rpx;
	color: #999999;
	margin-left: auto;
}

.reviews-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.review-item {
	padding: 20rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
}

.review-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.reviewer-info {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.reviewer-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
}

.review-date {
	font-size: 24rpx;
	color: #999999;
}

.review-content {
	margin-bottom: 16rpx;
}

.review-text {
	font-size: 28rpx;
	color: #666666;
	line-height: 1.6;
}

.review-images {
	display: flex;
	gap: 12rpx;
	flex-wrap: wrap;
}

.review-image {
	width: 200rpx;
	height: 200rpx;
	border-radius: 8rpx;
	overflow: hidden;
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
	padding: 20rpx;
	box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.action-buttons {
	margin-bottom: 20rpx;
}

.service-actions {
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.action-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.action-text {
	font-size: 24rpx;
	color: #666666;
}
</style>