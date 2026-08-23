<template>
  <view class="page" v-if="resume">
    <nav-bar title="简历详情" :back="true" />

    <view class="content">
      <!-- 基本信息 -->
      <view class="head-card card">
        <view class="avatar">{{ resume.name[0] }}</view>
        <text class="name">{{ resume.name }}</text>
        <text class="sub">{{ resume.location }}</text>
        <view class="tags">
          <text v-for="(t, i) in resume.tags" :key="i" class="tag">{{ t }}</text>
        </view>
      </view>

      <!-- 求职意向 -->
      <view class="section-title">
        <text class="title">求职意向</text>
      </view>
      <view class="card">
        <view class="line">
          <text class="k">意向岗位</text>
          <text class="v">{{ resume.jobWant }}</text>
        </view>
        <view class="line">
          <text class="k">从业经验</text>
          <text class="v">{{ resume.years }} 年 · {{ resume.cuisine }}</text>
        </view>
        <view class="line">
          <text class="k">期望薪资</text>
          <text class="v highlight">{{ resume.salary }}</text>
        </view>
        <view class="line">
          <text class="k">到店距离</text>
          <text class="v">{{ resume.distance }} km</text>
        </view>
      </view>

      <!-- 个人介绍 -->
      <view class="section-title">
        <text class="title">个人介绍</text>
      </view>
      <view class="card">
        <text class="intro">{{ resume.intro }}</text>
      </view>

      <!-- 联系方式 -->
      <view class="section-title">
        <text class="title">联系方式</text>
      </view>
      <view class="card">
        <view class="line">
          <text class="k">手机号</text>
          <text class="v">{{ resume.phone }}</text>
        </view>
        <view class="line">
          <text class="k">投递时间</text>
          <text class="v">{{ resume.appliedAt }}</text>
        </view>
      </view>

      <view class="bottom-space" />
    </view>

    <view class="action-bar">
      <view class="action-btn ghost" @click="onChat">
        <z-icon name="chat" :size="18" color="#ef5a2a" />
        <text>沟通</text>
      </view>
      <view class="action-btn primary" @click="onInterview">
        <z-icon name="calendar" :size="18" color="#fff" />
        <text>约面试</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getResumeDetail } from '@/api/resume'
import { createInterview } from '@/api/interview'
import { toast, success } from '@/utils/feedback'

const resume = ref(null)

function onChat() {
  uni.navigateTo({ url: '/pages/chat/index' })
}

function onInterview() {
  uni.showActionSheet({
    itemList: ['明天 14:30 到店', '后天 10:00 到店', '电话沟通后定'],
    success: async (res) => {
      const times = ['明天 14:30 到店', '后天 10:00 到店', '电话沟通后定']
      try {
        await createInterview({
          candidateName: resume.value.name,
          jobTitle: resume.value.jobWant,
          time: times[res.tapIndex],
          location: '湘里湘亲 · 江南西店',
          status: 'upcoming',
        })
        success('已约面试')
      } catch (e) {}
    },
  })
}

onLoad(async (options) => {
  try {
    resume.value = await getResumeDetail(options.id)
  } catch (e) {
    resume.value = null
  }
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $paper;
  padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
}

.content {
  padding: 0 32rpx;
}

.head-card {
  margin-top: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 32rpx;

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 36rpx;
    background: $yellow;
    color: #534521;
    font-size: 52rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .name {
    margin-top: 20rpx;
    font-size: 36rpx;
    font-weight: 700;
  }

  .sub {
    font-size: 24rpx;
    color: $muted;
    margin-top: 6rpx;
  }

  .tags {
    display: flex;
    gap: 10rpx;
    margin-top: 20rpx;
  }
}

.line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;

  .k {
    color: $muted;
    font-size: 26rpx;
  }

  .v {
    font-size: 26rpx;
    font-weight: 600;

    &.highlight {
      color: $orange;
    }
  }
}

.intro {
  font-size: 26rpx;
  line-height: 1.8;
  color: #3c4c4e;
}

.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  display: flex;
  gap: 20rpx;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 253, 247, 0.97);
  border-top: 1rpx solid $line;

  .action-btn {
    flex: 1;
    height: 92rpx;
    border-radius: 999rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    font-size: 30rpx;
    font-weight: 700;

    &.ghost {
      border: 1rpx solid $orange;
      color: $orange;
    }

    &.primary {
      background: $orange;
      color: #fff;
      box-shadow: 0 12rpx 28rpx rgba(239, 90, 42, 0.3);
    }
  }
}
</style>
