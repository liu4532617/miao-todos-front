<template>
  <view class="page" v-if="job">
    <nav-bar title="职位详情" :back="true" />

    <view class="content">
      <!-- 职位头部 -->
      <view class="job-head card">
        <view class="job-top">
          <view class="logo" :style="{ background: job.logoColor || '#e65a37' }">
            <text>{{ job.logoText || job.title[0] }}</text>
          </view>
          <view class="info">
            <text class="title">{{ job.title }}</text>
            <text class="company">{{ job.restaurant }}</text>
          </view>
          <text class="salary">{{ job.salary }}</text>
        </view>

        <view class="tags">
          <text v-for="(t, i) in job.tags" :key="i" class="tag">{{ t }}</text>
        </view>

        <view class="meta-grid">
          <view class="meta">
            <z-icon name="wallet" :size="14" color="#718083" />
            <text>月薪 {{ job.salary }}</text>
          </view>
          <view class="meta">
            <z-icon name="clock" :size="14" color="#718083" />
            <text>{{ job.fulltime ? '全职' : '兼职/钟点' }}</text>
          </view>
          <view class="meta">
            <z-icon name="map-pin" :size="14" color="#718083" />
            <text>{{ job.location || job.district }}</text>
          </view>
          <view class="meta">
            <z-icon name="user" :size="14" color="#718083" />
            <text>{{ job.headcount }} 人</text>
          </view>
        </view>
      </view>

      <!-- 职位描述 -->
      <view class="section-title">
        <text class="title">职位描述</text>
      </view>
      <view class="card">
        <view class="desc-line">
          <text class="desc-label">要求经验</text>
          <text class="desc-value">{{ job.experience }}</text>
        </view>
        <view class="desc-line">
          <text class="desc-label">学历要求</text>
          <text class="desc-value">{{ job.education }}</text>
        </view>
        <view class="desc-line">
          <text class="desc-label">工作性质</text>
          <text class="desc-value">{{ job.fulltime ? '全职' : '兼职/钟点' }}</text>
        </view>
        <view class="desc-line">
          <text class="desc-label">发布信息</text>
          <text class="desc-value">浏览 {{ job.viewed }} · 投递 {{ job.candidates }}</text>
        </view>
        <view class="desc-line">
          <text class="desc-label">发布时间</text>
          <text class="desc-value">{{ job.createdAt }}</text>
        </view>
        <view class="desc-divider" />
        <text class="desc-text">{{ job.description }}</text>
      </view>

      <!-- 任职要求 -->
      <view v-if="job.requirement" class="section-title">
        <text class="title">任职要求</text>
      </view>
      <view v-if="job.requirement" class="card">
        <text class="desc-text">{{ job.requirement }}</text>
      </view>

      <!-- 门店信息 -->
      <view class="section-title">
        <text class="title">门店信息</text>
      </view>
      <view class="card store-card">
        <view class="store-top">
          <view class="store-logo">
            <z-icon name="store" :size="18" color="#fff" />
          </view>
          <view class="store-info">
            <text class="store-name">{{ job.restaurant }}</text>
            <text class="store-addr">广州市{{ job.district }} · 地铁 8 号线附近</text>
          </view>
        </view>
      </view>

      <view class="bottom-space" />
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="action-fav" @click="onFavorite">
        <z-icon name="star" :size="22" :color="favorited ? '#ef5a2a' : '#84908e'" />
        <text class="fav-text">{{ favorited ? '已收藏' : '收藏' }}</text>
      </view>
      <view class="action-btn" @click="onApply">{{ applied ? '已投递' : '立即沟通' }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getJobDetail, applyJob, favoriteJob } from '@/api/job'
import { toast, success } from '@/utils/feedback'

const job = ref(null)
const favorited = ref(false)
const applied = ref(false)

function onFavorite() {
  favorited.value = !favorited.value
  favoriteJob(job.value.id, favorited.value).then(() => {
    toast(favorited.value ? '已收藏岗位' : '已取消收藏')
  })
}

async function onApply() {
  try {
    await applyJob(job.value.id)
    applied.value = true
    success('投递成功')
  } catch (e) {}
}

onLoad(async (options) => {
  try {
    const data = await getJobDetail(options.id)
    job.value = data
    favorited.value = !!data.favorited
    applied.value = !!data.applied
  } catch (e) {
    job.value = null
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

.job-head {
  margin-top: 16rpx;
}

.job-top {
  display: flex;
  align-items: center;
  gap: 20rpx;

  .logo {
    width: 84rpx;
    height: 84rpx;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 44rpx;
    font-weight: 700;
    color: #fff;
    flex: none;
  }

  .info {
    flex: 1;
    min-width: 0;

    .title {
      display: block;
      font-size: 34rpx;
      font-weight: 700;
    }

    .company {
      display: block;
      font-size: 24rpx;
      color: $muted;
      margin-top: 6rpx;
    }
  }

  .salary {
    font-size: 32rpx;
    font-weight: 700;
    color: $orange;
    white-space: nowrap;
  }
}

.tags {
  display: flex;
  gap: 10rpx;
  margin: 24rpx 0 26rpx;
}

.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18rpx 24rpx;
  border-top: 1rpx solid $line;
  padding-top: 22rpx;

  .meta {
    display: flex;
    align-items: center;
    gap: 10rpx;
    font-size: 24rpx;
    color: #5c6c6e;
  }
}

.desc-line {
  display: flex;
  justify-content: space-between;
  padding: 14rpx 0;

  .desc-label {
    color: $muted;
    font-size: 24rpx;
  }

  .desc-value {
    font-size: 24rpx;
    font-weight: 600;
  }
}

.desc-divider {
  height: 1rpx;
  background: $line;
  margin: 18rpx 0;
}

.desc-text {
  font-size: 26rpx;
  line-height: 1.8;
  color: #3c4c4e;
}

.store-card {
  .store-top {
    display: flex;
    gap: 20rpx;
    align-items: center;
  }

  .store-logo {
    width: 72rpx;
    height: 72rpx;
    border-radius: 22rpx;
    background: $jade;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
  }

  .store-info {
    .store-name {
      display: block;
      font-size: 28rpx;
      font-weight: 700;
    }

    .store-addr {
      display: block;
      font-size: 22rpx;
      color: $muted;
      margin-top: 6rpx;
    }
  }
}

.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 253, 247, 0.97);
  border-top: 1rpx solid $line;

  .action-fav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rpx;

    .fav-text {
      font-size: 20rpx;
      color: $muted;
    }
  }

  .action-btn {
    flex: 1;
    height: 92rpx;
    border-radius: 999rpx;
    background: $orange;
    color: #fff;
    font-size: 30rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12rpx 28rpx rgba(239, 90, 42, 0.3);
  }
}
</style>
