<template>
  <view class="page">
    <nav-bar title="设置" :back="true" />

    <view class="content">
      <view class="my-menu">
        <view class="my-row" @click="onNotify">
          <text class="row-name">消息通知</text>
          <switch :checked="notify" color="#ef5a2a" @change="notify = $event.detail.value" />
        </view>
        <view class="my-row" @click="onLocation">
          <text class="row-name">常驻商圈</text>
          <view class="row-right">
            <text class="row-value">广州 · 海珠区</text>
            <z-icon name="chevron-right" :size="16" color="#a7b1b0" />
          </view>
        </view>
        <view class="my-row" @click="onPrivacy">
          <text class="row-name">隐私设置</text>
          <z-icon name="chevron-right" :size="16" color="#a7b1b0" />
        </view>
        <view class="my-row" @click="onAbout">
          <text class="row-name">关于厨神帮</text>
          <z-icon name="chevron-right" :size="16" color="#a7b1b0" />
        </view>
      </view>

      <view class="my-menu">
        <view class="my-row" @click="onClearCache">
          <text class="row-name">清除缓存</text>
          <view class="row-right">
            <text class="row-value">2.4MB</text>
            <z-icon name="chevron-right" :size="16" color="#a7b1b0" />
          </view>
        </view>
      </view>

      <view class="logout-btn" @click="onLogout">退出登录</view>

      <view class="version">厨神帮 v1.0.0</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { toast } from '@/utils/feedback'

const store = useUserStore()
const notify = ref(true)

function onNotify() {}
function onLocation() {
  toast('选择常驻商圈')
}
function onPrivacy() {
  toast('隐私设置')
}
function onAbout() {
  uni.showModal({ title: '关于厨神帮', content: '面向餐饮从业者的本地招聘、求职与设备流转平台。', showCancel: false })
}
function onClearCache() {
  toast('缓存已清除')
}
function onLogout() {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前账号吗？',
    confirmColor: '#ef5a2a',
    success: async (res) => {
      if (res.confirm) {
        await store.logout()
        toast('已退出登录')
        setTimeout(() => uni.reLaunch({ url: '/pages/mine/index' }), 600)
      }
    },
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $paper;
  padding-bottom: calc(60rpx + env(safe-area-inset-bottom));
}

.content {
  padding: 0 32rpx;
}

.my-menu {
  margin-top: 28rpx;
  border: 1rpx solid $line;
  border-radius: 28rpx;
  background: #fff;
  overflow: hidden;
}

.my-row {
  height: 104rpx;
  padding: 0 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid $line;

  &:last-child {
    border-bottom: 0;
  }

  .row-name {
    font-size: 28rpx;
  }

  .row-right {
    display: flex;
    align-items: center;
    gap: 8rpx;

    .row-value {
      font-size: 24rpx;
      color: $muted;
    }
  }
}

.logout-btn {
  margin-top: 48rpx;
  height: 96rpx;
  border-radius: 28rpx;
  background: #fff;
  border: 1rpx solid $line;
  color: $orange;
  font-size: 30rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.version {
  margin-top: 32rpx;
  text-align: center;
  color: #a7b1b0;
  font-size: 22rpx;
}
</style>
