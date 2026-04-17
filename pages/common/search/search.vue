<template>
  <view class="search-container">
    <!-- 搜索栏 -->
    <view class="search-header">
      <view class="search-box">
        <u-icon name="search" size="20" color="#999"></u-icon>
        <input 
          class="search-input" 
          type="text" 
          placeholder="搜索家电维修服务"
          v-model="searchKeyword"
          @confirm="handleSearch"
          @input="handleInput"
          focus
        />
        <view v-if="searchKeyword" class="clear-btn" @tap="clearSearch">
          <u-icon name="close-circle-fill" size="16" color="#999"></u-icon>
        </view>
      </view>
      <text class="cancel-btn" @tap="goBack">取消</text>
    </view>

    <!-- 搜索历史 -->
    <view class="search-history" v-if="!searchKeyword && searchHistory.length > 0">
      <view class="history-header">
        <text class="history-title">搜索历史</text>
        <text class="clear-history" @tap="clearHistory">清空</text>
      </view>
      <view class="history-tags">
        <view 
          class="history-tag" 
          v-for="(item, index) in searchHistory" 
          :key="index"
          @tap="quickSearch(item)"
        >
          {{item}}
        </view>
      </view>
    </view>

    <!-- 热门搜索 -->
    <view class="hot-search" v-if="!searchKeyword">
      <view class="hot-header">
        <text class="hot-title">热门搜索</text>
      </view>
      <view class="hot-tags">
        <view 
          class="hot-tag" 
          v-for="(item, index) in hotSearchList" 
          :key="index"
          @tap="quickSearch(item)"
        >
          <text class="tag-rank" v-if="index < 3">{{index + 1}}</text>
          {{item}}
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="search-results" v-if="searchKeyword">
      <view class="result-header">
        <text class="result-title">搜索结果</text>
        <text class="result-count">共{{searchResults.length}}个服务</text>
      </view>
      
      <scroll-view scroll-y class="result-list" @scrolltolower="loadMore">
        <view 
          class="result-item" 
          v-for="(item, index) in searchResults" 
          :key="index"
          @tap="goToServiceDetail(item)"
        >
          <view class="service-image">
            <image :src="item.image" mode="aspectFill"></image>
          </view>
          <view class="service-info">
            <view class="service-name">
              <text v-html="highlightKeyword(item.name)"></text>
            </view>
            <view class="service-desc">{{item.description}}</view>
            <view class="service-meta">
              <view class="service-price">
                <text class="price-symbol">¥</text>
                <text class="price-number">{{item.price}}</text>
                <text class="price-unit">起</text>
              </view>
              <view class="service-sales">
                已服务{{item.sales}}次
              </view>
            </view>
            <view class="service-rating">
              <u-rate :value="item.rating" size="12" disabled></u-rate>
              <text class="rating-text">{{item.rating}}</text>
            </view>
          </view>
        </view>
        
        <!-- 加载更多 -->
        <view class="load-more" v-if="hasMore">
          <u-loading-icon v-if="loading"></u-loading-icon>
          <text v-else-if="!loading && searchResults.length > 0" @tap="loadMore">加载更多</text>
        </view>
        
        <!-- 空状态 -->
        <view class="empty-state" v-if="searchResults.length === 0 && !loading">
          <u-icon name="search" size="80" color="#999"></u-icon>
          <text class="empty-text">未找到相关服务</text>
          <text class="empty-tips">试试其他关键词吧</text>
        </view>
      </scroll-view>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      searchHistory: ['空调维修', '冰箱清洗', '洗衣机不转', '电视黑屏'],
      hotSearchList: [
        '空调维修',
        '冰箱不制冷',
        '洗衣机维修',
        '电视黑屏',
        '热水器维修',
        '燃气灶打不着火',
        '油烟机清洗',
        '空调清洗',
        '冰箱清洗',
        '洗衣机清洗'
      ],
      searchResults: [],
      loading: false,
      hasMore: true,
      page: 1,
      pageSize: 10
    }
  },
  onLoad() {
    this.loadSearchHistory()
  },
  methods: {
    // 加载搜索历史
    loadSearchHistory() {
      try {
        const history = uni.getStorageSync('searchHistory')
        if (history) {
          this.searchHistory = history
        }
      } catch (e) {
        console.log('加载搜索历史失败')
      }
    },
    
    // 保存搜索历史
    saveSearchHistory() {
      try {
        uni.setStorageSync('searchHistory', this.searchHistory)
      } catch (e) {
        console.log('保存搜索历史失败')
      }
    },
    
    // 搜索输入
    handleInput() {
      if (this.searchKeyword) {
        this.debounceSearch()
      } else {
        this.searchResults = []
      }
    },
    
    // 防抖搜索
    debounceSearch() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.handleSearch()
      }, 500)
    },
    
    // 执行搜索
    async handleSearch() {
      if (!this.searchKeyword.trim()) return
      
      this.loading = true
      this.page = 1
      
      // 添加到搜索历史
      this.addToHistory(this.searchKeyword.trim())
      
      try {
        // 模拟API调用
        await this.mockSearch()
      } catch (error) {
        console.log('搜索失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 模拟搜索
    mockSearch() {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockResults = [
            {
              id: 1,
              name: '空调维修清洗服务',
              description: '专业空调维修，清洗保养，24小时上门服务',
              image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop',
              price: '89',
              sales: 1250,
              rating: 4.8
            },
            {
              id: 2,
              name: '冰箱不制冷维修',
              description: '冰箱不制冷、漏水、噪音大等问题专业维修',
              image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop',
              price: '120',
              sales: 856,
              rating: 4.9
            },
            {
              id: 3,
              name: '洗衣机故障检修',
              description: '洗衣机不转、漏水、不排水等故障维修',
              image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=200&h=150&fit=crop',
              price: '95',
              sales: 2100,
              rating: 4.7
            }
          ]
          
          // 根据关键词筛选结果
          const filteredResults = mockResults.filter(item => 
            item.name.includes(this.searchKeyword) || 
            item.description.includes(this.searchKeyword)
          )
          
          if (this.page === 1) {
            this.searchResults = filteredResults
          } else {
            this.searchResults = [...this.searchResults, ...filteredResults]
          }
          
          this.hasMore = this.searchResults.length < 20 // 模拟还有更多数据
          resolve()
        }, 1000)
      })
    },
    
    // 添加到搜索历史
    addToHistory(keyword) {
      const index = this.searchHistory.indexOf(keyword)
      if (index > -1) {
        this.searchHistory.splice(index, 1)
      }
      this.searchHistory.unshift(keyword)
      if (this.searchHistory.length > 10) {
        this.searchHistory = this.searchHistory.slice(0, 10)
      }
      this.saveSearchHistory()
    },
    
    // 清空搜索
    clearSearch() {
      this.searchKeyword = ''
      this.searchResults = []
    },
    
    // 清空历史
    clearHistory() {
      uni.showModal({
        title: '提示',
        content: '确定要清空搜索历史吗？',
        success: (res) => {
          if (res.confirm) {
            this.searchHistory = []
            this.saveSearchHistory()
          }
        }
      })
    },
    
    // 快速搜索
    quickSearch(keyword) {
      this.searchKeyword = keyword
      this.handleSearch()
    },
    
    // 高亮关键词
    highlightKeyword(text) {
      if (!this.searchKeyword) return text
      const regex = new RegExp(`(${this.searchKeyword})`, 'gi')
      return text.replace(regex, '<span style="color: #007AFF;">$1</span>')
    },
    
    // 加载更多
    loadMore() {
      if (this.loading || !this.hasMore) return
      
      this.page++
      this.handleSearch()
    },
    
    // 服务详情
    goToServiceDetail(service) {
      uni.navigateTo({
        url: `/pages/customer/service/detail?id=${service.id}`
      })
    },
    
    // 返回
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  min-height: 100vh;
  background-color: #f8f8f8;
}

// 搜索头部
.search-header {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;
  
  .search-box {
    flex: 1;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 50rpx;
    padding: 20rpx 30rpx;
    margin-right: 20rpx;
    
    .search-input {
      flex: 1;
      margin: 0 10rpx;
      font-size: 28rpx;
      color: #333;
    }
    
    .clear-btn {
      padding: 0 10rpx;
    }
  }
  
  .cancel-btn {
    font-size: 28rpx;
    color: #666;
  }
}

// 搜索历史
.search-history {
  background: #fff;
  margin: 20rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .history-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }
    
    .clear-history {
      font-size: 26rpx;
      color: #999;
    }
  }
  
  .history-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    
    .history-tag {
      background: #f5f5f5;
      padding: 15rpx 25rpx;
      border-radius: 50rpx;
      font-size: 26rpx;
      color: #666;
    }
  }
}

// 热门搜索
.hot-search {
  background: #fff;
  margin: 20rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  
  .hot-header {
    margin-bottom: 20rpx;
    
    .hot-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .hot-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    
    .hot-tag {
      background: #fff5f0;
      padding: 15rpx 25rpx;
      border-radius: 50rpx;
      font-size: 26rpx;
      color: #ff6b35;
      display: flex;
      align-items: center;
      
      .tag-rank {
        background: #ff6b35;
        color: #fff;
        font-size: 20rpx;
        padding: 2rpx 8rpx;
        border-radius: 50%;
        margin-right: 8rpx;
      }
    }
  }
}

// 搜索结果
.search-results {
  background: #fff;
  margin: 20rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  
  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .result-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }
    
    .result-count {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .result-list {
    max-height: calc(100vh - 200rpx);
    
    .result-item {
      display: flex;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .service-image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
        overflow: hidden;
        
        image {
          width: 100%;
          height: 100%;
        }
      }
      
      .service-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .service-name {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
          margin-bottom: 10rpx;
        }
        
        .service-desc {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 10rpx;
          flex: 1;
        }
        
        .service-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10rpx;
          
          .service-price {
            display: flex;
            align-items: baseline;
            
            .price-symbol {
              font-size: 24rpx;
              color: #ff6b35;
            }
            
            .price-number {
              font-size: 32rpx;
              color: #ff6b35;
              font-weight: bold;
            }
            
            .price-unit {
              font-size: 24rpx;
              color: #999;
              margin-left: 5rpx;
            }
          }
          
          .service-sales {
            font-size: 24rpx;
            color: #999;
          }
        }
        
        .service-rating {
          display: flex;
          align-items: center;
          
          .rating-text {
            font-size: 24rpx;
            color: #ff6b35;
            margin-left: 5rpx;
          }
        }
      }
    }
    
    .load-more {
      text-align: center;
      padding: 20rpx;
      font-size: 26rpx;
      color: #999;
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 100rpx 0;
      
      .empty-text {
        font-size: 30rpx;
        color: #333;
        margin-top: 20rpx;
      }
      
      .empty-tips {
        font-size: 26rpx;
        color: #999;
        margin-top: 10rpx;
      }
    }
  }
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>