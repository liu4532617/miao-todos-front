<template>
  <view class="page">
    <nav-bar title="求职">
      <template #right>
        <view class="round-btn" @click="onBell">
          <z-icon name="bell" :size="18" color="#17292c" />
        </view>
      </template>
    </nav-bar>

    <view class="content">
      <!-- 求职横幅 -->
      <view class="hero-card">
        <view class="hero-deco" />
        <text class="eyebrow">YOUR JOB SEEKING NOTE</text>
        <text class="hero-title">发布求职信息，\n让好店找到你。</text>
        <view class="go" @click="goPostResume">
          <text>{{ resume ? '编辑求职信息' : '发布求职' }}</text>
          <z-icon name="arrow-right" :size="14" color="#ffd35c" />
        </view>
      </view>

      <!-- 我的求职 -->
      <view class="section-title">
        <text class="title">我的求职</text>
        <text class="more">按发布日期排序</text>
      </view>

      <view v-if="resume" class="resume-card card" @click="goPostResume">
        <view class="resume-top">
          <view class="avatar">{{ (resume.name || '我')[0] }}</view>
          <view class="info">
            <view class="name-row">
              <text class="name">{{ resume.name }}</text>
              <view class="status-chip">发布中</view>
            </view>
            <text class="want">求职意向：{{ resume.jobWant || '未填写' }}</text>
          </view>
          <z-icon name="chevron-right" :size="16" color="#a7b1b0" />
        </view>

        <view v-if="resume.tags && resume.tags.length" class="resume-tags">
          <text v-for="(t, i) in resume.tags.slice(0, 4)" :key="i" class="tag">{{ t }}</text>
        </view>

        <view class="resume-foot">
          <text class="time">发布于 {{ resume.createdAt }}</text>
          <view class="edit-btn" @click.stop="goPostResume">编辑</view>
        </view>
      </view>

      <view v-if="!loading && !resume" class="empty-wrap">
        <empty
          icon="compass"
          text="还没有发布求职信息"
          subText="发布后，店主就能看到你"
          action-text="去发布"
          @action="goPostResume"
        />
      </view>

      <view v-if="loading" class="loading-wrap">
        <text class="loading-text">加载中...</text>
      </view>
      <view class="bottom-space" />
    </view>

    <!-- 悬浮发布求职按钮 -->
    <view class="float-add" @click="goPostResume">
      <z-icon name="plus" :size="24" color="#fff" weight="2.4" />
    </view>

    <tab-bar :current="1" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMyResume } from '@/api/resume'
import { toast } from '@/utils/feedback'

const resume = ref(null)
const loading = ref(false)

function onBell() {
  toast('求职订阅已开启')
}

function goPostResume() {
  uni.navigateTo({ url: '/pages/resume/my?from=jobseek' })
}

async function load() {
  loading.value = true
  try {
    resume.value = await getMyResume()
  } catch (e) {
    resume.value = null
  } finally {
    loading.value = false
  }
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

.round-btn {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  background: #eef0e9;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hero */
.hero-card {
  position: relative;
  margin-top: 28rpx;
  min-height: 300rpx;
  border-radius: 40rpx;
  padding: 34rpx;
  overflow: hidden;
  color: #fffdf7;
  background: #2e5548;

  .hero-deco {
    position: absolute;
    right: -44rpx;
    bottom: -88rpx;
    width: 346rpx;
    height: 346rpx;
    border: 36rpx solid $jade;
    border-radius: 50%;
    opacity: 0.95;

    &::after {
      content: '';
      position: absolute;
      right: 110rpx;
      top: -70rpx;
      width: 140rpx;
      height: 140rpx;
      background: $yellow;
      border-radius: 48% 52% 48% 55%;
      transform: rotate(25deg);
      box-shadow: -38rpx 64rpx 0 -8rpx $orange;
    }
  }

  .eyebrow {
    display: block;
    font-size: 18rpx;
    letter-spacing: 2rpx;
    color: #cde0d7;
    position: relative;
    z-index: 1;
  }

  .hero-title {
    display: block;
    margin-top: 16rpx;
    font-size: 46rpx;
    font-weight: 700;
    letter-spacing: -2rpx;
    line-height: 1.3;
    max-width: 430rpx;
    position: relative;
    z-index: 1;
    white-space: pre-line;
  }

  .go {
    margin-top: 26rpx;
    display: inline-flex;
    align-items: center;
    gap: 8rpx;
    color: $yellow;
    font-size: 24rpx;
    font-weight: 700;
    position: relative;
    z-index: 1;
    padding: 8rpx 0;
  }
}

/* 我的求职卡片 */
.resume-card {
  margin-top: 8rpx;

  .resume-top {
    display: flex;
    align-items: center;
    gap: 20rpx;

    .avatar {
      width: 88rpx;
      height: 88rpx;
      border-radius: 26rpx;
      background: $yellow;
      color: #534521;
      font-size: 36rpx;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }

    .info {
      flex: 1;
      min-width: 0;

      .name-row {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .name {
          font-size: 30rpx;
          font-weight: 700;
        }

        .status-chip {
          font-size: 20rpx;
          color: #268577;
          background: #dcefe9;
          padding: 4rpx 14rpx;
          border-radius: 999rpx;
        }
      }

      .want {
        display: block;
        font-size: 24rpx;
        color: $muted;
        margin-top: 8rpx;
      }
    }
  }

  .resume-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    margin-top: 20rpx;
  }

  .resume-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1rpx solid $line;
    margin-top: 20rpx;
    padding-top: 18rpx;

    .time {
      font-size: 22rpx;
      color: $muted;
    }

    .edit-btn {
      font-size: 24rpx;
      font-weight: 700;
      color: $orange;
      padding: 4rpx 8rpx;
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
