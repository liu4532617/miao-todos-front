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

/* 个人信息卡 — 与招聘/求职广场 hero 同语言 */
.profile-head {
  position: relative;
  margin-top: 28rpx;
  border-radius: $radius-xl;
  padding: 40rpx 36rpx 36rpx;
  overflow: hidden;
  color: $paper;
  background: #263f42;

  &::before {
    content: '';
    position: absolute;
    right: -60rpx;
    bottom: -90rpx;
    width: 330rpx;
    height: 330rpx;
    border: 34rpx solid $yellow;
    border-radius: 50%;
    opacity: 0.95;
  }

  &::after {
    content: '';
    position: absolute;
    right: 66rpx;
    top: 40rpx;
    width: 130rpx;
    height: 130rpx;
    background: $orange;
    border-radius: 48% 52% 48% 55%;
    transform: rotate(25deg);
    box-shadow: -36rpx 60rpx 0 -8rpx $jade;
  }

  .avatar-wrap {
    position: relative;
    z-index: 1;
    width: 112rpx;
    height: 112rpx;
    border-radius: 50%;
    overflow: visible;
  }

  .avatar-img {
    width: 112rpx;
    height: 112rpx;
    border-radius: 50%;
    border: 4rpx solid rgba(255, 253, 247, 0.9);
    background: $yellow;
    display: block;
  }

  .avatar-edit {
    position: absolute;
    right: -4rpx;
    bottom: -4rpx;
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background: rgba($ink, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3rpx solid rgba(255, 253, 247, 0.9);
  }

  .name {
    position: relative;
    z-index: 1;
    display: block;
    margin-top: 18rpx;
    font-size: 34rpx;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sub {
    position: relative;
    z-index: 1;
    display: block;
    margin-top: 4rpx;
    font-size: 20rpx;
    color: #c8d4c7;
  }

  .profile-stats {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 52rpx;
    margin-top: 32rpx;

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
        color: #c8d4c7;
      }
    }
  }
}

/* 区块小标题(与广场页分组标题一致) */
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 40rpx 0 18rpx;

  .title {
    font-size: 26rpx;
    font-weight: 700;
    color: $muted;
    letter-spacing: 1rpx;
  }
}

.my-menu {
  border: 1rpx solid $line;
  border-radius: $radius-card;
  background: #fff;
  overflow: hidden;
}

.my-row {
  height: 104rpx;
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
    font-size: 28rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .row-tag {
    flex: none;
    font-size: 20rpx;
    padding: 4rpx 16rpx;
    border-radius: 999rpx;
    background: $jade-wash;
    color: #268577;

    &.pending {
      background: $yellow-wash;
      color: #b7791f;
    }
  }
}

.tip-box {
  margin-top: 40rpx;
  background: $jade-wash;
  border-radius: $radius-card;
  padding: 26rpx 28rpx;
  color: #268577;

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
