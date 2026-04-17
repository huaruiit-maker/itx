<template>
	<view class="order-detail-container">
		<!-- 订单状态 -->
		<view class="order-status-section">
			<view class="status-header">
				<view class="status-icon">
					<u-icon 
						:name="getStatusIcon(orderInfo.status)" 
						size="48" 
						:color="getStatusColor(orderInfo.status)"
					></u-icon>
				</view>
				<view class="status-info">
					<view class="status-text">{{ getStatusText(orderInfo.status) }}</view>
					<view class="status-desc">{{ getStatusDesc(orderInfo.status) }}</view>
				</view>
			</view>
			
			<!-- 进度条 -->
			<view class="progress-bar">
				<view class="progress-steps">
					<view 
						class="step" 
						v-for="(step, index) in progressSteps" 
						:key="index"
						:class="{ active: step.active, completed: step.completed }"
					>
						<view class="step-icon">
							<u-icon name="checkmark" size="16" color="#ffffff"></u-icon>
						</view>
						<view class="step-text">{{ step.text }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 服务信息 -->
		<view class="service-section">
			<view class="section-title">服务信息</view>
			<view class="service-card">
				<view class="service-header">
					<image 
						class="service-image" 
						:src="orderInfo.serviceImage" 
						mode="aspectFill"
					></image>
					<view class="service-content">
						<view class="service-name">{{ orderInfo.serviceName }}</view>
						<view class="service-desc">{{ orderInfo.serviceDesc }}</view>
						<view class="service-price">¥{{ orderInfo.price }}</view>
					</view>
				</view>
				<view class="service-specs" v-if="orderInfo.specs && orderInfo.specs.length">
					<view class="spec-item" v-for="spec in orderInfo.specs" :key="spec">
						<u-tag :text="spec" size="mini" type="info"></u-tag>
					</view>
				</view>
			</view>
		</view>

		<!-- 预约信息 -->
		<view class="appointment-section">
			<view class="section-title">预约信息</view>
			<view class="info-card">
				<view class="info-item">
					<view class="info-label">预约时间</view>
					<view class="info-value">{{ orderInfo.appointmentTime }}</view>
				</view>
				<view class="info-item">
					<view class="info-label">服务地址</view>
					<view class="info-value">
						<view class="address-text">{{ orderInfo.address }}</view>
						<view class="address-detail" v-if="orderInfo.addressDetail">
							{{ orderInfo.addressDetail }}
						</view>
					</view>
				</view>
				<view class="info-item">
					<view class="info-label">联系人</view>
					<view class="info-value">{{ orderInfo.contactName }} {{ orderInfo.contactPhone }}</view>
				</view>
			</view>
		</view>

		<!-- 师傅信息 -->
		<view class="master-section" v-if="orderInfo.master">
			<view class="section-title">师傅信息</view>
			<view class="master-card">
				<view class="master-avatar">
					<image 
						:src="orderInfo.master.avatar" 
						mode="aspectFill"
					></image>
				</view>
				<view class="master-info">
					<view class="master-name">{{ orderInfo.master.name }}</view>
					<view class="master-rating">
						<u-icon name="star-fill" size="16" color="#ffa500"></u-icon>
						<text class="rating-score">{{ orderInfo.master.rating }}</text>
						<text class="rating-count">({{ orderInfo.master.orderCount }}单)</text>
					</view>
					<view class="master-skills" v-if="orderInfo.master.skills">
						<view class="skill-item" v-for="skill in orderInfo.master.skills" :key="skill">
							<u-tag :text="skill" size="mini" type="info"></u-tag>
						</view>
					</view>
				</view>
				<view class="master-actions">
					<u-button 
						type="primary" 
						size="mini" 
						plain
						@click="callMaster(orderInfo.master)"
					>
						联系师傅
					</u-button>
					<u-button 
						type="primary" 
						size="mini" 
						@click="viewMasterProfile(orderInfo.master)"
					>
						查看资料
					</u-button>
				</view>
			</view>
		</view>

		<!-- 费用明细 -->
		<view class="cost-section">
			<view class="section-title">费用明细</view>
			<view class="cost-card">
				<view class="cost-item">
					<view class="cost-label">服务费用</view>
					<view class="cost-value">¥{{ orderInfo.price }}</view>
				</view>
				<view class="cost-item" v-if="orderInfo.additionalCost">
					<view class="cost-label">附加费用</view>
					<view class="cost-value">¥{{ orderInfo.additionalCost }}</view>
				</view>
				<view class="cost-item" v-if="orderInfo.discount">
					<view class="cost-label">优惠减免</view>
					<view class="cost-value discount">-¥{{ orderInfo.discount }}</view>
				</view>
				<view class="cost-total">
					<view class="total-label">实付金额</view>
					<view class="total-value">¥{{ orderInfo.actualPrice }}</view>
				</view>
			</view>
		</view>

		<!-- 订单信息 -->
		<view class="order-info-section">
			<view class="section-title">订单信息</view>
			<view class="info-card">
				<view class="info-item">
					<view class="info-label">订单编号</view>
					<view class="info-value">{{ orderInfo.orderNo }}</view>
					<view class="copy-btn" @click="copyOrderNo">复制</view>
				</view>
				<view class="info-item">
					<view class="info-label">下单时间</view>
					<view class="info-value">{{ orderInfo.createTime }}</view>
				</view>
				<view class="info-item" v-if="orderInfo.payTime">
					<view class="info-label">支付时间</view>
					<view class="info-value">{{ orderInfo.payTime }}</view>
				</view>
				<view class="info-item" v-if="orderInfo.completeTime">
					<view class="info-label">完成时间</view>
					<view class="info-value">{{ orderInfo.completeTime }}</view>
				</view>
			</view>
		</view>

		<!-- 底部操作 -->
		<view class="bottom-actions">
			<view class="action-buttons">
				<u-button 
					v-if="orderInfo.status === 'pending'" 
					type="error" 
					plain
					@click="cancelOrder"
				>
					取消订单
				</u-button>
				<u-button 
					v-if="orderInfo.status === 'pending_payment'" 
					type="primary" 
					@click="payOrder"
				>
					立即支付
				</u-button>
				<u-button 
					v-if="orderInfo.status === 'completed' && !orderInfo.isEvaluated" 
					type="primary" 
					@click="evaluateOrder"
				>
					立即评价
				</u-button>
				<u-button 
					v-if="orderInfo.status === 'completed' || orderInfo.status === 'cancelled'" 
					type="primary" 
					plain
					@click="reorder"
				>
					再次预约
				</u-button>
				<u-button 
					v-if="orderInfo.status === 'processing'" 
					type="primary" 
					plain
					@click="contactMaster"
				>
					联系师傅
				</u-button>
			</view>
		</view>

		<!-- 取消订单弹窗 -->
		<u-modal 
			v-model="showCancelModal" 
			title="取消订单" 
			show-cancel-button
			@confirm="confirmCancel"
		>
			<view class="cancel-content">
				<view class="cancel-reason">
					<view class="reason-title">请选择取消原因</view>
					<u-radio-group v-model="cancelReason">
						<u-radio name="change_plan">计划有变，暂时不需要</u-radio>
						<u-radio name="find_other">找到其他师傅，价格更合适</u-radio>
						<u-radio name="time_conflict">预约时间不合适</u-radio>
						<u-radio name="other">其他原因</u-radio>
					</u-radio-group>
				</view>
				<view class="reason-input" v-if="cancelReason === 'other'">
					<u-input 
						v-model="otherReason" 
						type="textarea" 
						placeholder="请输入具体原因"
						border
					></u-input>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: '',
			orderInfo: {
				id: 1,
				orderNo: 'WD20241201001',
				status: 'pending',
				createTime: '2024-12-01 10:30:00',
				serviceImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200',
				serviceName: '空调维修服务',
				serviceDesc: '挂机空调清洗保养，包含拆机清洗、消毒杀菌',
				price: 128,
				actualPrice: 128,
				specs: ['挂机空调', '清洗保养'],
				appointmentTime: '2024-12-02 14:00-16:00',
				address: '朝阳区建国路88号SOHO现代城A座1502室',
				addressDetail: '15楼1502室',
				contactName: '张先生',
				contactPhone: '13800138000',
				master: {
					id: 1,
					name: '王师傅',
					avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
					rating: 4.8,
					orderCount: 156,
					skills: ['空调维修', '空调清洗', '空调安装']
				},
				isEvaluated: false
			},
			progressSteps: [
				{ text: '下单', active: true, completed: true },
				{ text: '接单', active: false, completed: false },
				{ text: '服务', active: false, completed: false },
				{ text: '完成', active: false, completed: false }
			],
			showCancelModal: false,
			cancelReason: '',
			otherReason: ''
		}
	},
	onLoad(option) {
		if (option.id) {
			this.orderId = option.id
			this.loadOrderDetail()
		}
	},
	methods: {
		loadOrderDetail() {
			// 模拟加载订单详情
			// 这里可以根据订单ID从后端获取数据
			this.updateProgressSteps()
		},
		updateProgressSteps() {
			const status = this.orderInfo.status
			this.progressSteps = [
				{ text: '下单', active: true, completed: true },
				{ text: '接单', active: status === 'processing' || status === 'completed', completed: status === 'processing' || status === 'completed' },
				{ text: '服务', active: status === 'processing' || status === 'completed', completed: status === 'completed' },
				{ text: '完成', active: status === 'completed', completed: status === 'completed' }
			]
		},
		getStatusIcon(status) {
			const iconMap = {
				pending: 'clock',
				processing: 'play-circle',
				completed: 'checkmark-circle',
				cancelled: 'close-circle'
			}
			return iconMap[status] || 'help-circle'
		},
		getStatusColor(status) {
			const colorMap = {
				pending: '#ffa500',
				processing: '#007AFF',
				completed: '#52c41a',
				cancelled: '#ff4d4f'
			}
			return colorMap[status] || '#999999'
		},
		getStatusText(status) {
			const textMap = {
				pending: '待接单',
				processing: '进行中',
				completed: '已完成',
				cancelled: '已取消'
			}
			return textMap[status] || '未知状态'
		},
		getStatusDesc(status) {
			const descMap = {
				pending: '师傅正在接单中，请耐心等待',
				processing: '师傅已接单，正在为您服务',
				completed: '服务已完成，感谢您的使用',
				cancelled: '订单已取消'
			}
			return descMap[status] || ''
		},
		viewOrderDetail(order) {
			uni.navigateTo({
				url: `/pages/customer/order/detail?id=${order.id}`
			})
		},
		callMaster(master) {
			uni.makePhoneCall({
				phoneNumber: master.phone || '13800138000'
			})
		},
		viewMasterProfile(master) {
			uni.navigateTo({
				url: `/pages/master/profile?id=${master.id}`
			})
		},
		copyOrderNo() {
			uni.setClipboardData({
				data: this.orderInfo.orderNo,
				success: () => {
					uni.showToast({
						title: '订单号已复制',
						icon: 'success'
					})
				}
			})
		},
		cancelOrder() {
			this.showCancelModal = true
		},
		confirmCancel() {
			if (!this.cancelReason) {
				uni.showToast({
					title: '请选择取消原因',
					icon: 'none'
				})
				return
			}
			
			if (this.cancelReason === 'other' && !this.otherReason.trim()) {
				uni.showToast({
					title: '请输入具体原因',
					icon: 'none'
				})
				return
			}
			
			// 模拟取消订单
			this.orderInfo.status = 'cancelled'
			this.updateProgressSteps()
			this.showCancelModal = false
			
			uni.showToast({
				title: '订单已取消',
				icon: 'success'
			})
		},
		payOrder() {
			// 模拟支付
			uni.showLoading({
				title: '支付中...'
			})
			
			setTimeout(() => {
				uni.hideLoading()
				this.orderInfo.status = 'processing'
				this.orderInfo.payTime = new Date().toLocaleString()
				this.updateProgressSteps()
				
				uni.showToast({
					title: '支付成功',
					icon: 'success'
				})
			}, 1500)
		},
		evaluateOrder() {
			uni.navigateTo({
				url: `/pages/customer/order/evaluate?id=${this.orderInfo.id}`
			})
		},
		reorder() {
			uni.navigateTo({
				url: `/pages/customer/booking/booking?serviceId=${this.orderInfo.serviceId}`
			})
		},
		contactMaster() {
			this.callMaster(this.orderInfo.master)
		}
	}
}
</script>

<style lang="scss" scoped>
.order-detail-container {
	background-color: #f8f8f8;
	min-height: 100vh;
	padding-bottom: 120rpx;
}

.order-status-section {
	background: linear-gradient(135deg, #007AFF 0%, #0056b3 100%);
	color: #ffffff;
	padding: 40rpx 30rpx;
	margin-bottom: 20rpx;
}

.status-header {
	display: flex;
	align-items: center;
	gap: 24rpx;
	margin-bottom: 40rpx;
}

.status-icon {
	width: 96rpx;
	height: 96rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
}

.status-text {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.status-desc {
	font-size: 28rpx;
	opacity: 0.9;
}

.progress-bar {
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 12rpx;
	padding: 20rpx;
}

.progress-steps {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.step {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	position: relative;
}

.step:not(:last-child)::after {
	content: '';
	position: absolute;
	top: 20rpx;
	left: 60rpx;
	width: 120rpx;
	height: 2rpx;
	background-color: rgba(255, 255, 255, 0.3);
}

.step.completed:not(:last-child)::after {
	background-color: #ffffff;
}

.step-icon {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
}

.step.active .step-icon,
.step.completed .step-icon {
	background-color: #ffffff;
}

.step-text {
	font-size: 24rpx;
	opacity: 0.8;
}

.step.active .step-text,
.step.completed .step-text {
	opacity: 1;
	font-weight: 500;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 20rpx;
}

.service-section,
.appointment-section,
.master-section,
.cost-section,
.order-info-section {
	background-color: #ffffff;
	border-radius: 16rpx;
	margin: 20rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.service-card {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.service-header {
	display: flex;
	gap: 20rpx;
}

.service-image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 12rpx;
	object-fit: cover;
}

.service-content {
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

.service-price {
	font-size: 36rpx;
	font-weight: bold;
	color: #ff6b35;
}

.service-specs {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.info-card,
.master-card,
.cost-card {
	background-color: #f8f8f8;
	border-radius: 12rpx;
	padding: 24rpx;
}

.info-item,
.cost-item {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.info-item:last-child,
.cost-item:last-child {
	border-bottom: none;
}

.info-label,
.cost-label {
	font-size: 28rpx;
	color: #666666;
	min-width: 140rpx;
}

.info-value {
	flex: 1;
	text-align: right;
	font-size: 28rpx;
	color: #333333;
}

.address-text {
	margin-bottom: 8rpx;
}

.address-detail {
	font-size: 24rpx;
	color: #999999;
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
	overflow: hidden;
}

.master-avatar image {
	width: 100%;
	height: 100%;
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

.master-skills {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
	margin-top: 8rpx;
}

.master-actions {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.cost-value {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
}

.cost-value.discount {
	color: #52c41a;
}

.cost-total {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 24rpx;
	margin-top: 24rpx;
	border-top: 2rpx solid #f0f0f0;
}

.total-label {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.total-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #ff6b35;
}

.info-item {
	position: relative;
}

.copy-btn {
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	font-size: 24rpx;
	color: #007AFF;
	padding: 8rpx 16rpx;
	border: 1rpx solid #007AFF;
	border-radius: 8rpx;
	cursor: pointer;
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
	padding: 20rpx 30rpx;
	box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.action-buttons {
	display: flex;
	gap: 20rpx;
	justify-content: flex-end;
}

.cancel-content {
	padding: 20rpx 0;
}

.cancel-reason {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.reason-title {
	font-size: 28rpx;
	color: #333333;
	margin-bottom: 16rpx;
}

.reason-input {
	margin-top: 20rpx;
}
</style>