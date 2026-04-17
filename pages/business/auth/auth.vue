<template>
  <view class="business-auth-container">
    <view class="auth-header">
      <text class="auth-title">商家认证</text>
      <text class="auth-subtitle">完成认证后即可发布服务和管理订单</text>
    </view>
    
    <view class="auth-form">
      <u-form :model="authForm" ref="authFormRef" :rules="rules">
        <!-- 基本信息 -->
        <view class="form-section">
          <text class="section-title">基本信息</text>
          
          <u-form-item label="商家名称" prop="name">
            <u-input 
              v-model="authForm.name" 
              placeholder="请输入商家名称"
              border="bottom"
            />
          </u-form-item>
          
          <u-form-item label="联系电话" prop="phone">
            <u-input 
              v-model="authForm.phone" 
              placeholder="请输入联系电话"
              border="bottom"
              type="number"
            />
          </u-form-item>
          
          <u-form-item label="营业地址" prop="address">
            <u-input 
              v-model="authForm.address" 
              placeholder="请输入营业地址"
              border="bottom"
              type="textarea"
              :auto-height="false"
            />
          </u-form-item>
        </view>
        
        <!-- 营业执照 -->
        <view class="form-section">
          <text class="section-title">营业执照</text>
          
          <u-form-item label="营业执照号" prop="licenseNumber">
            <u-input 
              v-model="authForm.licenseNumber" 
              placeholder="请输入营业执照号"
              border="bottom"
            />
          </u-form-item>
          
          <u-form-item label="营业执照" prop="licenseImage">
            <view class="upload-section">
              <view class="upload-box" @tap="uploadLicense">
                <u-icon name="camera" size="48" color="#999999" v-if="!authForm.licenseImage"></u-icon>
                <image v-else :src="authForm.licenseImage" mode="aspectFit"></image>
                <text class="upload-text">{{authForm.licenseImage ? '重新上传' : '点击上传'}}</text>
              </view>
            </view>
          </u-form-item>
        </view>
        
        <!-- 身份证信息 -->
        <view class="form-section">
          <text class="section-title">法人身份证</text>
          
          <u-form-item label="法人姓名" prop="legalName">
            <u-input 
              v-model="authForm.legalName" 
              placeholder="请输入法人姓名"
              border="bottom"
            />
          </u-form-item>
          
          <u-form-item label="身份证号" prop="legalIdCard">
            <u-input 
              v-model="authForm.legalIdCard" 
              placeholder="请输入身份证号"
              border="bottom"
            />
          </u-form-item>
          
          <u-form-item label="身份证正面" prop="idCardFront">
            <view class="upload-section">
              <view class="upload-box" @tap="uploadIdCardFront">
                <u-icon name="camera" size="48" color="#999999" v-if="!authForm.idCardFront"></u-icon>
                <image v-else :src="authForm.idCardFront" mode="aspectFit"></image>
                <text class="upload-text">{{authForm.idCardFront ? '重新上传' : '点击上传'}}</text>
              </view>
            </view>
          </u-form-item>
          
          <u-form-item label="身份证反面" prop="idCardBack">
            <view class="upload-section">
              <view class="upload-box" @tap="uploadIdCardBack">
                <u-icon name="camera" size="48" color="#999999" v-if="!authForm.idCardBack"></u-icon>
                <image v-else :src="authForm.idCardBack" mode="aspectFit"></image>
                <text class="upload-text">{{authForm.idCardBack ? '重新上传' : '点击上传'}}</text>
              </view>
            </view>
          </u-form-item>
        </view>
        
        <!-- 服务信息 -->
        <view class="form-section">
          <text class="section-title">服务信息</text>
          
          <u-form-item label="服务类型" prop="serviceTypes">
            <view class="service-types">
              <view 
                class="type-tag" 
                v-for="type in serviceTypeOptions" 
                :key="type.value"
                :class="{active: authForm.serviceTypes.includes(type.value)}"
                @tap="toggleServiceType(type.value)"
              >
                {{type.label}}
              </view>
            </view>
          </u-form-item>
          
          <u-form-item label="服务区域" prop="serviceAreas">
            <u-input 
              v-model="authForm.serviceAreas" 
              placeholder="请输入服务区域（如：朝阳区、海淀区）"
              border="bottom"
            />
          </u-form-item>
        </view>
      </u-form>
    </view>
    
    <!-- 提交按钮 -->
    <view class="submit-section">
      <u-button type="primary" @click="submitAuth">提交认证</u-button>
      <text class="submit-tips">我们将在1-3个工作日内完成审核</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      authForm: {
        name: '',
        phone: '',
        address: '',
        licenseNumber: '',
        licenseImage: '',
        legalName: '',
        legalIdCard: '',
        idCardFront: '',
        idCardBack: '',
        serviceTypes: [],
        serviceAreas: ''
      },
      serviceTypeOptions: [
        { label: '空调维修', value: 'air_conditioner' },
        { label: '冰箱维修', value: 'refrigerator' },
        { label: '洗衣机维修', value: 'washing_machine' },
        { label: '电视维修', value: 'tv' },
        { label: '热水器维修', value: 'water_heater' },
        { label: '燃气灶维修', value: 'gas_stove' },
        { label: '微波炉维修', value: 'microwave' },
        { label: '其他', value: 'other' }
      ],
      rules: {
        name: [
          { required: true, message: '请输入商家名称', trigger: 'blur' },
          { min: 2, max: 50, message: '商家名称长度在2-50个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入营业地址', trigger: 'blur' }
        ],
        licenseNumber: [
          { required: true, message: '请输入营业执照号', trigger: 'blur' }
        ],
        licenseImage: [
          { required: true, message: '请上传营业执照', trigger: 'change' }
        ],
        legalName: [
          { required: true, message: '请输入法人姓名', trigger: 'blur' }
        ],
        legalIdCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/i, message: '请输入正确的身份证号', trigger: 'blur' }
        ],
        idCardFront: [
          { required: true, message: '请上传身份证正面', trigger: 'change' }
        ],
        idCardBack: [
          { required: true, message: '请上传身份证反面', trigger: 'change' }
        ],
        serviceTypes: [
          { type: 'array', required: true, message: '请至少选择一个服务类型', trigger: 'change' }
        ],
        serviceAreas: [
          { required: true, message: '请输入服务区域', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 切换服务类型
    toggleServiceType(value) {
      const index = this.authForm.serviceTypes.indexOf(value)
      if (index > -1) {
        this.authForm.serviceTypes.splice(index, 1)
      } else {
        this.authForm.serviceTypes.push(value)
      }
    },
    
    // 上传营业执照
    uploadLicense() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.authForm.licenseImage = res.tempFilePaths[0]
        }
      })
    },
    
    // 上传身份证正面
    uploadIdCardFront() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.authForm.idCardFront = res.tempFilePaths[0]
        }
      })
    },
    
    // 上传身份证反面
    uploadIdCardBack() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.authForm.idCardBack = res.tempFilePaths[0]
        }
      })
    },
    
    // 提交认证
    submitAuth() {
      this.$refs.authFormRef.validate(valid => {
        if (valid) {
          uni.showModal({
            title: '确认提交',
            content: '请确认填写的信息准确无误，提交后将进入审核流程',
            success: (res) => {
              if (res.confirm) {
                uni.showLoading({
                  title: '提交中...',
                  mask: true
                })
                
                // 模拟提交认证
                setTimeout(() => {
                  uni.hideLoading()
                  // 设置商家认证状态
                  uni.setStorageSync('businessAuth', true)
                  uni.showToast({
                    title: '提交成功',
                    icon: 'success',
                    success: () => {
                      setTimeout(() => {
                        uni.navigateBack()
                      }, 1500)
                    }
                  })
                }, 2000)
              }
            }
          })
        } else {
          uni.showToast({
            title: '请完善必填信息',
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.business-auth-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 20rpx;
}

.auth-header {
  text-align: center;
  margin-bottom: 40rpx;
  padding: 40rpx 0;
  
  .auth-title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 16rpx;
  }
  
  .auth-subtitle {
    display: block;
    font-size: 28rpx;
    color: #999999;
  }
}

.auth-form {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
}

.form-section {
  margin-bottom: 40rpx;
  
  .section-title {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 30rpx;
  }
}

.service-types {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  
  .type-tag {
    padding: 12rpx 24rpx;
    background-color: #f8f8f8;
    border-radius: 24rpx;
    font-size: 24rpx;
    color: #666666;
    border: 2rpx solid transparent;
    
    &.active {
      background-color: rgba(0, 122, 255, 0.1);
      color: #007AFF;
      border-color: #007AFF;
    }
  }
}

.upload-section {
  padding: 20rpx 0;
}

.upload-box {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #999999;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  
  image {
    width: 100%;
    height: 100%;
    border-radius: 16rpx;
  }
  
  .upload-text {
    font-size: 24rpx;
    color: #999999;
  }
}

.submit-section {
  padding: 0 20rpx 40rpx;
  
  .submit-tips {
    display: block;
    text-align: center;
    font-size: 24rpx;
    color: #999999;
    margin-top: 20rpx;
  }
}
</style>