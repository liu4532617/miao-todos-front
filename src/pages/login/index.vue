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
      <!-- #ifdef MP-WEIXIN -->
      <view class="wx-login-btn" :class="{ loading }" @click="onWxLogin">
        <text>{{ wxLoading ? '微信登录中...' : '微信一键登录' }}</text>
      </view>
      <view class="divider"><text>或使用账号密码</text></view>
      <!-- #endif -->

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

    <!-- #ifdef MP-WEIXIN -->
    <!-- 微信头像昵称引导(登录后未设置头像时弹出) -->
    <view v-if="showAvatarGuide" class="guide-mask" @click.self="skipGuide">
      <view class="guide-card">
        <text class="guide-title">完善头像和昵称</text>
        <text class="guide-sub">让老板更容易记住你</text>
        <button class="avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          <image v-if="avatarTemp" class="avatar-img" :src="avatarTemp" mode="aspectFill" />
          <view v-else class="avatar-ph">选择微信头像</view>
        </button>
        <input v-model="nickname" class="nickname-input" type="nickname" placeholder="填写昵称" placeholder-class="ph" />
        <view class="guide-btns">
          <view class="guide-btn ghost" @click="skipGuide">跳过</view>
          <view class="guide-btn main" @click="saveAvatar">保存</view>
        </view>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { login, wxLogin, updateProfile } from '@/api/auth'
import { uploadImage } from '@/api/upload'
import { useUserStore } from '@/store/user'
import { toast, success } from '@/utils/feedback'

const store = useUserStore()
const username = ref('')
const password = ref('')
const loading = ref(false)
const wxLoading = ref(false)
const showAvatarGuide = ref(false)
const avatarTemp = ref('')
const nickname = ref('')

function afterLogin() {
  success('登录成功')
  setTimeout(() => {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack()
    } else {
      uni.reLaunch({ url: '/pages/tools/index' })
    }
  }, 600)
}

async function onLogin() {
  if (!username.value.trim()) return toast('请输入账号')
  if (!password.value) return toast('请输入密码')

  loading.value = true
  try {
    const res = await login({ username: username.value.trim(), password: password.value })
    await store.login(res)
    afterLogin()
  } catch (e) {
  } finally {
    loading.value = false
  }
}

/** 微信一键登录 */
async function onWxLogin() {
  if (wxLoading.value) return
  wxLoading.value = true
  try {
    const { code } = await uni.login({ provider: 'weixin' })
    if (!code) throw new Error('获取微信登录凭证失败')
    const res = await wxLogin({ code })
    await store.login(res)
    // 新用户或没头像 → 引导设置微信头像昵称
    if (!store.userInfo?.avatar || !store.userInfo?.name || store.userInfo?.name === '微信用户') {
      nickname.value = store.userInfo?.name === '微信用户' ? '' : (store.userInfo?.name || '')
      showAvatarGuide.value = true
    } else {
      afterLogin()
    }
  } catch (e) {
    toast(e?.message || '微信登录失败')
  } finally {
    wxLoading.value = false
  }
}

/** 选择微信头像(临时路径 → 上传) */
async function onChooseAvatar(e) {
  const temp = e.detail?.avatarUrl
  if (!temp) return
  avatarTemp.value = temp
}

/** 保存头像昵称 */
async function saveAvatar() {
  try {
    const data = {}
    if (avatarTemp.value) {
      const url = await uploadImage(avatarTemp.value)
      data.avatar = url
    }
    if (nickname.value.trim()) {
      data.nickname = nickname.value.trim()
    }
    if (Object.keys(data).length) {
      await updateProfile(data)
      await store.fetchProfile()
    }
    success('资料已保存')
    showAvatarGuide.value = false
    afterLogin()
  } catch (e) {
    toast('保存失败，请重试')
  }
}

function skipGuide() {
  showAvatarGuide.value = false
  afterLogin()
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
  padding: 0 56rpx;
  position: relative;
  overflow: hidden;
}

.deco {
  position: absolute;
  border-radius: 50%;
  &.deco-1 {
    width: 420rpx;
    height: 420rpx;
    background: $orange;
    opacity: 0.08;
    top: -140rpx;
    right: -120rpx;
  }
  &.deco-2 {
    width: 300rpx;
    height: 300rpx;
    background: $yellow;
    opacity: 0.12;
    bottom: -80rpx;
    left: -100rpx;
  }
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 56rpx;
  position: relative;
  z-index: 1;

  .brand-mark {
    width: 120rpx;
    height: 120rpx;
    border-radius: 36rpx;
    background: $orange;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12rpx 30rpx rgba(214, 74, 30, 0.3);
  }

  .brand-name {
    font-size: 44rpx;
    font-weight: 800;
    color: $ink;
    margin-top: 24rpx;
  }

  .slogan {
    font-size: 24rpx;
    color: $muted;
    margin-top: 10rpx;
  }
}

.login-card {
  width: 100%;
  background: #fff;
  border-radius: 32rpx;
  padding: 40rpx 36rpx;
  box-shadow: 0 16rpx 40rpx rgba(23, 41, 44, 0.06);
  position: relative;
  z-index: 1;
}

.wx-login-btn {
  height: 92rpx;
  border-radius: 24rpx;
  background: #07c160;
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 2rpx;
  box-shadow: 0 10rpx 24rpx rgba(7, 193, 96, 0.25);

  &.loading {
    opacity: 0.6;
  }
}

.divider {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin: 32rpx 0;
  color: #a7b1b0;
  font-size: 22rpx;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1rpx;
    background: $line;
  }
}

.form-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  border-bottom: 1rpx solid $line;
  padding: 22rpx 4rpx;
  margin-bottom: 8rpx;

  .label {
    font-size: 26rpx;
    color: $ink;
    font-weight: 600;
    width: 70rpx;
  }

  .input {
    flex: 1;
    font-size: 28rpx;
  }
}

.login-btn {
  height: 92rpx;
  border-radius: 24rpx;
  background: $orange;
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 36rpx;
  box-shadow: 0 10rpx 24rpx rgba(214, 74, 30, 0.25);

  &.loading {
    opacity: 0.6;
  }
}

.agree {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-top: 28rpx;

  .check {
    color: $orange;
    font-size: 22rpx;
  }

  .agree-text {
    font-size: 20rpx;
    color: $muted;
  }
}

.footer {
  margin-top: 40rpx;
  font-size: 22rpx;
  color: #a7b1b0;
}

/* 头像昵称引导 */
.guide-mask {
  position: fixed;
  inset: 0;
  background: rgba(23, 41, 44, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.guide-card {
  width: 560rpx;
  background: #fff;
  border-radius: 32rpx;
  padding: 48rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .guide-title {
    font-size: 34rpx;
    font-weight: 800;
    color: $ink;
  }

  .guide-sub {
    font-size: 24rpx;
    color: $muted;
    margin-top: 10rpx;
  }
}

.avatar-btn {
  margin-top: 36rpx;
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: #f3eee2;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::after {
    border: none;
  }

  .avatar-img {
    width: 100%;
    height: 100%;
  }

  .avatar-ph {
    font-size: 22rpx;
    color: $muted;
    line-height: 1.4;
    text-align: center;
  }
}

.nickname-input {
  margin-top: 28rpx;
  width: 100%;
  height: 84rpx;
  background: #f3eee2;
  border-radius: 18rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  text-align: center;
}

.guide-btns {
  display: flex;
  gap: 20rpx;
  margin-top: 36rpx;
  width: 100%;

  .guide-btn {
    flex: 1;
    height: 84rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: 700;

    &.ghost {
      background: #f3eee2;
      color: $muted;
    }

    &.main {
      background: $orange;
      color: #fff;
    }
  }
}
</style>
