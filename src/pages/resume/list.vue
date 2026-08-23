<template>
  <view class="page">
    <nav-bar title="人才简历" :back="true" />

    <view class="content">
      <view class="filter-row">
        <view
          v-for="f in filters"
          :key="f"
          class="chip"
          :class="{ active: currentFilter === f }"
          @click="currentFilter = f"
        >
          {{ f }}
        </view>
      </view>

      <view v-for="r in resumes" :key="r.id" class="resume-card card" @click="goDetail(r)">
        <view class="resume-top">
          <view class="avatar">{{ r.name[0] }}</view>
          <view class="info">
            <view class="name-row">
              <text class="name">{{ r.name }}</text>
              <view class="status-chip" :class="r.status">
                {{ statusText(r.status) }}
              </view>
            </view>
            <text class="want">求职意向：{{ r.jobWant }}</text>
          </view>
          <z-icon name="chevron-right" :size="16" color="#a7b1b0" />
        </view>

        <view class="resume-tags">
          <text class="tag">{{ r.years }}年经验</text>
          <text class="tag">{{ r.cuisine }}</text>
          <text class="tag">{{ r.salary }}</text>
          <text class="tag">距店 {{ r.distance }} km</text>
        </view>

        <view class="resume-foot">
          <text class="time">{{ r.appliedAt }}</text>
          <view class="action-btn" @click.stop="onContact(r)">立即沟通</view>
        </view>
      </view>

      <view v-if="!resumes.length">
        <empty icon="document-text" text="还没有收到简历" subText="发布岗位后会出现在这里" />
      </view>

      <view class="bottom-space" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getResumes } from '@/api/resume'
import { toast } from '@/utils/feedback'

const filters = ['全部', '新简历', '已约面试']
const currentFilter = ref('全部')

const resumes = ref([])

function statusText(s) {
  return s === 'interview' ? '已约面试' : '新简历'
}

function goDetail(r) {
  uni.navigateTo({ url: `/pages/resume/detail?id=${r.id}` })
}

function onContact(r) {
  uni.navigateTo({ url: '/pages/chat/index' })
}

async function load() {
  try {
    const res = await getResumes()
    let list = res.list || []
    if (currentFilter.value === '新简历') list = list.filter((x) => x.status === 'new')
    if (currentFilter.value === '已约面试') list = list.filter((x) => x.status === 'interview')
    resumes.value = list
  } catch (e) {
    resumes.value = []
  }
}

onLoad(load)
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

.filter-row {
  display: flex;
  gap: 16rpx;
  margin-top: 8rpx;

  .chip {
    padding: 12rpx 28rpx;
    border-radius: 999rpx;
    background: #eff0ea;
    color: #5c6c6e;
    font-size: 24rpx;

    &.active {
      background: $ink;
      color: #fff;
    }
  }
}

.resume-card {
  margin-top: 24rpx;

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
        gap: 14rpx;

        .name {
          font-size: 30rpx;
          font-weight: 700;
        }

        .status-chip {
          font-size: 20rpx;
          padding: 4rpx 14rpx;
          border-radius: 999rpx;

          &.new {
            background: #ffe4d7;
            color: #d94b23;
          }

          &.interview {
            background: #dcefe9;
            color: #268577;
          }
        }
      }

      .want {
        display: block;
        font-size: 22rpx;
        color: $muted;
        margin-top: 6rpx;
      }
    }
  }

  .resume-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    margin-top: 22rpx;
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

    .action-btn {
      padding: 10rpx 30rpx;
      border-radius: 999rpx;
      background: $orange;
      color: #fff;
      font-size: 24rpx;
      font-weight: 600;
    }
  }
}

.bottom-space {
  height: 40rpx;
}
</style>
