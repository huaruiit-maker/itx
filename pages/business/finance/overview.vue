<template>
	<view class="finance-overview-container">
		<!-- 顶部统计卡片 -->
		<view class="stat-cards">
			<view class="stat-card">
				<view class="card-header">
					<u-icon name="rmb" size="32" color="#52c41a"></u-icon>
					<text class="card-title">今日收入</text>
				</view>
				<view class="card-value">¥{{ todayIncome }}</view>
				<view class="card-trend">
					<text class="trend-text">较昨日</text>
					<text class="trend-value" :class="{ up: incomeTrend > 0 }">
						{{ incomeTrend > 0 ? '+' : '' }}{{ incomeTrend }}%
					</text>
				</view>
			</view>
			
			<view class="stat-card">
				<view class="card-header">
					<u-icon name="order" size="32" color="#1890ff"></u-icon>
					<text class="card-title">今日订单</text>
				</view>
				<view class="card-value">{{ todayOrders }}</view>
				<view class="card-trend">
					<text class="trend-text">较昨日</text>
					<text class="trend-value" :class="{ up: orderTrend > 0 }">
						{{ orderTrend > 0 ? '+' : '' }}{{ orderTrend }}%
					</text>
				</view>
			</view>
			
			<view class="stat-card">
				<view class="card-header">
					<u-icon name="account" size="32" color="#722ed1"></u-icon>
					<text class="card-title">本月收入</text>
				</view>
				<view class="card-value">¥{{ monthIncome }}</view>
				<view class="card-trend">
					<text class="trend-text">较上月</text>
					<text class="trend-value" :class="{ up: monthTrend > 0 }">
						{{ monthTrend > 0 ? '+' : '' }}{{ monthTrend }}%
					</text>
				</view>
			</view>
			
			<view class="stat-card">
				<view class="card-header">
					<u-icon name="star" size="32" color="#fa8c16"></u-icon>
					<text class="card-title">账户余额</text>
				</view>
				<view class="card-value">¥{{ balance }}</view>
				<view class="card-trend">
					<u-button type="primary" size="mini" @click="withdraw">提现</u-button>
				</view>
			</view>
		</view>

		<!-- 收入趋势图表 -->
		<view class="chart-section">
			<view class="section-header">
				<text class="section-title">收入趋势</text>
				<view class="time-selector">
					<u-tabs 
						:list="timeTabs" 
						:current="currentTimeTab" 
						@change="changeTimeTab"
						lineColor="#007AFF"
						:activeStyle="{
							color: '#007AFF',
							fontWeight: 'bold'
						}"
					></u-tabs>
				</view>
			</view>
			
			<view class="chart-container">
				<canvas canvas-id="incomeChart" id="incomeChart" class="chart-canvas"></canvas>
			</view>
		</view>

		<!-- 收支明细 -->
		<view class="transaction-section">
			<view class="section-header">
				<text class="section-title">收支明细</text>
				<u-button type="primary" size="mini" plain @click="viewAllTransactions">查看全部</u-button>
			</view>
			
			<scroll-view scroll-y class="transaction-list">
				<view class="transaction-item" v-for="item in transactions" :key="item.id">
					<view class="transaction-icon">
						<u-icon 
							:name="getTransactionIcon(item.type)" 
							size="24" 
							:color="getTransactionColor(item.type)"
						></u-icon>
					</view>
					<view class="transaction-info">
						<text class="transaction-title">{{ item.title }}</text>
						<text class="transaction-time">{{ item.time }}</text>
					</view>
					<view class="transaction-amount" :class="{ income: item.type === 'income' }">
						{{ item.type === 'income' ? '+' : '-' }}¥{{ item.amount }}
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 提现弹窗 -->
		<u-popup v-model="showWithdrawPopup" mode="bottom" border-radius="16">
			<view class="withdraw-popup">
				<view class="popup-header">
					<text class="popup-title">申请提现</text>
					<u-icon name="close" size="24" color="#999999" @click="showWithdrawPopup = false"></u-icon>
				</view>
				
				<view class="withdraw-form">
					<view class="form-item">
						<text class="form-label">可提现金额</text>
						<text class="form-value">¥{{ balance }}</text>
					</view>
					
					<view class="form-item">
						<text class="form-label">提现金额</text>
						<u-input 
							v-model="withdrawAmount" 
							type="number" 
							placeholder="请输入提现金额"
							border="bottom"
						></u-input>
					</view>
					
					<view class="form-item">
						<text class="form-label">提现方式</text>
						<u-radio-group v-model="withdrawMethod">
							<u-radio name="bank">银行卡</u-radio>
							<u-radio name="alipay">支付宝</u-radio>
							<u-radio name="wechat">微信</u-radio>
						</u-radio-group>
					</view>
				</view>
				
				<view class="popup-actions">
					<u-button type="default" plain @click="showWithdrawPopup = false">取消</u-button>
					<u-button type="primary" @click="submitWithdraw">确认提现</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			todayIncome: 2580,
			incomeTrend: 12.5,
			todayOrders: 18,
			orderTrend: -3.2,
			monthIncome: 45680,
			monthTrend: 8.7,
			balance: 12350,
			timeTabs: [
				{ name: '7天' },
				{ name: '30天' },
				{ name: '90天' }
			],
			currentTimeTab: 0,
			transactions: [
				{
					id: 1,
					title: '空调维修服务收入',
					time: '2024-12-01 14:30',
					amount: 150,
					type: 'income'
				},
				{
					id: 2,
					title: '冰箱维修服务收入',
					time: '2024-12-01 13:15',
					amount: 200,
					type: 'income'
				},
				{
					id: 3,
					title: '平台服务费',
					time: '2024-12-01 12:00',
					amount: 35,
					type: 'expense'
				},
				{
					id: 4,
					title: '洗衣机维修服务收入',
					time: '2024-12-01 11:45',
					amount: 180,
					type: 'income'
				},
				{
					id: 5,
					title: '提现手续费',
					time: '2024-12-01 10:30',
					amount: 10,
					type: 'expense'
				}
			],
			showWithdrawPopup: false,
			withdrawAmount: '',
			withdrawMethod: 'bank'
		}
	},
	onLoad() {
		this.initChart()
	},
	methods: {
		initChart() {
			// 初始化图表
			const ctx = uni.createCanvasContext('incomeChart', this)
			
			// 模拟数据
			const data = [1200, 1500, 1800, 2200, 1900, 2400, 2580]
			const labels = ['11-25', '11-26', '11-27', '11-28', '11-29', '11-30', '12-01']
			
			// 绘制图表
			const width = 350
			const height = 200
			const padding = 40
			
			// 绘制坐标轴
			ctx.beginPath()
			ctx.moveTo(padding, padding)
			ctx.lineTo(padding, height - padding)
			ctx.lineTo(width - padding, height - padding)
			ctx.strokeStyle = '#e0e0e0'
			ctx.stroke()
			
			// 绘制数据线
			ctx.beginPath()
			const maxValue = Math.max(...data)
			const scale = (height - 2 * padding) / maxValue
			
			data.forEach((value, index) => {
				const x = padding + (index * (width - 2 * padding) / (data.length - 1))
				const y = height - padding - (value * scale)
				
				if (index === 0) {
					ctx.moveTo(x, y)
				} else {
					ctx.lineTo(x, y)
				}
			})
			
			ctx.strokeStyle = '#007AFF'
			ctx.lineWidth = 2
			ctx.stroke()
			
			// 绘制数据点
			data.forEach((value, index) => {
				const x = padding + (index * (width - 2 * padding) / (data.length - 1))
				const y = height - padding - (value * scale)
				
				ctx.beginPath()
				ctx.arc(x, y, 4, 0, 2 * Math.PI)
				ctx.fillStyle = '#007AFF'
				ctx.fill()
			})
			
			// 绘制标签
			ctx.fillStyle = '#666666'
			ctx.font = '12px Arial'
			labels.forEach((label, index) => {
				const x = padding + (index * (width - 2 * padding) / (labels.length - 1))
				ctx.fillText(label, x - 15, height - 20)
			})
			
			ctx.draw()
		},
		changeTimeTab(index) {
			this.currentTimeTab = index
			// 重新初始化图表
			this.initChart()
		},
		getTransactionIcon(type) {
			return type === 'income' ? 'rmb' : 'close'
		},
		getTransactionColor(type) {
			return type === 'income' ? '#52c41a' : '#ff6b35'
		},
		withdraw() {
			this.showWithdrawPopup = true
			this.withdrawAmount = ''
			this.withdrawMethod = 'bank'
		},
		viewAllTransactions() {
			uni.navigateTo({
				url: '/pages/business/finance/transactions'
			})
		},
		submitWithdraw() {
			if (!this.withdrawAmount) {
				uni.showToast({
					title: '请输入提现金额',
					icon: 'none'
				})
				return
			}
			
			if (parseFloat(this.withdrawAmount) > this.balance) {
				uni.showToast({
					title: '提现金额不能大于余额',
					icon: 'none'
				})
				return
			}
			
			uni.showModal({
				title: '确认提现',
				content: `确定要提现 ¥${this.withdrawAmount} 吗？`,
				success: (res) => {
					if (res.confirm) {
						// 模拟提现
						this.balance -= parseFloat(this.withdrawAmount)
						this.showWithdrawPopup = false
						
						uni.showToast({
							title: '提现申请已提交',
							icon: 'success'
						})
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.finance-overview-container {
	background-color: #f8f8f8;
	min-height: 100vh;
	padding: 20rpx;
}

.stat-cards {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20rpx;
	margin-bottom: 30rpx;
}

.stat-card {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.card-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 20rpx;
}

.card-title {
	font-size: 28rpx;
	color: #666666;
}

.card-value {
	font-size: 48rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 12rpx;
}

.card-trend {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.trend-text {
	font-size: 24rpx;
	color: #999999;
}

.trend-value {
	font-size: 24rpx;
	color: #ff6b35;
}

.trend-value.up {
	color: #52c41a;
}

.chart-section {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
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

.time-selector {
	width: 300rpx;
}

.chart-container {
	height: 400rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.chart-canvas {
	width: 700rpx;
	height: 400rpx;
}

.transaction-section {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.transaction-list {
	max-height: 600rpx;
}

.transaction-item {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.transaction-item:last-child {
	border-bottom: none;
}

.transaction-icon {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f8f8f8;
	border-radius: 50%;
}

.transaction-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.transaction-title {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
}

.transaction-time {
	font-size: 24rpx;
	color: #999999;
}

.transaction-amount {
	font-size: 32rpx;
	font-weight: bold;
	color: #ff6b35;
}

.transaction-amount.income {
	color: #52c41a;
}

.withdraw-popup {
	background-color: #ffffff;
	border-radius: 16rpx 16rpx 0 0;
	padding: 40rpx;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
}

.popup-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
}

.withdraw-form {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
	margin-bottom: 40rpx;
}

.form-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.form-label {
	font-size: 28rpx;
	color: #666666;
}

.form-value {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.popup-actions {
	display: flex;
	gap: 20rpx;
}
</style>