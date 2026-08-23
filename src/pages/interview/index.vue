<template>
  <view class="page">
    <nav-bar title="面试安排" :back="true" />

    <view class="content">
      <view class="filter-row">
        <view
          v-for="f in filters"
          :key="f.value"
          class="chip"
          :class="{ active: currentFilter === f.value }"
          @click="currentFilter = f.value"
        >
          {{ f.label }}
        </view>
      </view>

      <view v-for="it in interviews" :key="it.id" class="interview-card card">
        <view class="date-block">
          <text class="date">{{ formatDate(it.time).d }}</text>
          <text class="month">{{ formatDate(it.time).m }}</text>
        </view>

        <view class="info">
          <view class="title-row">
            <text class="title">{{ it.jobTitle }}</text>
            <view class="status-chip" :class="it.status">
              {{ statusText(it.status) }}
            </view>
          </view>
          <text class="line"><z-icon name="user" :size="12" color="#718083" /> {{ it.candidateName }}</text>
          <text class="line"><z-icon name="clock" :size="12" color="#718083" /> {{ it.time }}</text>
          <text class="line"><z-icon name="map-pin" :size="12" color="#718083" /> {{ it.location }}</text>
          <text v-if="it.remark" class="remark">备注：{{ it.remark }}</text>
        </view>
      </view>

      <view v-if="!interviews.length">
        <empty icon="calendar" text="暂无面试安排" />
      </view>

      <view class="bottom-space" />
    </view>

    <view class="add-bar">
      <view class="add-btn" @click="onAdd">
        <z-icon name="plus" :size="20" color="#fff" weight="2.4" />
        <text>新增面试</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getInterviews, updateInterview } from '@/api/interview'
import { toast, success } from '@/utils/feedback'

const filters = [
  { label: '全部', value: 'all' },
  { label: '待面试', value: 'upcoming' },
  { label: '已完成', value: 'done' },
  { label: '已取消', value: 'cancelled' },
]
const currentFilter = ref('all')

const interviews = ref([])

function statusText(s) {
  const map = { upcoming: '待面试', done: '已完成', cancelled: '已取消' }
  return map[s] || s
}

function formatDate(time) {
  const m = /(\d+)-(\d+) (\d+):(\d+)/.exec(time)
  if (m) return { d: m[2], m: `${m[1]}月` }
  return { d: time.slice(0, 2), m: '月' }
}

function onAdd() {
  uni.showModal({
    title: '新增面试',
    editable: true,
    placeholderText: '输入候选人姓名，如：王师傅',
    confirmColor: '#ef5a2a',
    success: (res) => {
      if (res.confirm && res.content) {
        toast(`已创建 ${res.content} 的面试，等待填写时间`)
      }
    },
  })
}

async function load() {
  try {
    const res = await getInterviews()
    let list = res.list || []
    if (currentFilter.value !== 'all') {
      list = list.filter((x) => x.status === currentFilter.value)
    }
    interviews.value = list
  } catch (e) {
    interviews.value = []
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

.interview-card {
  margin-top: 24rpx;
  display: flex;
  gap: 24rpx;

  .date-block {
    width: 96rpx;
    height: 96rpx;
    border-radius: 24rpx;
    background: #f5dcd1;
    color: $orange-dark;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: none;

    .date {
      font-size: 32rpx;
      font-weight: 700;
      line-height: 1.2;
    }

    .month {
      font-size: 20rpx;
    }
  }

  .info {
    flex: 1;
    min-width: 0;

    .title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-size: 30rpx;
        font-weight: 700;
      }

      .status-chip {
        font-size: 20rpx;
        padding: 4rpx 14rpx;
        border-radius: 999rpx;

        &.upcoming {
          background: #ffe4d7;
          color: #d94b23;
        }

        &.done {
          background: #dceee7;
          color: #268577;
        }

        &.cancelled {
          background: #f0f0ea;
          color: $muted;
        }
      }
    }

    .line {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 22rpx;
      color: $muted;
      margin-top: 8rpx;
    }

    .remark {
      display: block;
      font-size: 22rpx;
      color: #5c6c6e;
      margin-top: 10rpx;
      background: #f6f6f0;
      border-radius: 12rpx;
      padding: 10rpx 14rpx;
    }
  }
}

.add-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 253, 247, 0.97);
  border-top: 1rpx solid $line;

  .add-btn {
    height: 96rpx;
    border-radius: 999rpx;
    background: $orange;
    color: #fff;
    font-size: 30rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
  }
}
</style>
