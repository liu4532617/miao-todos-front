<template>
  <view class="page">
    <view class="deco deco-1" />
    <view class="deco deco-2" />

    <view class="brand">
      <view class="brand-mark">
        <z-icon name="chef-hat" :size="26" color="#fff" />
      </view>
      <text class="brand-name">灶台招工</text>
      <text class="slogan">让合适的人，找到合适的灶台</text>
    </view>

    <view class="login-card">
      <view class="form-item">
        <text class="label">账号</text>
        <input v-model="username" class="input" placeholder="请输入用户名或手机号" placeholder-class="ph" />
      </view>
      <view class="form-item">
        <text class="label">密码</text>
        <input v-model="password" class="input" password placeholder="请输入密码" placeholder-class="ph" @confirm="onLogin" />
      </view>

      <view class="login-btn" :class="{ loading }" @click="onLogin">
        {{ loading ? '登录中...' : '登录' }}
      </view>

      <view class="agree">
        <text class="check">✓</text>
        <text class="agree-text">已阅读并同意《用户协议》和《隐私政策》</text>
      </view>
    </view>

    <text class="footer">登录即代表你是一名热爱灶台的餐饮人</text>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { login } from '@/api/auth'
import { useUserStore } from '@/store/user'
import { toast, success } from '@/utils/feedback'

const store = useUserStore()
const username = ref('')
const password = ref('')
const loading = ref(false)

async function onLogin() {
  if (!username.value.trim()) return toast('请输入账号')
  if (!password.value) return toast('请输入密码')

  loading.value = true
  try {
    const res = await login({ username: username.value.trim(), password: password.value })
    await store.login(res)
    success('登录成功')
    setTimeout(() => {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        uni.reLaunch({ url: '/pages/tools/index' })
      }
    }, 600)
  } catch (e) {
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $paper;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 72rpx;
  position: relative;
  overflow: hidden;
}

.deco {
  position: absolute;
  border-radius: 50%;

  &.deco-1 {
    width: 340rpx;
    height: 340rpx;
    background: rgba(255, 211, 92, 0.4);
    top: -120rpx;
    right: -90rpx;
  }

  &.deco-2 {
    width: 420rpx;
    height: 420rpx;
    background: rgba(65, 168, 153, 0.15);
    bottom: -180rpx;
    left: -140rpx;
  }
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;

  .brand-mark {
    width: 112rpx;
    height: 112rpx;
    background: $orange;
    border-radius: 36rpx 36rpx 36rpx 10rpx;
    transform: rotate(-5deg);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .brand-name {
    margin-top: 28rpx;
    font-size: 44rpx;
    font-weight: 800;
    letter-spacing: 4rpx;
  }

  .slogan {
    margin-top: 12rpx;
    font-size: 26rpx;
    color: $muted;
  }
}

.login-card {
  width: 100%;

  .form-item {
    margin-bottom: 28rpx;

    .label {
      display: block;
      font-size: 24rpx;
      color: $muted;
      margin-bottom: 12rpx;
    }

    .input {
      height: 92rpx;
      background: #f3f2ec;
      border-radius: 22rpx;
      padding: 0 28rpx;
      font-size: 28rpx;
      flex: 1;
    }
  }

  .login-btn {
    margin-top: 40rpx;
    height: 100rpx;
    border-radius: 999rpx;
    background: $orange;
    color: #fff;
    font-size: 32rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 16rpx 36rpx rgba(239, 90, 42, 0.35);

    &.loading {
      opacity: 0.7;
    }
  }

  .agree {
    margin-top: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;

    .check {
      width: 30rpx;
      height: 30rpx;
      border-radius: 50%;
      background: $jade;
      color: #fff;
      font-size: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .agree-text {
      font-size: 22rpx;
      color: $muted;
    }
  }
}

.footer {
  position: absolute;
  bottom: calc(60rpx + env(safe-area-inset-bottom));
  font-size: 22rpx;
  color: #a7b1b0;
}

.ph {
  color: #b3bcba;
}
</style>
