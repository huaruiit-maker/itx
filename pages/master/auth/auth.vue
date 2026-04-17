<template>
  <view class="master-auth-container">
    <view class="auth-header">
      <text class="auth-title">师傅认证</text>
      <text class="auth-subtitle">完成认证后即可接单维修服务</text>
    </view>
    
    <view class="auth-form">
      <u-form :model="authForm" ref="authFormRef" :rules="rules">
        <!-- 基本信息 -->
        <view class="form-section">
          <text class="section-title">基本信息</text>
          
          <u-form-item label="师傅姓名" prop="name">
            <u-input 
              v-model="authForm.name" 
              placeholder="请输入真实姓名"
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
          
          <u-form-item label="工作经验" prop="experience">
            <u-input 
              v-model="authForm.experience" 
              placeholder="请输入工作经验（年）"
              border="bottom"
              type="number"
            />
          </u-form-item>
          
          <u-form-item label="服务区域" prop="serviceAreas">
            <u-input 
              v-model="authForm.serviceAreas" 
              placeholder="请输入服务区域（如：朝阳区、海淀区）"
              border="bottom"
            />
          </u-form-item>
        </view>
        
        <!-- 身份证信息 -->
        <view class="form-section">
          <text class="section-title">身份证信息</text>
          
          <u-form-item label="身份证号" prop="idCard">
            <u-input 
              v-model="authForm.idCard" 
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
        
        <!-- 技能证书 -->
        <view class="form-section">
          <text class="section-title">技能证书</text>
          
          <u-form-item label="技能证书" prop="skillCertificates">
            <view class="upload-section">
              <view class="upload-box" @tap="uploadCertificates">
                <u-icon name="camera" size="48" color="#999999" v-if="authForm.skillCertificates.length === 0"></u-icon>
                <view v-else class="certificate-preview">
                  <image v-for="(img, index) in authForm.skillCertificates" :key="index" :src="img" mode="aspectFit"></image>
                </view>
                <text class="upload-text">{{authForm.skillCertificates.length > 0 ? '重新上传' : '点击上传'}}</text>
              </view>
            </view>
          </u-form-item>
        </view>
        
        <!-- 服务技能 -->
        <view class="form-section">
          <text class="section-title">服务技能</text>
          
          <u-form-item label="技能类型" prop="skillTypes">
            <view class="skill-types">
              <view 
                class="type-tag" 
                v-for="type in skillTypeOptions" 
                :key="type.value"
                :class="{active: authForm.skillTypes.includes(type.value)}"
                @tap="toggleSkillType(type.value)"
              >
                {{type.label}}
              </view>
            </view>
          </u-form-item>
          
          <u-form-item label="技能描述" prop="skillDesc">
            <u-input 
              v-model="authForm.skillDesc" 
              placeholder="请描述您的专业技能和经验"
              border="bottom"
              type="textarea"
              :auto-height="false"
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
        experience: '',
        serviceAreas: '',
        idCard: '',
        idCardFront: '',
        idCardBack: '',
        skillCertificates: [],
        skillTypes: [],
        skillDesc: ''
      },
      skillTypeOptions: [
        { label: '空调维修', value: 'air_conditioner' },
        { label: '冰箱维修', value: 'refrigerator' },
        { label: '洗衣机维修', value: 'washing_machine' },
        { label: '电视维修', value: 'tv' },
        { label: '热水器维修', value: 'water_heater' },
        { label: '燃气灶维修', value: 'gas_stove' },
        { label: '微波炉维修', value: 'microwave' },
        { label: '水电维修', value: 'plumbing' },
        { label: '其他', value: 'other' }
      ],
      rules: {
        name: [
          { required: true, message: '请输入师傅姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '姓名长度在2-20个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        experience: [
          { required: true, message: '请输入工作经验', trigger: 'blur' },
          { pattern: /^\d+$/, message: '请输入有效的年份', trigger: 'blur' }
        ],
        serviceAreas: [
          { required: true, message: '请输入服务区域', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/i, message: '请输入正确的身份证号', trigger: 'blur' }
        ],
        idCardFront: [
          { required: true, message: '请上传身份证正面', trigger: 'change' }
        ],
        idCardBack: [
          { required: true, message: '请上传身份证反面', trigger: 'change' }
        ],
        skillTypes: [
          { type: 'array', required: true, message: '请至少选择一个技能类型', trigger: 'change' }
        ],
        skillDesc: [
          { required: true, message: '请输入技能描述', trigger: 'blur' },
          { min: 10, max: 500, message: '技能描述长度在10-500个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 切换技能类型
    toggleSkillType(value) {
      const index = this.authForm.skillTypes.indexOf(value)
      if (index > -1) {
        this.authForm.skillTypes.splice(index, 1)
      } else {
        this.authForm.skillTypes.push(value)
      }
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
    
    // 上传技能证书
    uploadCertificates() {
      uni.chooseImage({
        count: 5,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.authForm.skillCertificates = res.tempFilePaths
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
                  // 设置师傅认证状态
                  uni.setStorageSync('masterAuth', true)
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
.master-auth-container {
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

.skill-types {
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
      background-color: rgba(82, 196, 26, 0.1);
      color: #52c41a;
      border-color: #52c41a;
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
  
  .certificate-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    width: 100%;
    height: 100%;
    
    image {
      width: 60rpx;
      height: 60rpx;
      border-radius: 8rpx;
    }
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