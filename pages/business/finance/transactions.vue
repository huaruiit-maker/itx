<template>
	<view class="transactions-container">
		<!-- 筛选栏 -->
		<view class="filter-section">
			<view class="filter-item" @click="showDateFilter = true">
				<u-icon name="calendar" size="24" color="#666666"></u-icon>
				<text class="filter-text">{{ dateFilter.label }}</text>
				<u-icon name="arrow-down" size="16" color="#999999"></u-icon>
			</view>
			<view class="filter-item" @click="showTypeFilter = true">
				<u-icon name="list" size="24" color="#666666"></u-icon>
				<text class="filter-text">{{ typeFilter.label }}</text>
				<u-icon name="arrow-down" size="16" color="#999999"></u-icon>
			</view>
			<view class="filter-item" @click="showSortFilter = true">
				<u-icon name="sort" size="24" color="#666666"></u-icon>
				<text class="filter-text">{{ sortFilter.label }}</text>
				<u-icon name="arrow-down" size="16" color="#999999"></u-icon>
			</view>
		</view>

		<!-- 统计卡片 -->
		<view class="summary-cards">
			<view class="summary-card income">
				<view class="card-header">
					<u-icon name="rmb" size="28" color="#52c41a"></u-icon>
					<text class="card-title">总收入</text>
				</view>
				<view class="card-value">¥{{ totalIncome }}</view>
			</view>
			
			<view class="summary-card expense">
				<view class="card-header">
					<u-icon name="close" size="28" color="#ff6b35"></u-icon>
					<text class="card-title">总支出</text>
				</view>
				<view class="card-value">¥{{ totalExpense }}</view>
			</view>
			
			<view class="summary-card balance">
				<view class="card-header">
					<u-icon name="account" size="28" color="#1890ff"></u-icon>
					<text class="card-title">净收入</text>
				</view>
				<view class="card-value">¥{{ netIncome }}</view>
			</view>
		</view>

		<!-- 交易列表 -->
		<scroll-view 
			scroll-y 
			class="transaction-list" 
			@scrolltolower="loadMore"
			refresher-enabled
			@refresherrefresh="onRefresh"
			:refresher-triggered="isRefreshing"
		>
			<view class="transaction-item" v-for="item in transactionList" :key="item.id">
				<view class="transaction-icon">
					<u-icon 
						:name="getTransactionIcon(item.type)" 
						size="24" 
						:color="getTransactionColor(item.type)"
					></u-icon>
				</view>
				
				<view class="transaction-content">
					<view class="transaction-header">
						<text class="transaction-title">{{ item.title }}</text>
						<text class="transaction-amount" :class="{ income: item.type === 'income' }">
							{{ item.type === 'income' ? '+' : '-' }}¥{{ item.amount }}
						</text>
					</view>
					
					<view class="transaction-info">
						<text class="transaction-time">{{ item.time }}</text>
						<text class="transaction-balance">余额：¥{{ item.balance }}</text>
					</view>
					
					<view class="transaction-desc" v-if="item.description">
						{{ item.description }}
					</view>
					
					<view class="transaction-tags" v-if="item.tags && item.tags.length">
						<view 
							class="tag" 
							v-for="tag in item.tags" 
							:key="tag"
							:style="{ backgroundColor: getTagColor(tag) }"
						>
							{{ tag }}
						</view>
					</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<u-loadmore 
				:status="loadStatus" 
				:load-text="loadText"
				v-if="transactionList.length > 0"
			/>
		</scroll-view>

		<!-- 空状态 -->
		<view class="empty-state" v-if="transactionList.length === 0 && !isLoading">
			<u-empty 
				mode="list"
				text="暂无交易记录"
				icon="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop"
			>
			</u-empty>
		</view>

		<!-- 筛选弹窗 -->
		<u-picker 
			v-model="showDateFilter" 
			mode="selector" 
			:range="dateOptions"
			@confirm="handleDateSelect"
		></u-picker>
		
		<u-picker 
			v-model="showTypeFilter" 
			mode="selector" 
			:range="typeOptions"
			@confirm="handleTypeSelect"
		></u-picker>
		
		<u-picker 
			v-model="showSortFilter" 
			mode="selector" 
			:range="sortOptions"
			@confirm="handleSortSelect"
		></u-picker>
	</view>
</template>

<script>
export default {
	data() {
		return {
			dateFilter: { label: '时间', value: 'all' },
			typeFilter: { label: '类型', value: 'all' },
			sortFilter: { label: '排序', value: 'time' },
			transactionList: [],
			isLoading: false,
			isRefreshing: false,
			loadStatus: 'loadmore',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '加载中...',
				nomore: '没有更多了'
			},
			showDateFilter: false,
			showTypeFilter: false,
			showSortFilter: false,
			dateOptions: ['全部时间', '今天', '本周', '本月', '最近3个月', '今年'],
			typeOptions: ['全部类型', '服务收入', '退款', '平台服务费', '提现手续费', '其他'],
			sortOptions: ['按时间排序', '按金额排序', '按类型排序'],
			totalIncome: 45680,
			totalExpense: 3520,
			netIncome: 42160
		}
	},
	onLoad() {
		this.loadTransactionList()
	},
	methods: {
		loadTransactionList(refresh = false) {
			if (refresh) {
				this.isRefreshing = true
			} else {
				this.isLoading = true
				this.loadStatus = 'loading'
			}
			
			// 模拟加载交易数据
			setTimeout(() => {
				const transactions = [
					{
						id: 1,
						title: '空调维修服务收入',
						time: '2024-12-01 14:30:25',
						amount: 150,
						type: 'income',
						balance: 12500,
						description: '订单号：WD20241201001',
						tags: ['服务收入', '空调维修']
					},
					{
						id: 2,
						title: '冰箱维修服务收入',
						time: '2024-12-01 13:15:18',
						amount: 200,
						type: 'income',
						balance: 12350,
						description: '订单号：WD20241201002',
						tags: ['服务收入', '冰箱维修']
					},
					{
						id: 3,
						title: '平台服务费',
						time: '2024-12-01 12:00:00',
						amount: 35,
						type: 'expense',
						balance: 12150,
						description: '平台服务费扣除',
						tags: ['平台费用']
					},
					{
						id: 4,
						title: '洗衣机维修服务收入',
						time: '2024-12-01 11:45:32',
						amount: 180,
						type: 'income',
						balance: 12185,
						description: '订单号：WD20241201003',
						tags: ['服务收入', '洗衣机维修']
					},
					{
						id: 5,
						title: '提现手续费',
						time: '2024-12-01 10:30:15',
						amount: 10,
						type: 'expense',
						balance: 12005,
						description: '提现手续费',
						tags: ['提现费用']
					},
					{
						id: 6,
						title: '空调清洗服务收入',
						time: '2024-11-30 16:20:45',
						amount: 120,
						type: 'income',
						balance: 12015,
						description: '订单号：WD20241130001',
						tags: ['服务收入', '空调清洗']
					}
				]
				
				if (refresh) {
					this.transactionList = transactions
					this.isRefreshing = false
					uni.showToast({
						title: '刷新成功',
						icon: 'success'
					})
				} else {
					this.transactionList = [...this.transactionList, ...transactions]
					this.loadStatus = transactions.length < 6 ? 'nomore' : 'loadmore'
				}
				
				this.isLoading = false
			}, 1000)
		},
		loadMore() {
			if (this.loadStatus === 'loadmore') {
				this.loadTransactionList()
			}
		},
		onRefresh() {
			this.transactionList = []
			this.loadTransactionList(true)
		},
		getTransactionIcon(type) {
			const iconMap = {
				income: 'rmb',
				expense: 'close',
				refund: 'arrow-down',
				other: 'info-circle'
			}
			return iconMap[type] || 'info-circle'
		},
		getTransactionColor(type) {
			const colorMap = {
				income: '#52c41a',
				expense: '#ff6b35',
				refund: '#fa8c16',
				other: '#999999'
			}
			return colorMap[type] || '#999999'
		},
		getTagColor(tag) {
			const colorMap = {
				'服务收入': '#52c41a20',
				'空调维修': '#1890ff20',
				'冰箱维修': '#722ed120',
				'洗衣机维修': '#fa8c1620',
				'平台费用': '#ff6b3520',
				'提现费用': '#f5222d20',
				'空调清洗': '#13c2c220'
			}
			return colorMap[tag] || '#99999920'
		},
		handleDateSelect(e) {
			this.dateFilter = {
				label: this.dateOptions[e[0]],
				value: e[0]
			}
			this.loadTransactionList(true)
		},
		handleTypeSelect(e) {
			this.typeFilter = {
				label: this.typeOptions[e[0]],
				value: e[0]
			}
			this.loadTransactionList(true)
		},
		handleSortSelect(e) {
			this.sortFilter = {
				label: this.sortOptions[e[0]],
				value: e[0]
			}
			this.loadTransactionList(true)
		}
	}
}
</script>

<style lang="scss" scoped>
.transactions-container {
	background-color: #f8f8f8;
	min-height: 100vh;
}

.filter-section {
	display: flex;
	background-color: #ffffff;
	padding: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.filter-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	padding: 16rpx;
	cursor: pointer;
}

.filter-text {
	font-size: 28rpx;
	color: #666666;
}

.summary-cards {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 20rpx;
	padding: 20rpx;
}

.summary-card {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	text-align: center;
}

.summary-card.income {
	border-left: 6rpx solid #52c41a;
}

.summary-card.expense {
	border-left: 6rpx solid #ff6b35;
}

.summary-card.balance {
	border-left: 6rpx solid #1890ff;
}

.card-header {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	margin-bottom: 16rpx;
}

.card-title {
	font-size: 24rpx;
	color: #666666;
}

.card-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
}

.transaction-list {
	height: calc(100vh - 400rpx);
	padding: 20rpx;
}

.transaction-item {
	display: flex;
	gap: 20rpx;
	padding: 30rpx;
	background-color: #ffffff;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.transaction-icon {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f8f8f8;
	border-radius: 50%;
	flex-shrink: 0;
}

.transaction-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.transaction-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.transaction-title {
	font-size: 30rpx;
	font-weight: 500;
	color: #333333;
}

.transaction-amount {
	font-size: 32rpx;
	font-weight: bold;
	color: #ff6b35;
}

.transaction-amount.income {
	color: #52c41a;
}

.transaction-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.transaction-time {
	font-size: 24rpx;
	color: #999999;
}

.transaction-balance {
	font-size: 24rpx;
	color: #666666;
}

.transaction-desc {
	font-size: 26rpx;
	color: #666666;
	line-height: 1.4;
}

.transaction-tags {
	display: flex;
	gap: 8rpx;
	flex-wrap: wrap;
}

.tag {
	font-size: 20rpx;
	color: #666666;
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 40rpx;
}
</style>