<template>
  <view class="page">
    <nav-bar title="我的" />

    <view class="content">
      <!-- 个人信息卡 -->
      <view class="profile-head" @click="onProfileClick">
        <view class="avatar-wrap">
          <image class="avatar-img" :src="user.avatar || DEFAULT_AVATAR" mode="aspectFill" @click.stop="onChangeAvatar" />
          <view class="avatar-edit">
            <z-icon name="camera" :size="16" color="#fff" />
          </view>
        </view>
        <text class="name">{{ user.name || '登录后体验完整功能' }}</text>
        <text class="sub" v-if="user.name">{{ authText(user.companyAuth) }} · {{ user.city || '未设置城市' }}</text>
        <text class="sub" v-else>登录后可投递简历、收藏职位</text>
        <view class="profile-stats">
          <view class="stat" @click="goApplications">
            <text class="num">{{ stats.applications }}</text>
            <text class="label">投递记录</text>
          </view>
          <view class="stat" @click="goFavorites">
            <text class="num">{{ stats.favorites }}</text>
            <text class="label">收藏职位</text>
          </view>
          <view class="stat" @click="goMyProducts">
            <text class="num">{{ stats.products }}</text>
            <text class="label">发布闲置</text>
          </view>
        </view>
      </view>

      <!-- 我的服务 -->
      <view class="section-title">
        <text class="title">我的服务</text>
      </view>
      <view class="my-menu">
        <view class="my-row" v-for="item in services" :key="item.name" @click="go(item.url)">
          <z-icon :name="item.icon" :size="18" color="#ef5a2a" />
          <text class="row-name">{{ item.name }}</text>
          <z-icon name="chevron-right" :size="16" color="#a7b1b0" />
        </view>
      </view>

      <!-- 常用设置 -->
      <view class="section-title">
        <text class="title">常用设置</text>
      </view>
      <view class="my-menu">
        <view class="my-row" @click="go('/pages/company/auth')">
          <z-icon name="building" :size="18" color="#ef5a2a" />
          <text class="row-name">公司认证</text>
          <text class="row-tag" v-if="user.companyAuth === 1">已认证</text>
          <text class="row-tag pending" v-else-if="companyPending">审核中</text>
          <z-icon name="chevron-right" :size="16" color="#a7b1b0" />
        </view>
        <view class="my-row" @click="go('/pages/settings/index')">
          <z-icon name="settings" :size="18" color="#ef5a2a" />
          <text class="row-name">设置</text>
          <z-icon name="chevron-right" :size="16" color="#a7b1b0" />
        </view>
      </view>

      <!-- 提示条 -->
      <view class="tip-box">
        <text class="tip-title">今天也辛苦了</text>
        <text class="tip-content">有 2 个职位查看了你的简历，去沟通一下吧。</text>
      </view>

      <view class="bottom-space" />
    </view>

    <tab-bar :current="3" />
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'
import { getMyCompany } from '@/api/company'
import { updateProfile } from '@/api/auth'
import { uploadImage } from '@/api/upload'
import { toast } from '@/utils/feedback'

const DEFAULT_AVATAR = '/static/default-avatar.png'

const store = useUserStore()

const user = computed(() => store.userInfo || {})
const stats = computed(() => store.stats)
const companyPending = ref(false)

const services = [
  { name: '我的简历', icon: 'document-text', url: '/pages/resume/my' },
  { name: '沟通记录', icon: 'chat', url: '/pages/chat/index' },
  { name: '我的发布', icon: 'box', url: '/pages/market/post' },
]

function go(url) {
  uni.navigateTo({ url })
}

function onProfileClick() {
  if (!store.token) {
    uni.navigateTo({ url: '/pages/login/index' })
  }
}

/** 点击头像: 拍照/相册 → 上传 → 保存头像 */
function onChangeAvatar() {
  if (!store.token) {
    return uni.navigateTo({ url: '/pages/login/index' })
  }
  uni.showActionSheet({
    itemList: ['拍照', '从相册选择'],
    success: (res) => {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: res.tapIndex === 0 ? ['camera'] : ['album'],
        success: async (r) => {
          const path = r.tempFilePaths[0]
          if (!path) return
          uni.showLoading({ title: '上传中...' })
          try {
            const url = await uploadImage(path)
            await updateProfile({ avatar: url })
            await store.fetchProfile()
            toast('头像已更新')
          } catch (e) {
            toast('头像上传失败，请重试')
          } finally {
            uni.hideLoading()
          }
        },
      })
    },
  })
}

function goApplications() {
  toast('投递记录')
}

function goFavorites() {
  toast('收藏职位')
}

function goMyProducts() {
  uni.navigateTo({ url: '/pages/market/post' })
}

function onSwitchRole() {
  uni.navigateTo({ url: '/pages/company/auth' })
}

function authText(auth) {
  if (auth === 1) return '公司已认证'
  if (companyPending.value) return '公司认证审核中'
  return '未认证公司'
}

async function onShowHandler() {
  if (store.token) {
    store.fetchProfile()
    try {
      const company = await getMyCompany()
      companyPending.value = !!(company && company.authStatus === 2)
    } catch (e) {}
  }
  store.fetchStats()
}

onShow(onShowHandler)
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

.profile-head {
  position: relative;
  margin-top: 24rpx;
  background: #294649;
  border-radius: 36rpx;
  color: #fff;
  padding: 36rpx;
  overflow: hidden;

  &::after {
    content: '灶';
    position: absolute;
    right: 20rpx;
    bottom: -42rpx;
    color: #386064;
    font-size: 210rpx;
    font-weight: 800;
    line-height: 1;
  }

  .avatar-wrap {
    width: 112rpx;
    height: 112rpx;
    border-radius: 50%;
    position: relative;
    z-index: 1;
    overflow: visible;
  }

  .avatar-img {
    width: 112rpx;
    height: 112rpx;
    border-radius: 50%;
    border: 4rpx solid rgba(255, 255, 255, 0.9);
    background: #ffd45d;
    display: block;
  }

  .avatar-edit {
    position: absolute;
    right: -4rpx;
    bottom: -4rpx;
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background: rgba(23, 41, 44, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3rpx solid rgba(255, 255, 255, 0.9);
  }

  .name {
    display: block;
    margin-top: 18rpx;
    font-size: 34rpx;
    font-weight: 700;
    position: relative;
    z-index: 1;
  }

  .sub {
    display: block;
    margin-top: 4rpx;
    font-size: 20rpx;
    color: #c4d5d0;
    position: relative;
    z-index: 1;
  }

  .profile-stats {
    display: flex;
    gap: 52rpx;
    margin-top: 32rpx;
    position: relative;
    z-index: 1;

    .stat {
      .num {
        display: block;
        font-size: 30rpx;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .label {
        display: block;
        font-size: 20rpx;
        color: #c4d5d0;
      }
    }
  }
}

.my-menu {
  border: 1rpx solid $line;
  border-radius: 28rpx;
  background: #fff;
  overflow: hidden;
}

.my-row {
  height: 100rpx;
  padding: 0 28rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  border-bottom: 1rpx solid $line;

  &:last-child {
    border-bottom: 0;
  }

  .row-name {
    flex: 1;
    font-size: 26rpx;
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
    line-height: 1.5;
  }
}

.bottom-space {
  height: 40rpx;
}
</style>
