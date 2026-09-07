<template>
  <view class="page">
    <nav-bar :title="'求职广场'" />

    <view class="content">
      <!-- 求职卡片广场 -->
      <view class="feed-head">
        <text class="feed-title">附近的人正在找活</text>
        <text class="feed-sub">求职卡片 · 附近 · 最新</text>
      </view>

      <view v-if="seekCards.length" class="seek-list">
        <view v-for="s in seekCards" :key="s.id" class="seek-card card" @click="goSeekDetail(s)">
          <view class="sk-avatar" :style="{ background: s.avatar ? 'transparent' : '#f3eee2' }">
            <image v-if="s.avatar" class="sk-avatar-img" :src="s.avatar" mode="aspectFill" />
            <text v-else>{{ (s.name || 'TA')[0] }}</text>
          </view>
          <view class="sk-body">
            <view class="sk-top">
              <text class="sk-name">{{ s.name || '匿名' }} · {{ s.jobWant || s.title || '求职中' }}</text>
              <text class="sk-go">聊 ›</text>
            </view>
            <text class="sk-line">{{ s.workYears || '' }} {{ s.salary || '' }} · {{ s.availableTime || '随时到岗' }}</text>
            <view class="sk-tags">
              <text v-if="s.needAccommodation" class="tag">需包吃住</text>
              <text v-if="s.contactVisibility === 'PUBLIC'" class="tag blue">📞 电话公开</text>
              <text v-else-if="s.contactVisibility === 'PRIVATE'" class="tag lock">🔒 私密</text>
              <text v-else class="tag">💬 聊后解锁</text>
            </view>
          </view>
        </view>
      </view>
      <view v-else-if="!loading" class="empty-wrap">
        <empty
          icon="compass"
          text="还没有求职卡"
          subText="发布第一张求职卡，让老板直接找到你"
          action-text="去发布"
          @action="goPostResume"
        />
      </view>

      <view v-if="loading" class="loading-wrap">
        <text class="loading-text">加载中...</text>
      </view>
      <view class="bottom-space" />
    </view>

    <!-- 悬浮发布:发求职卡 -->
    <view class="float-add" @click="goPostResume">
      <z-icon name="plus" :size="24" color="#fff" weight="2.4" />
    </view>

    <tab-bar :current="1" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getSeekCards } from '@/api/resume'

const seekCards = ref([])
const loading = ref(false)

function goPostResume() {
  uni.navigateTo({ url: '/pages/resume/my?from=jobseek' })
}

function goSeekDetail(s) {
  uni.navigateTo({ url: `/pages/resume/detail?id=${s.id}` })
}

async function load() {
  loading.value = true
  try {
    seekCards.value = await getSeekCards()
  } catch (e) {
    seekCards.value = []
  }
  loading.value = false
}

onShow(load)
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

/* 广场头部 */
.feed-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 32rpx 4rpx 8rpx;

  .feed-title {
    font-size: 34rpx;
    font-weight: 800;
    letter-spacing: -1rpx;
    color: $ink;
  }

  .feed-sub {
    font-size: 22rpx;
    color: $muted;
  }
}

/* 求职卡 */
.seek-list {
  margin-top: 12rpx;
}

.seek-card {
  display: flex;
  gap: 20rpx;
  align-items: center;
  margin-top: 20rpx;
  padding: 24rpx;

  .sk-avatar {
    width: 88rpx;
    height: 88rpx;
    border-radius: 26rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    font-weight: 700;
    color: #fff;
    flex: none;
    overflow: hidden;

    .sk-avatar-img {
      width: 100%;
      height: 100%;
    }
  }

  .sk-body {
    flex: 1;
    min-width: 0;

    .sk-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12rpx;

      .sk-name {
        font-size: 28rpx;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sk-go {
        font-size: 22rpx;
        font-weight: 700;
        color: $orange;
        flex: none;
      }
    }

    .sk-line {
      display: block;
      font-size: 22rpx;
      color: $muted;
      margin-top: 6rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .sk-tags {
      display: flex;
      gap: 8rpx;
      margin-top: 10rpx;
      flex-wrap: wrap;

      .tag {
        font-size: 18rpx;
        font-weight: 600;
        border-radius: 8rpx;
        padding: 4rpx 12rpx;
        background: $orange-wash;
        color: #c0561e;

        &.blue {
          background: $wash;
          color: #3d62b0;
        }

        &.lock {
          background: #f3f0e8;
          color: #7d776a;
        }
      }
    }
  }
}

.empty-wrap,
.loading-wrap {
  padding: 60rpx 0;
}

.loading-text {
  display: block;
  text-align: center;
  color: $muted;
  font-size: 24rpx;
}

.float-add {
  position: fixed;
  right: 40rpx;
  bottom: calc(180rpx + env(safe-area-inset-bottom));
  z-index: 800;
  width: 92rpx;
  height: 92rpx;
  border-radius: 30rpx;
  background: $orange;
  box-shadow: 0 14rpx 32rpx rgba(239, 90, 42, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-space {
  height: 40rpx;
}
</style>
