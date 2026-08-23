<template>
  <view class="job-card" hover-class="job-card-hover" @click="$emit('click', job)">
    <view class="job-top">
      <view class="logo" :style="{ background: job.logoColor || '#e65a37' }">
        <text>{{ job.logoText || job.title[0] }}</text>
      </view>
      <view class="job-info">
        <text class="job-title ellipsis">{{ job.title }}</text>
        <text class="job-company ellipsis">{{ job.restaurant }}</text>
      </view>
      <text class="salary">{{ job.salary }}</text>
    </view>

    <view v-if="job.tags && job.tags.length" class="tags">
      <text v-for="(t, i) in job.tags.slice(0, 4)" :key="i" class="tag">{{ t }}</text>
    </view>

    <view class="job-foot">
      <z-icon name="map-pin" :size="13" color="#718083" />
      <text class="distance">距你 {{ job.distance }} km</text>
      <view class="action" @click.stop="$emit('action', job)">
        {{ job.actionText || '立即沟通' }}
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  job: { type: Object, required: true },
})

defineEmits(['click', 'action'])
</script>

<style lang="scss" scoped>
.job-card {
  margin: 20rpx 32rpx 0;
  background: #fff;
  border: 1rpx solid $line;
  border-radius: $radius-lg;
  padding: 26rpx;
}

.job-card-hover {
  transform: scale(0.99);
  opacity: 0.96;
}

.job-top {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.logo {
  width: 76rpx;
  height: 76rpx;
  border-radius: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'PingFang SC', sans-serif;
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  flex: none;
}

.job-info {
  flex: 1;
  min-width: 0;

  .job-title {
    display: block;
    font-size: 30rpx;
    font-weight: 700;
    line-height: 1.3;
  }

  .job-company {
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
  font-variant-numeric: tabular-nums;
}

.tags {
  display: flex;
  gap: 10rpx;
  margin: 22rpx 0 20rpx;

  .tag {
    font-size: 20rpx;
    background: #f2f2ec;
    color: #6b7878;
    padding: 8rpx 12rpx;
    border-radius: 10rpx;
  }
}

.job-foot {
  border-top: 1rpx solid $line;
  padding-top: 18rpx;
  display: flex;
  align-items: center;
  color: $muted;
  font-size: 22rpx;

  .distance {
    margin-left: 6rpx;
  }

  .action {
    margin-left: auto;
    color: $orange;
    font-size: 24rpx;
    font-weight: 700;
    padding: 4rpx 8rpx;
  }
}
</style>
