<template>
  <view class="page">
    <nav-bar title="在招职位" :back="true" />

    <view class="content">
      <view v-for="j in jobs" :key="j.id" class="job-card card">
        <view class="job-top">
          <view class="logo" :style="{ background: j.logoColor || '#e65a37' }">
            <text>{{ j.logoText || j.title[0] }}</text>
          </view>
          <view class="info">
            <text class="title">{{ j.title }}</text>
            <text class="company">{{ j.restaurant }}</text>
          </view>
          <text class="salary">{{ j.salary }}</text>
        </view>

        <view class="job-stats">
          <text class="stat">{{ j.candidates }} 位候选人</text>
          <text class="stat">{{ j.viewed }} 次浏览</text>
          <text class="stat">发布于 {{ j.createdAt }}</text>
        </view>

        <view class="job-actions">
          <view
            class="status-chip"
            :class="j.status === 'open' ? 'on' : 'off'"
            @click="toggle(j)"
          >
            {{ j.status === 'open' ? '招聘中' : '已下架' }}
          </view>
          <view class="actions-right">
            <view class="ghost-btn" @click="goResumes(j)">看简历</view>
            <view class="ghost-btn" @click="goEdit(j)">编辑</view>
          </view>
        </view>
      </view>

      <view v-if="!jobs.length">
        <empty icon="clipboard-list" text="还没有发布过岗位" action-text="去发布" @action="goPost" />
      </view>

      <view class="bottom-space" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMyJobs, updateJobStatus } from '@/api/job'
import { toast } from '@/utils/feedback'

const jobs = ref([])

function goPost() {
  uni.navigateTo({ url: '/pages/job/post' })
}

function goResumes(j) {
  uni.navigateTo({ url: '/pages/resume/list?jobId=' + j.id })
}

function goEdit(j) {
  toast('编辑岗位')
}

async function toggle(j) {
  const next = j.status === 'open' ? 'closed' : 'open'
  try {
    await updateJobStatus(j.id, next)
    j.status = next
    toast(next === 'open' ? '已上架' : '已下架')
  } catch (e) {}
}

async function load() {
  try {
    const res = await getMyJobs({ page: 1, pageSize: 50 })
    jobs.value = res.list || []
  } catch (e) {
    jobs.value = []
  }
}

onShow(load)
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

.job-card {
  margin-top: 24rpx;

  .job-top {
    display: flex;
    align-items: center;
    gap: 20rpx;

    .logo {
      width: 76rpx;
      height: 76rpx;
      border-radius: 22rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40rpx;
      font-weight: 700;
      color: #fff;
      flex: none;
    }

    .info {
      flex: 1;
      min-width: 0;

      .title {
        display: block;
        font-size: 30rpx;
        font-weight: 700;
      }

      .company {
        display: block;
        font-size: 22rpx;
        color: $muted;
        margin-top: 6rpx;
      }
    }

    .salary {
      font-size: 28rpx;
      font-weight: 700;
      color: $orange;
      white-space: nowrap;
    }
  }

  .job-stats {
    display: flex;
    gap: 26rpx;
    margin-top: 20rpx;
    padding-top: 18rpx;
    border-top: 1rpx solid $line;

    .stat {
      font-size: 22rpx;
      color: $muted;
    }
  }

  .job-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20rpx;

    .status-chip {
      padding: 10rpx 22rpx;
      border-radius: 999rpx;
      font-size: 22rpx;

      &.on {
        background: #dceee7;
        color: #268577;
      }

      &.off {
        background: #f0f0ea;
        color: $muted;
      }
    }

    .actions-right {
      display: flex;
      gap: 16rpx;

      .ghost-btn {
        padding: 10rpx 24rpx;
        border-radius: 999rpx;
        border: 1rpx solid $line;
        font-size: 22rpx;
        color: #5c6c6e;
        background: #fff;
      }
    }
  }
}

.bottom-space {
  height: 40rpx;
}
</style>
