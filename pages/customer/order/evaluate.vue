<template>
	<view class="evaluate-container">
		<!-- 订单信息 -->
		<view class="order-info-section">
			<view class="order-card">
				<image 
					class="service-image" 
					:src="orderInfo.serviceImage" 
					mode="aspectFill"
				></image>
				<view class="order-content">
					<view class="service-name">{{ orderInfo.serviceName }}</view>
					<view class="service-desc">{{ orderInfo.serviceDesc }}</view>
					<view class="appointment-info">
						<u-icon name="clock" size="20" color="#666666"></u-icon>
						<text>{{ orderInfo.appointmentTime }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 师傅信息 -->
		<view class="master-section" v-if="orderInfo.master">
			<view class="section-title">服务师傅</view>
			<view class="master-card">
				<image 
					class="master-avatar" 
					:src="orderInfo.master.avatar" 
					mode="aspectFill"
				></image>
				<view class="master-info">
					<view class="master-name">{{ orderInfo.master.name }}</view>
					<view class="master-rating">
						<u-icon name="star-fill" size="16" color="#ffa500"></u-icon>
						<text class="rating-score">{{ orderInfo.master.rating }}</text>
						<text class="rating-count">({{ orderInfo.master.orderCount }}单)</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 服务评分 -->
		<view class="rating-section">
			<view class="section-title">服务评分</view>
			<view class="rating-card">
				<view class="rating-item">
					<view class="rating-label">服务态度</view>
					<view class="rating-content">
						<u-rate 
							v-model="evaluateData.serviceAttitude" 
							size="32"
							active-color="#ffa500"
							@change="onServiceAttitudeChange"
						></u-rate>
						<text class="rating-text">{{ getRatingText(evaluateData.serviceAttitude) }}</text>
					</view>
				</view>
				<view class="rating-item">
					<view class="rating-label">专业技能</view>
					<view class="rating-content">
						<u-rate 
							v-model="evaluateData.professionalSkill" 
							size="32"
							active-color="#ffa500"
							@change="onProfessionalSkillChange"
						></u-rate>
						<text class="rating-text">{{ getRatingText(evaluateData.professionalSkill) }}</text>
					</view>
				</view>
				<view class="rating-item">
					<view class="rating-label">服务效率</view>
					<view class="rating-content">
						<u-rate 
							v-model="evaluateData.serviceEfficiency" 
							size="32"
							active-color="#ffa500"
							@change="onServiceEfficiencyChange"
						></u-rate>
						<text class="rating-text">{{ getRatingText(evaluateData.serviceEfficiency) }}</text>
					</view>
				</view>
				<view class="rating-item">
					<view class="rating-label">整体满意度</view>
					<view class="rating-content">
						<u-rate 
							v-model="evaluateData.overallSatisfaction" 
							size="32"
							active-color="#ffa500"
							@change="onOverallSatisfactionChange"
						></u-rate>
						<text class="rating-text">{{ getRatingText(evaluateData.overallSatisfaction) }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 评价标签 -->
		<view class="tags-section">
			<view class="section-title">评价标签</view>
			<view class="tags-card">
				<view class="tags-group">
					<view class="group-title">服务态度</view>
					<view class="tags-list">
						<u-tag 
							v-for="tag in attitudeTags" 
							:key="tag"
							:text="tag" 
							size="medium"
							:type="isTagSelected(tag, 'attitude') ? 'primary' : 'default'"
							@click="toggleTag(tag, 'attitude')"
						></u-tag>
					</view>
				</view>
				<view class="tags-group">
					<view class="group-title">专业技能</view>
					<view class="tags-list">
						<u-tag 
							v-for="tag in skillTags" 
							:key="tag"
							:text="tag" 
							size="medium"
							:type="isTagSelected(tag, 'skill') ? 'primary' : 'default'"
							@click="toggleTag(tag, 'skill')"
						></u-tag>
					</view>
				</view>
				<view class="tags-group">
					<view class="group-title">服务体验</view>
					<view class="tags-list">
						<u-tag 
							v-for="tag in experienceTags" 
							:key="tag"
							:text="tag" 
							size="medium"
							:type="isTagSelected(tag, 'experience') ? 'primary' : 'default'"
							@click="toggleTag(tag, 'experience')"
						></u-tag>
					</view>
				</view>
			</view>
		</view>

		<!-- 评价内容 -->
		<view class="content-section">
			<view class="section-title">评价内容</view>
			<view class="content-card">
				<u-input 
					v-model="evaluateData.content" 
					type="textarea" 
					placeholder="请分享您的服务体验，对其他用户很有帮助哦～"
					border
					maxlength="500"
					height="200"
				></u-input>
				<view class="char-count">{{ evaluateData.content.length }}/500</view>
			</view>
		</view>

		<!-- 上传图片 -->
		<view class="images-section">
			<view class="section-title">上传图片</view>
			<view class="images-card">
				<u-upload 
					ref="uUpload"
					:action="uploadAction"
					:file-list="evaluateData.images"
					max-count="6"
					width="160"
					height="160"
					@on-uploaded="onImagesUploaded"
					@on-remove="onImageRemove"
				></u-upload>
				<view class="upload-tips">最多可上传6张图片</view>
			</view>
		</view>

		<!-- 匿名评价 -->
		<view class="anonymous-section">
			<view class="anonymous-item">
				<view class="anonymous-label">匿名评价</view>
				<u-switch 
					v-model="evaluateData.isAnonymous" 
					active-color="#007AFF"
				></u-switch>
			</view>
			<view class="anonymous-tips">开启后，您的评价将不会显示昵称</view>
		</view>

		<!-- 提交按钮 -->
		<view class="submit-section">
			<u-button 
				type="primary" 
				size="large"
				@click="submitEvaluate"
				:disabled="!canSubmit"
			>
				提交评价
			</u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: '',
			orderInfo: {
				id: 1,
				serviceName: '空调维修服务',
				serviceDesc: '挂机空调清洗保养，包含拆机清洗、消毒杀菌',
				serviceImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200',
				appointmentTime: '2024-12-02 14:00-16:00',
				master: {
					name: '王师傅',
					avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
					rating: 4.8,
					orderCount: 156
				}
			},
			evaluateData: {
				serviceAttitude: 5,
				professionalSkill: 5,
				serviceEfficiency: 5,
				overallSatisfaction: 5,
				content: '',
				images: [],
				isAnonymous: false,
				selectedTags: {
					attitude: [],
					skill: [],
					experience: []
				}
			},
			attitudeTags: ['态度友好', '耐心细致', '积极主动', '守时守信', '服务周到'],
			skillTags: ['技术专业', '经验丰富', '操作熟练', '解决问题', '讲解清楚'],
			experienceTags: ['性价比高', '服务快速', '效果满意', '值得推荐', '超出预期'],
			uploadAction: 'https://upload.example.com/api/upload'
		}
	},
	onLoad(option) {
		if (option.id) {
			this.orderId = option.id
			this.loadOrderInfo()
		}
	},
	computed: {
		canSubmit() {
			return this.evaluateData.content.trim().length >= 10 && 
				   this.evaluateData.overallSatisfaction > 0
		}
	},
	methods: {
		loadOrderInfo() {
			// 模拟加载订单信息
			// 这里可以根据订单ID从后端获取数据
		},
		onServiceAttitudeChange(value) {
			console.log('服务态度评分:', value)
		},
		onProfessionalSkillChange(value) {
			console.log('专业技能评分:', value)
		},
		onServiceEfficiencyChange(value) {
			console.log('服务效率评分:', value)
		},
		onOverallSatisfactionChange(value) {
			console.log('整体满意度评分:', value)
		},
		getRatingText(score) {
			const texts = ['', '非常差', '差', '一般', '好', '非常好']
			return texts[score] || ''
		},
		toggleTag(tag, category) {
			const tags = this.evaluateData.selectedTags[category]
			const index = tags.indexOf(tag)
			if (index > -1) {
				tags.splice(index, 1)
			} else {
				tags.push(tag)
			}
		},
		isTagSelected(tag, category) {
			return this.evaluateData.selectedTags[category].includes(tag)
		},
		onImagesUploaded(lists) {
			console.log('图片上传完成:', lists)
			this.evaluateData.images = lists.map(item => item.url)
		},
		onImageRemove(index) {
			console.log('删除图片:', index)
			this.evaluateData.images.splice(index, 1)
		},
		async submitEvaluate() {
			if (!this.canSubmit) {
				uni.showToast({
					title: '请填写完整评价内容',
					icon: 'none'
				})
				return
			}
			
			uni.showLoading({
				title: '提交中...'
			})
			
			try {
				// 模拟提交评价
				setTimeout(() => {
					uni.hideLoading()
					uni.showToast({
						title: '评价提交成功',
						icon: 'success'
					})
					
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				}, 2000)
			} catch (error) {
				uni.hideLoading()
				uni.showToast({
					title: '提交失败，请重试',
					icon: 'none'
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.evaluate-container {
	background-color: #f8f8f8;
	min-height: 100vh;
	padding-bottom: 120rpx;
}

.order-info-section {
	background-color: #ffffff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.order-card {
	display: flex;
	gap: 20rpx;
	align-items: center;
}

.service-image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 12rpx;
	object-fit: cover;
}

.order-content {
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
	line-height: 1.4;
}

.appointment-info {
	display: flex;
	align-items: center;
	gap: 12rpx;
	font-size: 26rpx;
	color: #999999;
}

.master-section,
.rating-section,
.tags-section,
.content-section,
.images-section,
.anonymous-section {
	background-color: #ffffff;
	margin-bottom: 20rpx;
	padding: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 24rpx;
}

.master-card {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.master-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	object-fit: cover;
}

.master-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.master-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

.master-rating {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.rating-score {
	font-size: 24rpx;
	color: #ffa500;
	font-weight: bold;
}

.rating-count {
	font-size: 24rpx;
	color: #999999;
}

.rating-card {
	display: flex;
	flex-direction: column;
	gap: 32rpx;
}

.rating-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.rating-label {
	font-size: 30rpx;
	color: #333333;
	font-weight: 500;
}

.rating-content {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.rating-text {
	font-size: 28rpx;
	color: #666666;
	min-width: 120rpx;
}

.tags-card {
	display: flex;
	flex-direction: column;
	gap: 32rpx;
}

.tags-group {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.group-title {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
}

.tags-list {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.content-card {
	position: relative;
}

.char-count {
	position: absolute;
	bottom: 16rpx;
	right: 16rpx;
	font-size: 24rpx;
	color: #999999;
}

.images-card {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.upload-tips {
	font-size: 24rpx;
	color: #999999;
}

.anonymous-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.anonymous-label {
	font-size: 30rpx;
	color: #333333;
	font-weight: 500;
}

.anonymous-tips {
	font-size: 24rpx;
	color: #999999;
}

.submit-section {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
	padding: 20rpx 30rpx;
	box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.1);
}
</style>