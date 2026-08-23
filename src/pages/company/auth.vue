<template>
  <view class="page">
    <nav-bar title="公司认证" :back="true" />

    <view class="content">
      <!-- 认证状态提示 -->
      <view v-if="company" class="status-card card" :class="'s' + company.authStatus">
        <text class="status-title">{{ statusText }}</text>
        <text v-if="company.authStatus === 3 && company.rejectReason" class="reject">
          驳回原因：{{ company.rejectReason }}
        </text>
        <text v-if="company.authStatus === 2" class="status-sub">审核通过后即可发布岗位，请耐心等待</text>
        <text v-if="company.authStatus === 1" class="status-sub">已认证公司，可以发布岗位了</text>
      </view>

      <view class="form-card card">
        <view class="form-title">公司信息</view>

        <view class="form-item">
          <text class="label">公司名称 *</text>
          <input v-model="form.name" class="input" placeholder="营业执照上的公司全称" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">统一社会信用代码 *</text>
          <input v-model="form.creditCode" class="input" placeholder="18 位信用代码" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">法人姓名</text>
          <input v-model="form.legalPerson" class="input" placeholder="选填" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">联系电话</text>
          <input v-model="form.contactPhone" class="input" type="number" maxlength="11" placeholder="方便平台联系" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">公司地址</text>
          <input v-model="form.address" class="input" placeholder="选填" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">营业执照照片</text>
          <view class="license-box" @click="chooseImage">
            <image v-if="form.licenseImage" :src="form.licenseImage" class="license-img" mode="aspectFill" />
            <view v-else class="license-placeholder">
              <z-icon name="camera" :size="28" color="#a7b1b0" />
              <text>点击上传营业执照</text>
            </view>
          </view>
        </view>
      </view>

      <view class="tip-box">
        <text class="tip-title">认证说明</text>
        <text class="tip-content">· 提交后进入人工审核，通常 1-2 个工作日\n· 认证通过后才能发布岗位\n· 信息仅用于平台审核，不会对外展示</text>
      </view>

      <view class="bottom-space" />
    </view>

    <view class="submit-bar">
      <view class="submit-btn" :class="{ disabled: submitting }" @click="onSubmit">
        {{ submitting ? '提交中...' : (company ? '重新提交审核' : '提交认证') }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getMyCompany, createCompany, updateCompany } from '@/api/company'
import { uploadImage } from '@/api/upload'
import { toast, success } from '@/utils/feedback'

const company = ref(null)
const submitting = ref(false)

const form = reactive({
  name: '',
  creditCode: '',
  legalPerson: '',
  contactPhone: '',
  address: '',
  licenseImage: '',
})

const statusText = computed(() => {
  const s = company.value?.authStatus
  if (s === 1) return '✅ 已认证'
  if (s === 2) return '⏳ 审核中'
  if (s === 3) return '❌ 认证被驳回'
  return '未认证'
})

function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    success: async (res) => {
      const path = res.tempFilePaths[0]
      try {
        toast('上传中...')
        const url = await uploadImage(path)
        form.licenseImage = url
        success('上传成功')
      } catch (e) {
        toast('上传失败')
      }
    },
  })
}

async function onSubmit() {
  if (!form.name.trim()) return toast('请填写公司名称')
  if (!form.creditCode.trim()) return toast('请填写统一社会信用代码')
  if (submitting.value) return
  submitting.value = true
  try {
    if (company.value) {
      await updateCompany({ ...form })
    } else {
      await createCompany({ ...form })
    }
    success(company.value ? '已重新提交审核' : '认证已提交')
    setTimeout(() => uni.navigateBack(), 800)
  } catch (e) {
    toast(e.message || '提交失败')
  } finally {
    submitting.value = false
  }
}

onLoad(async () => {
  try {
    const c = await getMyCompany()
    if (c) {
      company.value = c
      Object.assign(form, {
        name: c.name || '',
        creditCode: c.creditCode || '',
        legalPerson: c.legalPerson || '',
        contactPhone: c.contactPhone || '',
        address: c.address || '',
        licenseImage: c.licenseImage || '',
      })
    }
  } catch (e) {}
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $paper;
  padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
}

.content {
  padding: 0 32rpx;
}

.status-card {
  margin-top: 16rpx;
  padding: 28rpx;
  border-radius: 28rpx;

  &.s1 {
    background: #dceee7;
    color: #268577;
  }

  &.s2 {
    background: #fff4e0;
    color: #b7791f;
  }

  &.s3 {
    background: #fde8e4;
    color: #c0392b;
  }

  &.s0 {
    background: #f0f0ea;
    color: $muted;
  }

  .status-title {
    display: block;
    font-size: 30rpx;
    font-weight: 700;
  }

  .status-sub,
  .reject {
    display: block;
    margin-top: 8rpx;
    font-size: 22rpx;
    line-height: 1.5;
  }
}

.form-card {
  margin-top: 24rpx;
  padding: 28rpx;

  .form-title {
    font-size: 28rpx;
    font-weight: 700;
    margin-bottom: 16rpx;
  }
}

.form-item {
  padding: 16rpx 0;

  .label {
    display: block;
    font-size: 24rpx;
    color: $muted;
    margin-bottom: 12rpx;
  }

  .input {
    height: 76rpx;
    background: #f3f2ec;
    border-radius: 18rpx;
    padding: 0 24rpx;
    font-size: 26rpx;
  }
}

.license-box {
  height: 240rpx;
  border-radius: 18rpx;
  overflow: hidden;
  background: #f3f2ec;

  .license-img {
    width: 100%;
    height: 100%;
  }

  .license-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    color: #a7b1b0;
    font-size: 24rpx;
  }
}

.tip-box {
  margin-top: 32rpx;
  background: #dceee7;
  border-radius: 28rpx;
  padding: 26rpx 28rpx;
  color: #37726b;

  .tip-title {
    display: block;
    font-size: 28rpx;
    font-weight: 700;
    margin-bottom: 6rpx;
  }

  .tip-content {
    display: block;
    font-size: 22rpx;
    line-height: 1.7;
    white-space: pre-line;
  }
}

.submit-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 253, 247, 0.97);
  border-top: 1rpx solid $line;

  .submit-btn {
    height: 96rpx;
    border-radius: 999rpx;
    background: $orange;
    color: #fff;
    font-size: 32rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12rpx 28rpx rgba(239, 90, 42, 0.3);

    &.disabled {
      opacity: 0.6;
    }
  }
}

.ph {
  color: #b3bcba;
}
</style>
